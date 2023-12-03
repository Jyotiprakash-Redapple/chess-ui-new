/** @type {import('next').NextConfig} */
const withOptimizedImages = require("next-optimized-images");

module.exports = {
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
};
