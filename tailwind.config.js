/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
	theme: {
    extend: {
      colors: { 
         'main-green': '#108A00'
      }
     
    }
	},
	plugins: []
}
