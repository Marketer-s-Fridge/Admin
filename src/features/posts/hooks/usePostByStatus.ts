// src/features/posts/hooks/usePostsByStatus.ts
import { useQuery } from "@tanstack/react-query";
import { fetchPostsByStatus, PostStatus } from "../api/postsApi";
import { PostResponseDto } from "../types";

type Options = {
  enabled?: boolean;
  staleTime?: number;
};

export function usePostsByStatus(
  status: PostStatus,
  options?: Options
) {
  return useQuery<PostResponseDto[]>({
    queryKey: ["posts", "byStatus", status],
    queryFn: () => fetchPostsByStatus(status),
    enabled: options?.enabled ?? !!status,
    staleTime: options?.staleTime ?? 60_000,
  });
}
