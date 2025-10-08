
// useUpdateDraft.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateDraft } from "../../api/postsApi";
import { PostRequestDto, PostResponseDto } from "../../types";

export function useUpdateDraft() {
  const queryClient = useQueryClient();

  return useMutation<
    PostResponseDto,
    Error,
    { id: number; dto: PostRequestDto }
  >({
    mutationFn: ({ id, dto }) => updateDraft(id, dto),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["post", data.id] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
}
