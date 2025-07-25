/** @type {import('next').NextConfig} */
const nextConfig = {
  // swcMinify: true,  <-- REMOVE this if you're using Next 15
  experimental: {
    serverActions: true,
  },
};

export default nextConfig;
