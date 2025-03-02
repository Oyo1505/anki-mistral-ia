import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  pageExtensions: ['mdx', 'md', 'jsx', 'js', 'tsx', 'ts'],
  experimental: {
    serverActions: {
      bodySizeLimit: '4000mb',
    },
  },
};

export default nextConfig;
