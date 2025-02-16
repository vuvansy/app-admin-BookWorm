import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      screens: {
        "2xl": "1230px",
      },
    },
    fontSize: {
      heading1: [
        "40px",
        {
          lineHeight: "30px",
          fontWeight: "400",
        },
      ],
      "heading1-bold": [
        "40px",
        {
          lineHeight: "30px",
          fontWeight: "600",
        },
      ],
      heading2: [
        "32px",
        {
          lineHeight: "30px",
          fontWeight: "400",
        },
      ],
      "heading2-bold": [
        "32px",
        {
          lineHeight: "30px",
          fontWeight: "600",
        },
      ],

      heading3: [
        "24px",
        {
          lineHeight: "24px",
          fontWeight: "400",
        },
      ],
      "heading3-bold": [
        "24px",
        {
          lineHeight: "24px",
          fontWeight: "600",
        },
      ],

      heading4: [
        "22px",
        {
          lineHeight: "18px",
        },
      ],
      "heading4-bold": [
        "22px",
        {
          lineHeight: "18px",
          fontWeight: "600",
        },
      ],
      "sub-heading": [
        "18px",
        {
          lineHeight: "24px",
        },
      ],
      "sub-heading-bold": [
        "18px",
        {
          lineHeight: "30px",
          fontWeight: "600"
        },
      ],
      body1: [
        "16px",
        {
          lineHeight: "24px",
        },
      ],
      "body-bold": [
        "16px",
        {
          fontWeight: "600",
          lineHeight: "24px",
        },
      ],
      "caption-light": [
        "14px",
        {
          fontWeight: "300",
          lineHeight: "20px",
        },
      ],
      caption: [
        "14px",
        {
          lineHeight: "20px",
        },
      ],
      "caption-bold": [
        "14px",
        {
          fontWeight: "600",
          lineHeight: "20px",
        },
      ],
      info: [
        "13px",
        {
          lineHeight: "20px",
        },
      ],
      "info-light": [
        "13px",
        {
          lineHeight: "20px",
        },
      ],
      "info-bold": [
        "13px",
        {
          lineHeight: "20px",
          fontWeight: "600"
        },
      ],
    },
    extend: {
      fontFamily: {
        sans: ['Roboto', 'Arial', 'sans-serif'],
      },
      backgroundImage: {
        'bg-sale': "url('/flash_sale_background_image.webp')",
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      boxShadow: {
        'custom': '0px 0px 4px 2px rgba(0, 0, 0, 0.1);',
      },
      colors: {
        "bg-text": "#212121",
        "bg-main": "#F0F0F0",
        "white": "#FFFFFF",
        "red1": "#C92127",
        "red-text": "#F63B2F",
        "red-fade": "#FEEBE9",
        "yellow-1": "#F6A500",
        "yellow-2": "#F39801",
        "yellow-3": "#F7941E",
        "black": "#212121",
        "gray-1": "#7A7E7F",
        "gray-2": "#777",
        "blue-text": "#2489f4",
        "blue-text-bold": "#196AD1",
        "price-old": "#888888",
        "price-special": "#C92127",
        "silver-fade": "#F2F4F5",

        customGray: 'rgb(34, 34, 34)',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))'
        }
      },
    },
  },
  plugins: [],
};
export default config;
