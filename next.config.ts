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
    // Optimize barrel file imports (bundle-barrel-imports)
    optimizePackageImports: [
      "react-toastify",
      "@hookform/resolvers",
      "react-csv",
      "zod",
    ],
  },
};

export default nextConfig;
