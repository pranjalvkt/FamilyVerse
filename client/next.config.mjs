/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // This wildcard allows images from ANY domain
      },
    ],
  },
  /* config options here */
};

export default nextConfig;
