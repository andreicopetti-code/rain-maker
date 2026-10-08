import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ['@ceo-brain/shared'],
  experimental: {
    // Next 15 zera o cache do cliente (0s). 20s cobre troca rápida de abas
    // sem deixar Funil/Dashboard defasados depois de uma edição.
    staleTimes: {
      dynamic: 20,
      static: 180,
    },
  },
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'rainmaker.ia.br' }],
        destination: 'https://www.rainmaker.ia.br/:path*',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
