/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: "var(--card)",
        "card-foreground": "var(--card-foreground)",
        primary: "var(--primary)",
        "primary-foreground": "var(--primary-foreground)",
        secondary: "var(--secondary)",
        "secondary-foreground": "var(--secondary-foreground)",
        muted: "var(--muted)",
        "muted-foreground": "var(--muted-foreground)",
        accent: "var(--accent)",
        "accent-foreground": "var(--accent-foreground)",
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        // alias used throughout admin components
        sage: "var(--primary)",
      },
      fontFamily: {
        display: ["Cormorant Garamond", "Playfair Display", "Georgia", "serif"],
        serif: ["Cormorant Garamond", "Georgia", "serif"],
        script: ["Great Vibes", "Allura", "cursive"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 10px 40px -20px rgba(60, 80, 50, 0.35)",
        card: "0 4px 24px -8px rgba(60, 80, 50, 0.18)",
      },
      keyframes: {
        "float-in": {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        sway: {
          "0%, 100%": { transform: "rotate(-2deg)" },
          "50%": { transform: "rotate(2deg)" },
        },
        "ken-burns": {
          "0%":   { transform: "scale(1.0) translate(0%, 0%)" },
          "33%":  { transform: "scale(1.06) translate(-1.5%, -1%)" },
          "66%":  { transform: "scale(1.04) translate(1%, -2%)" },
          "100%": { transform: "scale(1.0) translate(0%, 0%)" },
        },
        "fly-bird": {
          "0%":   { transform: "translate(-120px, 0px) scaleX(1)" },
          "25%":  { transform: "translate(15vw, -40px) scaleX(1)" },
          "50%":  { transform: "translate(35vw, -20px) scaleX(1)" },
          "75%":  { transform: "translate(55vw, -60px) scaleX(1)" },
          "99%":  { transform: "translate(110vw, -30px) scaleX(1)" },
          "100%": { transform: "translate(-120px, 0px) scaleX(1)" },
        },
        "float-butterfly": {
          "0%":   { transform: "translate(0px, 0px) rotate(0deg)" },
          "25%":  { transform: "translate(15px, -25px) rotate(5deg)" },
          "50%":  { transform: "translate(30px, -10px) rotate(-3deg)" },
          "75%":  { transform: "translate(15px, -30px) rotate(4deg)" },
          "100%": { transform: "translate(0px, 0px) rotate(0deg)" },
        },
        "spin-slow": {
          "0%":   { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "leaf-fall": {
          "0%":   { transform: "translateY(-30px) rotate(0deg)", opacity: "0.8" },
          "80%":  { opacity: "0.6" },
          "100%": { transform: "translateY(100vh) rotate(720deg)", opacity: "0" },
        },
        "reveal-up": {
          "0%":   { opacity: "0", transform: "translateY(36px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "float-in": "float-in 1s ease-out both",
        sway: "sway 6s ease-in-out infinite",
        "ken-burns":       "ken-burns 30s ease-in-out infinite",
        "fly-bird":        "fly-bird 20s linear infinite",
        "fly-bird-delay":  "fly-bird 26s linear infinite 10s",
        "float-butterfly": "float-butterfly 6s ease-in-out infinite",
        "float-butterfly-2": "float-butterfly 8s ease-in-out infinite 3s",
        "spin-slow":       "spin-slow 3s linear infinite",
        "leaf-fall":       "leaf-fall 12s linear infinite",
        "leaf-fall-2":     "leaf-fall 18s linear infinite 6s",
        "reveal-up":       "reveal-up 0.7s ease-out both",
      },
    },
  },
  plugins: [],
};
