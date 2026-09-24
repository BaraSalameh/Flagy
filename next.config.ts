import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    distDir: process.env.PLAYWRIGHT_TEST
        ? ".next-playwright"
        : (process.env.NEXT_DIST_DIR ?? ".next"),
};

export default nextConfig;
