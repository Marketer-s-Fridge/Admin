import { useQuery } from "@tanstack/react-query";
import { fetchVisitorStats } from "../api/visitorsApi";

interface VisitorStatsResponse {
  todayCount: number;
  monthCount: number;
  totalCount: number;
}

/** ✅ 세션 기준 방문 통계 훅 */
export function useVisitorStats() {
  return useQuery<VisitorStatsResponse>({
    queryKey: ["visitorStats"],
    queryFn: fetchVisitorStats,
  });
}
