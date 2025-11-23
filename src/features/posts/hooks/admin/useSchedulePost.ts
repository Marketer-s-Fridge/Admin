// src/features/posts/hooks/admin/useSchedulePost.ts
import { useMutation } from "@tanstack/react-query";
import { schedulePost } from "../../api/postsApi";
import { PostRequestDto } from "../../types";

export type SchedulePostArgs = {
  dto: PostRequestDto;
  postId?: number;
  etag?: string;
};

export const useSchedulePost = () => {
  return useMutation({
    mutationFn: (args: SchedulePostArgs) => schedulePost(args),
  });
};
