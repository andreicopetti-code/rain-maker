import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ['@ceo-brain/shared'],
  experimental: {
    // Next 15 zera o cache do cliente (0s) por padrão — abas refetcham sempre.
    // dynamic: após visitar; static: prefetch={true}/router.prefetch FULL.
    // revalidatePath nas mutations ainda força dados frescos após edições.
    staleTimes: {
      dynamic: 300,
      static: 600,
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
