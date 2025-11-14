// api/visitorStats.ts
import api from "@/lib/apiClient";
// import { VisitorTrackQuery, SessionStats } from "../types/visitorStats";
import { VisitorTrackQuery, SessionStats } from "../types"

/** ✅ 방문자 추적 (첫 진입 시 호출) */
export const trackVisitor = async (query?: VisitorTrackQuery): Promise<void> => {
  await api.post("/api/visitors/track", null, { params: query });
};

/** ✅ 세션 기준 방문 통계 조회 */
export const fetchVisitorStats = async (): Promise<SessionStats> => {
  const res = await api.get<SessionStats>("/api/visitors/stats");
  return res.data;
};
