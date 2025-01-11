/* eslint-disable @typescript-eslint/no-var-requires */
const plugin = require('tailwindcss/plugin')

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  important: '#root',
  theme: {
    extend: {}
  },
  plugins: [
    plugin(function ({ addComponents }) {
      addComponents({})
    })
  ],
  corePlugins: {
    // Remove the Tailwind CSS preflight styles so it can use Material UI's preflight instead (CssBaseline).
    preflight: true
  }
}
