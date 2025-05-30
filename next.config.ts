import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  pageExtensions: ['mdx', 'md', 'jsx', 'js', 'tsx', 'ts'],
  serverExternalPackages: ['tesseract.js', 'pdf-to-png-converter'],
  experimental: {
    serverActions: {
      bodySizeLimit: '4000mb',
    },
  },
};

export default nextConfig;
