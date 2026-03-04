import bundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  distDir: 'docs',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  eslint: {
    // ESLint runs as a separate CI step; skip during build to avoid
    // duplicate work and resolve path issues in worktrees.
    ignoreDuringBuilds: true,
  },
};

export default withBundleAnalyzer(nextConfig);
