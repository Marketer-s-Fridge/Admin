// hooks/useVisitorStats.ts
import { useQuery } from "@tanstack/react-query";
import { fetchVisitorStats } from "../api/visitorsApi";
import { SessionStats } from "../types";

/** ✅ 세션 기준 방문 통계 훅 */
export function useVisitorStats() {
  return useQuery<SessionStats>({
    queryKey: ["visitorStats"],
    queryFn: fetchVisitorStats,
    staleTime: 1000 * 60 * 10, // 10분 캐시
  });
}