import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  experimental: {
    optimizePackageImports: ["lucide-react", "recharts"],
  },
  images: {
    domains: ["via.placeholder.com"],
  },
};

export default nextConfig;
