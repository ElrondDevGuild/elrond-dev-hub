/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'peerme-mainnet.s3.eu-central-1.amazonaws.com',
      'peerme-testnet.s3.eu-central-1.amazonaws.com', // Adding testnet domain as well for future use
    ],
  },
}

module.exports = nextConfig
