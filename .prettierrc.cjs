/** @type {import("prettier").Options} */
const config = {
    singleQuote: false,
    trailingComma: "es5",
    tabWidth: 4,

    plugins: [
        "prettier-plugin-svelte",
        "prettier-plugin-tailwindcss",
        "@trivago/prettier-plugin-sort-imports",
    ],
    overrides: [
        {
            files: "*.svelte",
            options: {
                parser: "svelte",
            },
        },
    ],

    importOrder: ["<THIRD_PARTY_MODULES>", "^@(.*)$", "^[./]"],
    importOrderParserPlugins: ["typescript", "jsx"],
    importOrderSeparation: true,
    importOrderSortSpecifiers: true,
};

module.exports= config;
