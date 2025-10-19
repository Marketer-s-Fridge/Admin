// next.config.js
const nextConfig = {
  output: "standalone",
  basePath: "/admin",      // ✅ 라우터 기준 경로
  assetPrefix: "/admin", // ✅ 정적 리소스 prefix 맞춰줌
  eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;