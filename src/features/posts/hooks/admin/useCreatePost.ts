// useCreatePost.ts
// import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPost } from "../../api/postsApi";
import { PostRequestDto, PostResponseDto } from "../../types";

export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation<PostResponseDto, Error, PostRequestDto>({
    mutationFn: createPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
}
