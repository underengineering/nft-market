import { spawn, spawnSync } from "node:child_process";
import fs from "node:fs";
import readLine from "node:readline";
import solc from "solc";

const GETH_PATH = process.env.GETH_PATH ?? "./geth";
const DATA_PATH = `${GETH_PATH}/data`;

/**
 * @param {string} name
 * @param {string} contractName
 */
function compileContract(name, contractName) {
    const compilerOptions = {
        language: "Solidity",
        sources: {
            "contract.sol": {
                content: fs.readFileSync(name, {
                    encoding: "utf8",
                }),
            },
        },
        settings: {
            evmVersion: "london",
            outputSelection: {
                "*": {
                    "*": ["*"],
                },
            },
        },
    };

    /** @param {string} path */
    function findImports(path) {
        if (path.startsWith("@openzeppelin/contracts/")) {
            const contents = fs.readFileSync(`./node_modules/${path}`, {
                encoding: "utf8",
            });

            return {
                contents,
            };
        }

        return { error: "File not found" };
    }

    const output = JSON.parse(
        solc.compile(JSON.stringify(compilerOptions), {
            import: findImports,
        })
    ).contracts[name];

    const abi = output[contractName].abi;
    const bytecode = output[contractName].evm.bytecode.object;

    return { abi, bytecode };
}

/**
 * @param {any} abi
 *@param {string} bytecode
 * @returns {Promise<string>} */
function deployContract(abi, bytecode) {
    return new Promise((res) => {
        const deployProc = spawn(
            "geth",
            [
                "attach",
                "--exec",
                `
        const contract = eth.contract(${JSON.stringify(abi)});
        const bytecode = "0x${bytecode}"
        contract.new({ from: eth.accounts[0], data: bytecode }, (err, contract) => {
            if (err)
                console.log("Error", err);
            else if (contract.address)
                console.log("Contract address:", contract.address);
        });

        admin.sleepBlocks(1);
                `,
                "http://127.0.0.1:8545",
            ],
            { stdio: ["pipe", "pipe", "inherit"] }
        );

        deployProc.stdout.on("data", (data) => {
            const text = data.toString();
            const match = /Contract address:\s+(0x[a-fA-F0-9]+)/.exec(text);
            if (match !== null) {
                res(match[1]);
                deployProc.kill();
            }
        });
    });
}

/** @type {import("node:child_process").ChildProcessWithoutNullStreams} */
const newAccountProc = spawn("geth", [
    "account",
    "new",
    "--datadir",
    DATA_PATH,
]);

const rl = readLine.createInterface(process.stdin, process.stdout);
rl.question("Password: ", (password) => {
    newAccountProc.stdin.write(`${password}\n`);
    newAccountProc.stdin.write(`${password}\n`);

    let stdout = "";
    newAccountProc.stdout.on("data", (data) => {
        /** @type {string} */
        const text = data.toString();
        // console.log(text);
        stdout += text;
    });
    newAccountProc.on("close", async () => {
        const publicKey = (() => {
            const match = /Public address of the key:\s+(0x[a-fA-F0-9]+)/.exec(
                stdout
            );
            if (match === null) {
                console.log(stdout);
                console.error("Public address not found");
                process.exit(1);
            }

            return match[1];
        })();

        console.log("Public key:", publicKey);

        fs.writeFileSync(`${GETH_PATH}/etherbase.txt`, publicKey);
        fs.writeFileSync(`${GETH_PATH}/pass.txt`, password);

        const extraData =
            "0x" + "00".repeat(32) + publicKey.slice(2) + "00".repeat(65);
        const genesisBlock = {
            config: {
                chainId: 12345,
                homesteadBlock: 0,
                eip150Block: 0,
                eip155Block: 0,
                eip158Block: 0,
                byzantiumBlock: 0,
                constantinopleBlock: 0,
                petersburgBlock: 0,
                istanbulBlock: 0,
                berlinBlock: 0,
                clique: {
                    period: 5,
                    epoch: 15,
                },
            },
            difficulty: "1",
            gasLimit: "8000000",
            extradata: extraData,
            alloc: {
                [publicKey]: {
                    balance: "1000000000000000000",
                },
            },
        };

        const genesisPath = `${GETH_PATH}/genesis.json`;
        fs.writeFileSync(genesisPath, JSON.stringify(genesisBlock));

        spawnSync("geth", ["init", "--datadir", DATA_PATH, genesisPath], {
            stdio: "inherit",
        });

        const gethProc = spawn("./geth-start.sh");
        await new Promise((res) => setTimeout(res, 1000));

        console.log("Deploying contract...");
        const { abi, bytecode } = compileContract(
            "contract.sol",
            "NFTContract"
        );

        const address = await deployContract(abi, bytecode);

        console.log("Contract address:", address);
        fs.writeFileSync("./.env", `CONTRACT_ADDRESS="${address}"\n`);

        gethProc.kill();
        process.exit(0);
    });
});
