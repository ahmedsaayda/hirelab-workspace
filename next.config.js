/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  images: {
    domains: ['localhost'],
    unoptimized: true, // Disable image optimization to prevent Sharp issues
  },
  transpilePackages: [
    'rc-util',
    'rc-pagination',
    'rc-picker',
    'rc-notification',
    'rc-tooltip',
    'rc-tree',
    'rc-table',
    'rc-input',
    'rc-input-number',
    'rc-cascader',
    'rc-checkbox',
    'rc-collapse',
    'rc-dialog',
    'rc-drawer',
    'rc-dropdown',
    'rc-field-form',
    'rc-image',
    'rc-menu',
    'rc-motion',
    'rc-progress',
    'rc-rate',
    'rc-resize-observer',
    'rc-segmented',
    'rc-select',
    'rc-slider',
    'rc-steps',
    'rc-switch',
    'rc-tabs',
    'rc-textarea',
    'rc-tree-select',
    'rc-upload',
    'rc-virtual-list',
    'antd',
    '@ant-design/icons',
    '@ant-design/icons-svg',
    '@ant-design/cssinjs',
  ],
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