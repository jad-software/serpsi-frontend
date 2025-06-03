/** @type {import('next').NextConfig} */
const nextConfig = {
	experimental: {
    missingSuspenseWithCSRBailout: false,
  },
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
