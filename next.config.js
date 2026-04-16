/** @type {import('next').NextConfig} */
const nextConfig = {
  // Turbopack configuration
  turbopack: {
    // Empty turbopack config to silence the error
  },
  // Force webpack bundler
  webpack: (config, { dev, isServer }) => {
    // Force webpack usage
    config.resolve.alias = {
      ...config.resolve.alias,
    };
    return config;
  },
}

module.exports = nextConfig
