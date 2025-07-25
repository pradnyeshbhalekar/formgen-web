/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    wasm: false,
  },
  output: 'standalone', // required for Render
};

export default nextConfig;
