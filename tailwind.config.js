/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js}'],
  theme: {
    extend: {
      colors: {
        paper: '#F1F5F8',
        surface: '#FFFFFF',
        frost: '#E6EEF3',
        ink: '#0D2233',
        'ink-soft': '#53697A',
        line: '#D3DEE6',
        glacier: '#0A7686',
        'glacier-bright': '#12A0B4',
        safe: '#13795B',
        'safe-soft': '#DDF2EA',
        alert: '#BF3A2D',
        'alert-soft': '#FBE5E2',
      },
      fontFamily: {
        sans: ['"Instrument Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
}
