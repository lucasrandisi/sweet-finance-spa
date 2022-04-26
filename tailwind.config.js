module.exports = {
	prefix: '',
	purge: {
		content: [
			'./src/**/*.{html,ts}',
		]
	},
	darkMode: 'class', // or 'media' or 'class'
	theme: {
		extend: {
			colors: {
				primary: '#CCCC00',
				secondary: '#0D0E1c',
				white: '#F7F9F9',
				red: '#9E2B25',
				blue: '#212245'
			},
			fontFamily: {
				'poppins': ['Poppins'],
			 }
		},
	},
	variants: {
		extend: {},
	},
	plugins: []
}