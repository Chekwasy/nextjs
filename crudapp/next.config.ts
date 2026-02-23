import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "p5sh1sh3alopzivc.public.blob.vercel-storage.com",
      },
    ],
  },
};

export default nextConfig;
