// src/features/posts/hooks/admin/useCreatePost.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPost } from "../../api/postsApi";
import { PostRequestDto, PostResponseDto } from "../../types";

export function useCreatePost() {
  const qc = useQueryClient();
  return useMutation<PostResponseDto, Error, PostRequestDto>({
    mutationFn: (dto) => createPost(dto),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["posts"] }),
  });
}
