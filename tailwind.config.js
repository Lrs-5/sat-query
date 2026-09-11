/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Core palette — deep navy/black base with a restrained lime + cyan accent pair.
        base: {
          950: '#05080B',
          900: '#080D12',
          800: '#0B121A',
          700: '#111A23',
          600: '#1B2731',
        },
        line: {
          DEFAULT: 'rgba(154, 178, 191, 0.14)',
          strong: 'rgba(154, 178, 191, 0.26)',
        },
        ink: {
          primary: '#E7EEF2',
          muted: '#8AA0AC',
          faint: '#54666F',
        },
        lime: {
          DEFAULT: '#9BE564',
          dim: 'rgba(155, 229, 100, 0.14)',
        },
        cyan: {
          DEFAULT: '#5AD1E6',
          dim: 'rgba(90, 209, 230, 0.14)',
        },
        amber: {
          DEFAULT: '#E6B45A',
        },
        danger: {
          DEFAULT: '#E6685A',
          dim: 'rgba(230, 104, 90, 0.14)',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        glow: '0 0 40px -10px rgba(155, 229, 100, 0.25)',
        panel: '0 1px 0 0 rgba(255,255,255,0.03) inset',
      },
      backgroundImage: {
        grid: 'linear-gradient(rgba(154,178,191,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(154,178,191,0.05) 1px, transparent 1px)',
      },
      backgroundSize: {
        grid: '28px 28px',
      },
    },
  },
  plugins: [],
}
