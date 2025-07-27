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

    // Fix for rc-util ES module import issues
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    };

    // Simple fix for rc-util warning import issue
    config.resolve.alias = {
      ...config.resolve.alias,
      'rc-util/es/warning': path.resolve(__dirname, 'warning-fallback.js'),
      'rc-util/lib/warning': path.resolve(__dirname, 'warning-fallback.js'),
    };

    return config;
  },
}

module.exports = nextConfig 