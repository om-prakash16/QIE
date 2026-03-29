import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    '@solana/wallet-adapter-base',
    '@solana/wallet-adapter-react',
    '@solana/wallet-adapter-react-ui',
    '@solana/web3.js',
    '@noble/curves',
    '@noble/hashes'
  ],
  serverExternalPackages: ['pino-pretty', 'lokijs', 'encoding'],
};

export default nextConfig;
