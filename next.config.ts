import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  pageExtensions: ["mdx", "md", "jsx", "js", "tsx", "ts"],
  env: {
    MISTRAL_API_KEY: process.env.MISTRAL_API_KEY,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
};

export default nextConfig;
