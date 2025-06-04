/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        kufi: ["var(--font-noto-kufi-arabic)", "sans-serif"],
        arabic: ["Amiri", "serif"],
      },
      colors: {
        islamic: {
          green: "#2D5016",
          gold: "#D4AF37",
          teal: "#008B8B",
          navy: "#1B365D",
          emerald: "#10B981",
        },
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out",
        "slide-up": "slideUp 0.8s ease-out",
        "slide-in-left": "slideInLeft 0.7s ease-out",
        float: "float 3s ease-in-out infinite",
        glow: "glow 2s ease-in-out infinite alternate",
        "pulse-slow": "pulse 3s ease-in-out infinite",
      },
      backgroundImage: {
        "islamic-pattern": `
          radial-gradient(circle at 25% 25%, rgba(212, 175, 55, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 75% 75%, rgba(45, 80, 22, 0.1) 0%, transparent 50%)
        `,
      },
    },
  },
  plugins: [],
};
