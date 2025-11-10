import { useQuery } from "@tanstack/react-query";
// import { fetchPublishedPosts } from "../api/postApi";
import { PostResponseDto } from "../types";
import { fetchPublishedPosts } from "../api/postsApi";

/** ✅ 게시된 게시물 n개 조회 훅 (기본 6개) */
export function usePublishedPosts(limit = 6) {
  return useQuery<PostResponseDto[]>({
    queryKey: ["publishedPosts", limit],
    queryFn: () => fetchPublishedPosts(limit),
    staleTime: 1000 * 60 * 5, // 5분 캐시
  });
}
