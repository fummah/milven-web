import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1.25rem",
        sm: "1.5rem",
        lg: "2.5rem",
        xl: "3rem"
      },
      screens: {
        "2xl": "1360px"
      }
    },
    extend: {
      colors: {
        navy: {
          50: "#EEF3F8",
          100: "#D7E2EE",
          200: "#B0C4DC",
          300: "#7E9CBF",
          400: "#4E6E93",
          500: "#2E4F76",
          600: "#1C3B5E",
          700: "#12365F",
          800: "#0A2342",
          900: "#06172E",
          950: "#040F1F"
        },
        gold: {
          50: "#FBF6EC",
          100: "#F5E9CF",
          200: "#E9D2A0",
          300: "#DDB96F",
          400: "#D9AE5F",
          500: "#C89A45",
          600: "#A97C31",
          700: "#856024",
          800: "#5E441A",
          900: "#3B2B11"
        },
        cream: {
          DEFAULT: "#F7F5EF",
          dark: "#EFEbE0"
        },
        slate: {
          text: "#4D5B6A"
        },
        ink: "#101010",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))"
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Cormorant Garamond", "Georgia", "serif"],
        sans: ["var(--font-sans)", "Inter", "system-ui", "sans-serif"]
      },
      fontSize: {
        "display-sm": ["3rem", { lineHeight: "1.05", letterSpacing: "-0.01em" }],
        "display": ["3.75rem", { lineHeight: "1.02", letterSpacing: "-0.015em" }],
        "display-lg": ["4.75rem", { lineHeight: "1", letterSpacing: "-0.02em" }]
      },
      letterSpacing: {
        label: "0.22em"
      },
      boxShadow: {
        premium: "0 24px 70px -20px rgba(6, 23, 46, 0.28)",
        card: "0 2px 4px rgba(6,23,46,0.04), 0 12px 32px -12px rgba(6,23,46,0.14)",
        "card-hover": "0 4px 8px rgba(6,23,46,0.06), 0 28px 60px -18px rgba(6,23,46,0.28)",
        gold: "0 18px 40px -18px rgba(200, 154, 69, 0.6)"
      },
      borderRadius: {
        xl: "0.875rem",
        "2xl": "1.25rem",
        "3xl": "1.75rem"
      },
      transitionTimingFunction: {
        premium: "cubic-bezier(0.22, 1, 0.36, 1)"
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" }
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" }
        },
        "fade-up": {
          from: { opacity: "0", transform: "translateY(16px)" },
          to: { opacity: "1", transform: "translateY(0)" }
        },
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" }
        },
        kenburns: {
          "0%": { transform: "scale(1.04)" },
          "100%": { transform: "scale(1.16)" }
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" }
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.25s ease-out",
        "accordion-up": "accordion-up 0.25s ease-out",
        "fade-up": "fade-up 0.6s var(--tw-ease, cubic-bezier(0.22,1,0.36,1)) both",
        marquee: "marquee 32s linear infinite",
        kenburns: "kenburns 8s ease-out forwards",
        shimmer: "shimmer 2.5s linear infinite"
      }
    }
  },
  plugins: [require("tailwindcss-animate")]
}

export default config
