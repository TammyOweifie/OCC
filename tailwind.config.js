/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        sand: {
          50: '#FBF9F5',
          100: '#F5F2EB',
          200: '#ECE6D9',
          300: '#DDD4C1',
          800: '#3A352D',
          900: '#23201B',
        },
        earth: {
          600: '#5C5446',
          700: '#464034',
          800: '#322E25',
        },
        forest: {
          700: '#2D4A3E',
          800: '#20362D',
          900: '#16241E',
        },
        accent: '#526829',
        'accent-dark': '#3c4d1d',
        ink: '#111311',
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        display: ['"Cinzel"', 'serif'],
      },
      letterSpacing: {
        footnote: '0.2em',
        eyebrow: '0.25em',
        'eyebrow-wide': '0.3em',
        'hero-eyebrow': '0.35em',
      },
      transitionTimingFunction: {
        reveal: 'cubic-bezier(0.16, 1, 0.3, 1)',
        crossfade: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        marquee: 'marquee 32s linear infinite',
      },
    },
  },
  plugins: [],
}
