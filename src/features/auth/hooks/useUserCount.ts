import { useQuery } from "@tanstack/react-query";
import { fetchUserCount } from "../api/authApi";

/** ✅ 전체 사용자 수 조회 훅 */
export function useUserCount() {
  return useQuery<number>({
    queryKey: ["userCount"],
    queryFn: fetchUserCount,
    staleTime: 1000 * 60 * 5, // 5분 캐시
  });
}
