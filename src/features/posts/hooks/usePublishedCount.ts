import { useQuery } from "@tanstack/react-query";
import { fetchPublishedCount } from "../api/postsApi";
// import { fetchPublishedCount } from "../api/";


/** ✅ 게시된 게시물 수 조회 훅 */
export function usePublishedCount() {
  return useQuery<number>({
    queryKey: ["publishedCount"],
    queryFn: fetchPublishedCount,
    staleTime: 1000 * 60 * 5, // 5분 캐시 유지
  });
}
