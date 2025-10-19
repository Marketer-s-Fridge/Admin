/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  eslint: { ignoreDuringBuilds: true },

  async rewrites() {
    return [
      // ✅ auth 요청은 /api 없이 바로 백엔드로
      {
        source: "/auth/:path*",
        destination:
          process.env.NODE_ENV === "production"
            ? "http://mf-api:8080/auth/:path*"
            : "http://localhost:8081/auth/:path*",
      },
      // ✅ 나머지 /api 요청
      {
        source: "/api/:path*",
        destination:
          process.env.NODE_ENV === "production"
            ? "http://mf-api:8080/api/:path*"
            : "http://localhost:8081/api/:path*",
      },
    ];
  },
};

export default nextConfig;
