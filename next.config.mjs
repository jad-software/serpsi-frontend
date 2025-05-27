/** @type {import('next').NextConfig} */
const nextConfig = {
	logging: {
		fetches: {
			fullUrl: true
		}
	},
	images: {
		remotePatterns: [
			{
				protocol: "http",
				hostname: "res.cloudinary.com"
			},
			{
				protocol: "https",
				hostname: "res.cloudinary.com"
			}
		]
	}
};

export default nextConfig;
