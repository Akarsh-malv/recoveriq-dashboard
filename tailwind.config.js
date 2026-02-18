/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#EFF6FF',
          DEFAULT: '#2563EB',
          dark: '#1D4ED8',
        },
        success: '#22C55E',
        neutral: {
          darkest: '#1F2937',
          mid: '#6B7280',
          light: '#F9FAFB',
        },
        warning: '#F59E0B',
        danger: '#DC2626',
      },
    },
  },
  plugins: [],
};
