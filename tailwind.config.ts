import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        green: {
          mtr: '#00e676',
          'mtr-dim': 'rgba(0,230,118,0.1)',
          'mtr-border': 'rgba(0,230,118,0.3)',
        },
        surface: {
          DEFAULT: '#0d1a16',
          dark: '#080f0c',
          green: '#0d2218',
          'green-dark': '#081510',
        },
        border: {
          subtle: 'rgba(255,255,255,0.08)',
          green: 'rgba(0,230,118,0.2)',
        },
      },
      fontFamily: {
        gantari: ['Gantari', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'card': 'linear-gradient(145deg, #0d1a16 0%, #080f0c 100%)',
        'card-green': 'linear-gradient(145deg, #0d2218 0%, #081510 100%)',
        'ticker': 'linear-gradient(145deg, #1a2e28, #0e1f1a)',
      },
    },
  },
  plugins: [],
}

export default config
