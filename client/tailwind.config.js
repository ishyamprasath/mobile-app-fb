export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        tvsBlue: '#003DA5',
        tvsRed: '#E31E24',
        tvsInk: '#071B3A',
      },
      boxShadow: {
        glow: '0 20px 60px rgba(0, 61, 165, 0.18)',
      },
      backgroundImage: {
        hero: 'radial-gradient(circle at top left, rgba(227,30,36,0.22), transparent 30%), radial-gradient(circle at top right, rgba(0,61,165,0.22), transparent 30%), linear-gradient(180deg, #06142d 0%, #0a234d 45%, #f5f8ff 100%)',
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
};
