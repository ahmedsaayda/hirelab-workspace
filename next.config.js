/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  images: {
    domains: ['localhost'],
    unoptimized: true, // Disable image optimization to prevent Sharp issues
  },
  transpilePackages: ['rc-util', 'antd', '@ant-design/icons', 'rc-tree', 'rc-table'],
  experimental: {
    largePageDataBytes: 128 * 1000, // 128KB
  },
  webpack: (config, { isServer }) => {
    // Optimize for build performance and file limits
    config.optimization = {
      ...config.optimization,
      moduleIds: 'deterministic',
    };

    // Only apply splitChunks to client-side builds
    if (!isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
        },
      };
    }

    // Reduce concurrent file operations and memory usage
    config.cache = {
      type: 'memory'
    };

    // Reduce parallelism to avoid file handle limits
    config.infrastructureLogging = {
      level: 'error'
    };

    // Limit concurrent operations to avoid file handle limits
    config.parallelism = 2;

    // Ensure server bundles don't try to access Node-only modules like "fs"
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    };

    return config;
  },
}

module.exports = nextConfig 