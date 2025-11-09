// src/features/posts/hooks/admin/useSchedulePost.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { schedulePost } from "../../api/postsApi";
import { PostRequestDto, PostResponseDto } from "../../types";

export function useSchedulePost() {
  const queryClient = useQueryClient();

  return useMutation<PostResponseDto, Error, PostRequestDto>({
    mutationFn: (dto) => schedulePost(dto),   // ← 래핑
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
}