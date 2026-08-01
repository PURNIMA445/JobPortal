/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  cacheComponents:true,
  reactCompiler: true,
  async rewrites() {
    return [
      {
        source: '/api/ai-service/:path*',
        destination: `${process.env.NEXT_PUBLIC_AI_URL || 'http://localhost:8000'}/:path*`,
      },
    ];
  },
};


export default nextConfig;
