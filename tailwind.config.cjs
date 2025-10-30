module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    container: {
      center: true,
      padding: '1rem',
    },
    extend: {
      colors: {
        brand: {
          DEFAULT: '#065f46',
          50: '#f0fdf4',
          100: '#dcfce7'
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui']
      },
      boxShadow: {
        card: '0 6px 20px rgba(8, 15, 30, 0.08)'
      }
    },
  },
  plugins: [],
}
