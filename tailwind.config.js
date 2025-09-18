/** @type {import('tailwindcss').Config} */
module.exports = {
	// NOTE: Update this to include the paths to all files that contain Nativewind classes.
	content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
	presets: [require("nativewind/preset")],
	theme: {
		extend: {
			fontFamily: {
				poppins: ["Poppins", "sans-serif"],
				montserrat: ["Montserrat", "sans-serif"],
			},
			colors: {
				primary: {
					accent: "#2640F4", // Primary accent
					base: "#D6EB67", // Primary base
				},
				complementary: {
					accent: "#131314", // Complementary accent
				},
				secondary: {
					palette: {
						100: "#EBEDED", // Light gray
						500: "#797979", // Medium gray
					},
				},
			},
		},
	},
	plugins: [],
};
