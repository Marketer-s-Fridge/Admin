// src/features/posts/hooks/admin/useCreatePost.ts
import { useMutation } from "@tanstack/react-query";
import { createPost } from "../../api/postsApi";
import { PostRequestDto } from "../../types";

export type CreatePostArgs = {
  dto: PostRequestDto;
  postId?: number;
  etag?: string;
};

export const useCreatePost = () => {
  return useMutation({
    mutationFn: (args: CreatePostArgs) => createPost(args),
  });
};
