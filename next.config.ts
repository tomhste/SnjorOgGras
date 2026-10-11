import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fully static export so the site can be deployed to classic Firebase Hosting.
  output: "export",
  images: {
    unoptimized: true,
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
