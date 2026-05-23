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
        // Light mode colors
        light: {
          background: '#FFFFFF',
          surface: '#F5F5F5',
          surfaceHover: '#EEEEEE',
          text: {
            primary: '#1A1A1A',
            secondary: '#666666',
            muted: '#999999',
          },
          border: '#E5E5E5',
        },
        // Dark mode colors
        dark: {
          background: '#0F1115',
          surface: '#171A21',
          surfaceHover: '#1E222A',
          text: {
            primary: '#EAEAEA',
            secondary: '#A8B0B9',
            muted: '#6B7280',
          },
          border: '#2A2D35',
        },
        accent: {
          gold: '#D4A017',
          goldLight: '#E8B43C',
          goldDark: '#B8860B',
        },
      },
      fontFamily: {
        heading: ['Sora', 'Outfit', 'Space Grotesk', 'system-ui', 'sans-serif'],
        body: ['Inter', 'Manrope', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
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
      },
    },
  },
  plugins: [],
}

export default config