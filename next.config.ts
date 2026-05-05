import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "10.10.12.111",
        port: "8086",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "apheenexx.pythonanywhere.com",
        pathname: "/media/**",
      },
    ],
  },
};

export default nextConfig;
