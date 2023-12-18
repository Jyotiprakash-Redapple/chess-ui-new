/** @type {import('next').NextConfig} */

module.exports = {
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
		config.module.rules.push({
			test: /\.(ogg|mp3|wav|mpe?g)$/i,
			exclude: config.exclude,
			use: [
				{
					loader: require.resolve("url-loader"),
					options: {
						limit: config.inlineImageLimit,
						fallback: require.resolve("file-loader"),
						publicPath: `${config.assetPrefix}/_next/static/images/`,
						outputPath: `${isServer ? "../" : ""}static/images/`,
						name: "[name]-[hash].[ext]",
						esModule: config.esModule || false,
					},
				},
			],
		});

		return config;
	},
	reactStrictMode: true,
	// optimise image in production
	typescript: {
		ignoreBuildErrors: true,
	},
	eslint: {
		ignoreDuringBuilds: true,
	},

	images: {
		remotePatterns: [
			{
				protocol: "http",
				hostname: "3.137.86.237",
				pathname: "**",
			},
		],
	},
};
