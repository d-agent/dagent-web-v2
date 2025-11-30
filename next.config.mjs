/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  experimental: {
    optimizeCss: true,
  },
  output: 'export',
  trailingSlash: true,
  distDir: 'out',
};

export default nextConfig;

