// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
		return [
			{
				destination: `http://localhost:5050/:path*`,
				source: '/api/:path*',
			},
		];
	},
}

module.exports = nextConfig