import api from "@/lib/apiClient";

/** ✅ 세션 기준 방문 통계 조회 */
export const fetchVisitorStats = async () => {
  console.log("📡 [요청] GET /api/visitors/stats");
  const res = await api.get("/api/visitors/stats");
  console.log("✅ [응답 성공]", res.data);
  return res.data;
};
