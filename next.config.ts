import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "washworld.dk",
      },
      {
        protocol: "https",
        hostname: "washworld-wordpress-production.storage.googleapis.com",
      },
    ],
  },
};

export default nextConfig;
