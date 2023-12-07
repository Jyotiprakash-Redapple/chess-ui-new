/** @type {import('next').NextConfig} */
const withOptimizedImages = require("next-optimized-images");

module.exports = withOptimizedImages({
	// webpack for know it is server | client
	webpack: (config, { isServer }) => {
		if (!isServer) {
			config.module.rules.push({
				test: require.resolve("jquery"),
				loader: "expose-loader",
				options: {
					exposes: ["$", "jQuery"],
				},
			});
		}

		return config;
	},
	reactStrictMode: false,
	// optimise image in production
	optimizeImages: true,
	handleImages: ["jpeg", "png", "webp"],
	optimizeImagesInDev: false,
});
