/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		'./src/**/*.{js,ts,jsx,tsx}',
		'./node_modules/@tremor/**/*.{js,ts,jsx,tsx}', // Tremor module
	],
	theme: {
		extend: {
			fontFamily: {
				poppins: ['Poppins', 'sans-serif'],
			},
			backgroundSize: {
				'size-200': '200% 200%',
			},
			backgroundPosition: {
				'pos-0': '0% 0%',
				'pos-100': '100% 100%',
			},
		},
	},
	plugins: [require('tailwind-scrollbar'), require('@tailwindcss/line-clamp')],
}
