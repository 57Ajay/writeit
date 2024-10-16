import  MonacoWebpackPlugin from 'monaco-editor-webpack-plugin';

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.plugins.push(new MonacoWebpackPlugin({
        languages: ['markdown']
      }))
    }
    return config
  },
  images: {
    domains: ["*"],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      }
    ]
  }
}

export default nextConfig;