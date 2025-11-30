/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	images: {
		formats: ["image/avif", "image/webp"],
		deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
		imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
		minimumCacheTTL: 60,
		dangerouslyAllowSVG: true,
		contentDispositionType: "attachment",
		contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
	},
	experimental: {
		optimizeCss: true,
	},
	webpack: (config, { isServer }) => {
		// Handle WASM and async/await for lucid-cardano
		config.experiments = {
			...config.experiments,
			asyncWebAssembly: true,
			layers: true,
			topLevelAwait: true,
		};

		// Externalize lucid-cardano on server to avoid bundling issues
		if (isServer) {
			config.externals = config.externals || [];
			config.externals.push("lucid-cardano");
		}

		return config;
	},
};

export default nextConfig;
