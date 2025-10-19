// next.config.js
const nextConfig = {
  output: "standalone",
  basePath: "/admin", // ✅ 추가
  eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;