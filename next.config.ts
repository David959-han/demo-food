import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/demo-food',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;