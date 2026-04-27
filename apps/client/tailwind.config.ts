import type { Config } from "tailwindcss";

/**
 * Tailwind config aligned with the Pizza House premium design system.
 * MUI handles most component styling; Tailwind handles utilities + layout.
 */
export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // Brand palette
        brand: {
          gold: "#FAE900",
          "gold-dark": "#E8D800",
          "gold-deep": "#C9BB00",
          charcoal: "#1A1A18",
          "charcoal-mid": "#2D2D2B",
          ink: "#111110",
          cream: "#FAFAF7",
          muted: "#8A8A85",
          red: "#E8321A",
          green: "#1A7A3C",
        },
      },
      fontFamily: {
        sans: [
          "Manrope",
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "Roboto",
          "sans-serif",
        ],
      },
      fontSize: {
        "2xs": ["0.68rem", { lineHeight: "1rem" }],
        xs: ["0.75rem", { lineHeight: "1rem" }],
        sm: ["0.875rem", { lineHeight: "1.25rem" }],
        base: ["1rem", { lineHeight: "1.6rem" }],
      },
      borderRadius: {
        sm: "8px",
        md: "12px",
        lg: "16px",
        xl: "20px",
        "2xl": "24px",
        pill: "100px",
      },
      boxShadow: {
        card: "0 2px 8px rgba(26,26,24,0.06), 0 0 0 1px rgba(26,26,24,0.06)",
        "card-hover": "0 12px 40px rgba(26,26,24,0.12), 0 0 0 1px rgba(26,26,24,0.08)",
        gold: "0 4px 20px rgba(250,233,0,0.45)",
        drawer: "-8px 0 40px rgba(26,26,24,0.15)",
      },
      transitionTimingFunction: {
        "brand-ease": "cubic-bezier(0.4, 0, 0.2, 1)",
        spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease both",
        "pop-in": "popIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) both",
        "slide-in": "slideInRight 0.22s ease both",
        "cart-bounce": "cartBounce 0.45s ease both",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        popIn: {
          "0%": { transform: "scale(0.8)", opacity: "0" },
          "70%": { transform: "scale(1.08)" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        slideInRight: {
          "0%": { opacity: "0", transform: "translateX(20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        cartBounce: {
          "0%, 100%": { transform: "scale(1)" },
          "30%": { transform: "scale(1.25) rotate(-8deg)" },
          "60%": { transform: "scale(0.92) rotate(4deg)" },
        },
      },
      spacing: {
        "safe-bottom": "env(safe-area-inset-bottom)",
      },
    },
  },
  plugins: [],
} satisfies Config;
