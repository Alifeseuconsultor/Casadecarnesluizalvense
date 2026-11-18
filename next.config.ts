import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // As imagens locais da vitrine já são entregues em WebP.
  images: { unoptimized: true }
};

export default nextConfig;