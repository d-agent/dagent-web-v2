import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "#050505",
                surface: "#0A0A0A",
                surfaceHighlight: "#121212",
                primary: "#00FF94",
                primaryDim: "#00CC76",
                secondary: "#9D00FF",
                accent: "#FFD700",
            },
            fontFamily: {
                sans: ['var(--font-inter)', 'sans-serif'],
                mono: ['var(--font-roboto-mono)', 'monospace'],
                pixel: ['var(--font-pixel)', 'monospace'],
            },
            animation: {
                'spin-slow': 'spin 10s linear infinite',
                'pulse-slow': 'pulse-smooth 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'beam': 'beam 2s linear infinite',
            },
            keyframes: {
                beam: {
                    '0%': { transform: 'translateX(-100%) translateZ(0)' },
                    '100%': { transform: 'translateX(100%) translateZ(0)' }
                },
                'pulse-smooth': {
                    '0%, 100%': { 
                        opacity: '0.4',
                        transform: 'scale(1) translateZ(0)'
                    },
                    '50%': { 
                        opacity: '0.8',
                        transform: 'scale(1.05) translateZ(0)'
                    }
                }
            }
        },
    },
    plugins: [],
};
export default config;
