import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    './public/index.html',
  ],
  theme: {
    extend: {
      colors: {
        'navy': {
          300: '#4a5d82',
          500: '#2c3e50',
          600: '#1a365d',
          700: '#0f2a4a',
          900: '#0a192f',
        },
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [],
} satisfies Config;
