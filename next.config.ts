// next.config.js
const nextConfig = {
  output: "standalone",
  assetPrefix: "/admin", // ✅ 정적 리소스 prefix 맞춰줌
  eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;