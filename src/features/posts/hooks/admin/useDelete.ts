// useDeletePost.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deletePost } from "../../api/postsApi";

export function useDeletePost() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: deletePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
}
