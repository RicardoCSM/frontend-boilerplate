/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "versa-social.s3.us-east-2.amazonaws.com",
      },
    ],
  },
};

export default nextConfig;
