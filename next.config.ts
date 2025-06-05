import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    viewTransition: true,
    // @ts-expect-error allowedDevOriginsは型定義に未対応だがNext.js本体では有効
    allowedDevOrigins: [
      "http://localhost:3000",
      "http://127.0.0.1:3000",
      "http://172.25.208.1:3000",
    ],
  },
};

export default nextConfig;