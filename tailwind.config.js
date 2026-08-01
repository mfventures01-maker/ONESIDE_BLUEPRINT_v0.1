module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'deep-slate': '#0F172A',
        'burnt-ochre': '#C46210',
        'whatsapp-green': '#25D366',
      },
      backdropBlur: {
        '3xl': '12px',
      },
      fontFamily: {
        montserrat: ['Montserrat', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
