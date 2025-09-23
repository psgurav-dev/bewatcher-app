// babel.config.js
module.exports = function (api) {
	api.cache(true);
	return {
		presets: [
			// You can keep jsxImportSource if you want, or drop it and set it in tsconfig.json
			['babel-preset-expo', { jsxImportSource: 'nativewind' }],
		],
		plugins: [
			'nativewind/babel',
			// MUST be last for worklets (fixes blank screen / no animation in release)
			'react-native-reanimated/plugin',
		],
	};
};
