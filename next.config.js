/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  images: {
    domains: ['localhost'],
  },
  // Optimize build process to prevent "too many open files" error
  experimental: {
    workerThreads: false,
    cpus: 1, // Limit CPU usage during build
  },
  // Reduce memory usage during build
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
  transpilePackages: ['rc-util', 'antd', '@ant-design/icons', 'rc-tree', 'rc-table'],
  webpack: (config, { isServer, dev, webpack }) => {
    // Optimize for build to prevent memory leaks
    if (!dev) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          ...config.optimization.splitChunks,
          cacheGroups: {
            default: false,
            vendors: false,
            // Create a chunk for node_modules
            vendor: {
              chunks: 'all',
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              enforce: true,
            },
          },
        },
      };
      
      // Limit parallel processing to prevent file handle exhaustion
      config.parallelism = 1;
    }

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
      'rc-util/es/ref': path.resolve(__dirname, 'warning-fallback.js'),
      'rc-util/lib/ref': path.resolve(__dirname, 'warning-fallback.js'),
      'rc-util/es/Dom/findDOMNode': path.resolve(__dirname, 'warning-fallback.js'),
      'rc-util/lib/Dom/findDOMNode': path.resolve(__dirname, 'warning-fallback.js'),
    };

    return config;
  },
}

module.exports = nextConfig 