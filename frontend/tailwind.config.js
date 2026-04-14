/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3b82f6', // blue-500 matching the reference buttons
          dark: '#2563eb',    // blue-600
        },
        header: '#1e293b',   // slate-800 matching the header blocks
      }
    },
  },
  plugins: [],
}
