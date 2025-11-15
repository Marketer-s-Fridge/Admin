// next.config.js
const nextConfig = {
  output: "standalone",
  assetPrefix: "/admin", // ✅ 정적 리소스 prefix 맞춰줌
  eslint: { ignoreDuringBuilds: true },

  // ✅ 여기에 이미지 도메인 추가
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "mfridge-images.s3.ap-northeast-2.amazonaws.com",
      },
    ],
  },
};

export default nextConfig;