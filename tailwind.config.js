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
				zalando: ["Zalando Sans Expanded", "sans-serif"],
				firacode: ["Fira Code", "monospace"],
				manrope: ["Manrope", "sans-serif"],
				bricolage: ["Bricolage Grotesque", "sans-serif"],
			},
			colors: {
				primary: {
					50: "#E6E8FE",  // Lightest primary
					100: "#C4CAFD", // Very light primary
					200: "#9BA5FB", // Light primary
					300: "#7280FA", // Medium-light primary
					400: "#4A5FF8", // Medium primary
					500: "#2640F4", // Base primary (your original accent)
					600: "#0D25D6", // Medium-dark primary
					700: "#091CB3", // Dark primary
					800: "#061390", // Very dark primary
					900: "#040B6E", // Darkest primary
					base: "#D6EB67",  // Your original base color
				},
				complementary: {
					50: "#FEFEE6",   // Lightest complementary
					100: "#FCFCC4",  // Very light complementary
					200: "#F7F79B",  // Light complementary
					300: "#F2F272",  // Medium-light complementary
					400: "#EDED4A",  // Medium complementary
					500: "#E6E626",  // Base complementary
					600: "#C4C40D",  // Medium-dark complementary
					700: "#A3A309",  // Dark complementary
					800: "#828206",  // Very dark complementary
					900: "#616104",  // Darkest complementary
					accent: "#131314", // Your original complementary accent
				},
				secondary: {
					palette: {
						50: "#F8F9F9",   // White smoke
						100: "#EBEDED",   // Light gray (your original)
						200: "#D1D5D5",   // Lighter gray
						300: "#B7BCBC",   // Light medium gray
						400: "#9DA3A3",   // Medium gray
						500: "#797979",   // Your original medium gray
						600: "#666666",   // Dark medium gray
						700: "#4D4D4D",   // Dark gray
						800: "#333333",   // Very dark gray
						900: "#1A1A1A",   // Nearly black
					},
				},
				neutral: {
					50: "#F5F5F5",    // Lightest neutral
					100: "#E5E5E5",   // Very light neutral
					200: "#D4D4D4",   // Light neutral
					300: "#A3A3A3",   // Medium-light neutral
					400: "#737373",   // Medium neutral
					500: "#525252",   // Base neutral
					600: "#404040",   // Medium-dark neutral
					700: "#2E2E2E",   // Dark neutral
					800: "#1D1D1D",   // Very dark neutral
					900: "#0C0C0C",   // Darkest neutral
				},
				accent: {
					success: {
						light: "#4ADE80",  // Light success
						DEFAULT: "#22C55E", // Default success
						dark: "#16A34A",   // Dark success
					},
					warning: {
						light: "#FCD34D",  // Light warning
						DEFAULT: "#F59E0B", // Default warning
						dark: "#D97706",   // Dark warning
					},
					error: {
						light: "#FB7185",  // Light error
						DEFAULT: "#EF4444", // Default error
						dark: "#DC2626",   // Dark error
					},
					info: {
						light: "#67E8F9",  // Light info
						DEFAULT: "#06B6D4", // Default info
						dark: "#0891B2",   // Dark info
					},
				},
			},
		},
	},
	plugins: [],
};
