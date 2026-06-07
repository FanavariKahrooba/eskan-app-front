import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: ['192.168.1.50'],

  experimental: {
    globalNotFound: true,
  },
};

export default nextConfig;
