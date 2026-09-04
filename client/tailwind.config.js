/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        college: {
          navy: {
            DEFAULT: '#0a2540',
            50: '#f0f5fa',
            100: '#d9e5f2',
            200: '#b3cbe5',
            300: '#80a8d3',
            400: '#4d85c1',
            500: '#2365af',
            600: '#144c8c',
            700: '#0f3a6d',
            800: '#0a2540',
            900: '#07182c',
          },
          gold: {
            DEFAULT: '#c89116',
            50: '#fdf9ee',
            100: '#faeed1',
            200: '#f4daa2',
            300: '#ecc06c',
            400: '#e4a539',
            500: '#c89116',
            600: '#ad720f',
            700: '#8a5310',
            800: '#714213',
            900: '#5f3714',
          },
          blue: {
            DEFAULT: '#1e40af',
            50: '#eff6ff',
            100: '#dbeafe',
            200: '#bfdbfe',
            300: '#93c5fd',
            400: '#60a5fa',
            500: '#3b82f6',
            600: '#2563eb',
            700: '#1d4ed8',
            800: '#1e40af',
            900: '#1e3a8a',
          }
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        serif: ['Merriweather', 'Georgia', 'serif'],
        display: ['Outfit', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03)',
        'card': '0 2px 8px -2px rgba(15, 23, 42, 0.06), 0 1px 4px -1px rgba(15, 23, 42, 0.04)',
        'card-hover': '0 10px 25px -5px rgba(15, 23, 42, 0.08), 0 8px 10px -6px rgba(15, 23, 42, 0.04)',
        'elevated': '0 20px 30px -10px rgba(15, 23, 42, 0.1), 0 10px 10px -5px rgba(15, 23, 42, 0.04)',
      }
    },
  },
  plugins: [],
}
