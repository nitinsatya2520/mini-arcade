module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      animation: {
        'eq-bar': 'eqBar 0.6s infinite ease-in-out',
      },
      keyframes: {
        eqBar: {
          '0%': { height: '30%' },
          '50%': { height: '100%' },
          '100%': { height: '30%' },
        },
      },
    },
  },
  plugins: [],
};
