/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {
			fontFamily: {
				'poppins': ['Poppins', 'sans-serif'],
			},
		},
	},
	plugins: [require('tailwind-scrollbar'), require('@tailwindcss/line-clamp')],
}
