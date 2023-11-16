import Web3, { ContractExecutionError } from "web3";

import { SVG } from "@svgdotjs/svg.js";

import type { INft } from "./contract/icontract";
import notifications from "./notifications";

export function truncateAddress(address: string) {
    const hex = address.slice(2);
    return `0x${hex.slice(0, 5)}...${hex.slice(-5)}`;
}

interface IMetaMaskError<TData = unknown> extends Error {
    data: TData;
}

function isContractExecutionError(
    err: Error
): err is IMetaMaskError<ContractExecutionError> {
    const metaMaskError = err as Partial<
        IMetaMaskError<ContractExecutionError>
    >;
    return metaMaskError?.data?.code === -32000;
}

export async function guardWeb3<T>(
    func: () => Promise<T>,
    title?: string,
    fmt?: (err: ContractExecutionError) => string
) {
    try {
        return await func();
    } catch (err) {
        if (err instanceof Error) {
            if (isContractExecutionError(err)) {
                notifications.add(
                    "error",
                    title ?? "Contract execution failed",
                    fmt !== undefined ? fmt(err.data) : err.data.message
                );
            } else {
                notifications.add("error", "Unhandled error", err.message);
            }
        }

        throw err;
    }
}

export function fromWei(value: bigint) {
    const UNITS = Object.entries(Web3.utils.ethUnitMap).sort((a, b) =>
        Number(b[1] - a[1])
    );

    for (const [unit, unitValue] of UNITS) {
        if (value < unitValue || !unitValue) continue;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return `${Web3.utils.fromWei(value, unit as any)} ${unit}`;
    }

    return `${Web3.utils.fromWei(value, "ether")} ether`;
}

export function truncateStringFloat(value: string, precision: number = 2) {
    const [int, frac] = value.split(".");
    return `${int}.${frac.slice(0, precision)}`;
}

function remap(
    value: number,
    min1: number,
    max1: number,
    min2: number,
    max2: number
) {
    const normalized = (value - min1) / (max1 - min1);
    return normalized * (max2 - min2) + min2;
}

export async function generateNftBackground(nft: INft, parent: HTMLElement) {
    const encoder = new TextEncoder();
    const entropy = encoder.encode(
        `${nft.id}${nft.name}${nft.isCollectible}${nft.collectionId}`
    );

    const digestBytes = await crypto.subtle.digest("SHA-512", entropy);
    let digest = Array.from(new Uint32Array(digestBytes))
        .map((value) => BigInt(value))
        .reduce((acc, value) => (acc << 32n) | value);

    const PALETTE_BITS = 4n;
    const PALETTE_SIZE = 2 ** Number(PALETTE_BITS);
    const palette: string[] = [];
    for (let idx = 0; idx < PALETTE_SIZE; idx++) {
        const uLightness = Number(digest & 0x7n);
        const lightness = remap(uLightness, 0, 0x7, 0, 100);
        digest >>= 3n;

        const uChroma = Number(digest & 0x7n);
        const chroma = remap(uChroma, 0, 0x7, 0, 0.5);
        digest >>= 3n;

        const uHue = Number(digest & 0xfn);
        const hue = remap(uHue, 0, 0xf, 0, 360);
        digest >>= 4n;

        palette.push(`oklch(${lightness}% ${chroma} ${hue})`);
    }

    function unpackInt(bits: bigint) {
        const MASK = 2n ** bits - 1n;
        const value = Number(digest & MASK);
        digest >>= bits;
        return value;
    }

    function unpackColor() {
        const idx = unpackInt(PALETTE_BITS);
        return palette[idx];
    }

    const svg = SVG()
        .addClass("rounded")
        .width("100%")
        .height("100%")
        .fill("red")
        .attr("viewBox", "0 0 100 100");

    const backgroundFill = unpackColor();
    svg.rect().width("100%").height("100%").fill(backgroundFill);

    while (digest > 0) {
        const type = unpackInt(2n) % 3;

        if (type === 0) {
            const color = unpackColor();

            const filled = unpackInt(1n) === 1;

            const uX = unpackInt(3n);
            const uY = unpackInt(3n);

            const x = remap(uX, 0, 0x7, 0, 100 - 0x7);
            const y = remap(uY, 0, 0x7, 0, 100 - 0x7);

            const rect = svg.rect().x(x).y(y).width(15).height(15);
            if (filled) {
                rect.fill(color);
            } else {
                rect.stroke(color);
                rect.fill("transparent");
            }
        } else if (type === 1) {
            const color = unpackColor();

            const filled = unpackInt(1n) === 1;

            const uX = unpackInt(3n);
            const uY = unpackInt(3n);

            const uRadius = unpackInt(3n);

            const radius = remap(uRadius, 0, 0x7, 5, 15);

            const x = remap(uX, 0, 0x7, 0, 100 - 0x7);
            const y = remap(uY, 0, 0x7, 0, 100 - 0x7);

            const circle = svg
                .circle()
                .attr("cx", x)
                .attr("cy", y)
                .attr("r", radius);
            if (filled) {
                circle.fill(color);
            } else {
                circle.stroke(color);
                circle.fill("transparent");
            }
        } else if (type === 2) {
            const color = unpackColor();

            const numPoints = remap(unpackInt(3n), 0, 0x7, 1, 5);

            let uX = unpackInt(3n);
            let uY = unpackInt(3n);

            const x = `${remap(uX, 0, 0x7, 0, 100 - 15)}`;
            const y = `${remap(uY, 0, 0x7, 0, 100 - 15)}`;

            const path = [`M${x},${y}`];
            for (let idx = 0; idx < numPoints; idx++) {
                const uX1 = unpackInt(3n);
                const uY1 = unpackInt(3n);

                const uX2 = unpackInt(3n);
                const uY2 = unpackInt(3n);

                const uXc = unpackInt(2n);
                const uYc = unpackInt(2n);

                const x1 = remap(uX1, 0, 0x7, -25, 25);
                const y1 = remap(uY1, 0, 0x7, -25, 25);

                const x2 = remap(uX2, 0, 0x7, -25, 25);
                const y2 = remap(uY2, 0, 0x7, -25, 25);

                const xc = remap(uXc, 0, 0x7, -25, 25);
                const yc = remap(uYc, 0, 0x7, -25, 25);

                path.push(
                    "c" +
                        [x1, y1, xc, yc, x2, y2]
                            .map((value) => `${value}`)
                            .join(",")
                );

                uX = x2;
                uY = y2;
            }

            svg.path(path.join(" "))
                .fill("transparent")
                .stroke({ width: 1, color });
        }
    }

    svg.addTo(parent);
}
