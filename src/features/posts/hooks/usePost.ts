// usePost.ts
import { useQuery } from "@tanstack/react-query";
import { fetchPost } from "../api/postsApi";
import { PostResponseDto } from "../types";

export function usePost(id: number) {
  return useQuery<PostResponseDto>({
    queryKey: ["post", id],
    queryFn: () => fetchPost(id),
    enabled: !!id,
  });
}
