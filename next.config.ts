import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  /* config options here */
  output: 'export',
  images: {
    unoptimized: true,
  },
  assetPrefix: isProd ? '/dev-tools/' : '',
  basePath: isProd ? '/dev-tools' : '',
};

export default nextConfig;
