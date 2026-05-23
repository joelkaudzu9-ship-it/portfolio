import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Professional dark theme
        background: {
          DEFAULT: '#0F1115',
          card: '#171A21',
          elevated: '#1E222A',
        },
        surface: {
          DEFAULT: '#1A1D24',
          hover: '#232730',
        },
        accent: {
          gold: '#D4A017',
          goldLight: '#E8B43C',
          goldDark: '#B8860B',
        },
        text: {
          primary: '#EAEAEA',
          secondary: '#A8B0B9',
          muted: '#6B7280',
        },
        border: {
          DEFAULT: '#2A2D35',
          light: '#3A3E47',
        },
      },
      fontFamily: {
        heading: ['Sora', 'Outfit', 'Space Grotesk', 'system-ui', 'sans-serif'],
        body: ['Inter', 'Manrope', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'glow': 'glow 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        glow: {
          '0%, 100%': { opacity: '0.5' },
          '50%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}

export default config