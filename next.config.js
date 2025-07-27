/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  images: {
    domains: ['localhost'],
  },
  transpilePackages: ['rc-util', 'antd', '@ant-design/icons', 'rc-tree', 'rc-table'],
  webpack: (config, { isServer }) => {
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