import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ['@ceo-brain/shared'],
  experimental: {
    // Next 15 zera o cache do cliente (0s). 60s cobre troca rápida de abas
    // sem deixar Funil/Dashboard defasados depois de uma edição (revalidatePath limpa).
    staleTimes: {
      dynamic: 60,
      static: 300,
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
