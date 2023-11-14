import type { Config } from "tailwindcss";

const colors = {
    background: {
        primary: "#DEDEDE",
        secondary: "#EEEEEE",
    },
    primary: {
        50: "#E9FBFC",
        100: "#D2F7F9",
        200: "#AAF0F3",
        300: "#7EE9EC",
        400: "#51E1E6",
        500: "#28D9E0",
        600: "#1AB2B7",
        700: "#14868A",
        800: "#0D5B5E",
        900: "#062B2D",
        950: "#031616",
    },
    success: {
        50: "#E9FBEE",
        100: "#D8F9E0",
        200: "#ACF1BE",
        300: "#84EBA0",
        400: "#5DE581",
        500: "#34DE60",
        600: "#1FBD49",
        700: "#178C36",
        800: "#0F5C24",
        900: "#083013",
        950: "#041608",
    },
    error: {
        50: "#FDECEE",
        100: "#FCD9DD",
        200: "#F8AFB8",
        300: "#F58A96",
        400: "#F26475",
        500: "#EE3C51",
        600: "#DD132B",
        700: "#A40E20",
        800: "#6C0915",
        900: "#38050B",
        950: "#1C0205",
    },
};
const config = {
    content: ["./src/**/*.{html,js,svelte,ts}"],
    theme: {
        extend: {
            colors: {
                ...colors,
                notification: {
                    info: colors.primary[400],
                    "info-accent": colors.primary[600],

                    success: colors.success[400],
                    "success-accent": colors.success[600],

                    error: colors.error[400],
                    "error-accent": colors.error[600],
                },
            },
        },
    },
    safelist: [
        { pattern: /^bg-notification-/ },
        { pattern: /^border-notification-/ },
    ],
    plugins: [],
} satisfies Config;

export default config;
