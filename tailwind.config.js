/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html", // If you use Tailwind classes directly in your main HTML file
    "./src/**/*.{js,ts,jsx,tsx}", // This is the most important line for React components
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}