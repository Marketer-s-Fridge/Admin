// src/features/posts/hooks/admin/useUpdateDraft.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createDraft, updateDraft } from "../../api/postsApi";
import { PostRequestDto, PostResponseDto } from "../../types";

// etag까지 넘길 수 있게 타입 확장
type DraftParam = { id?: number; dto: PostRequestDto; etag?: string };

export function useUpdateDraft() {
  const qc = useQueryClient();

  return useMutation<{ data: PostResponseDto; etag?: string }, Error, DraftParam>({
    // createDraft / updateDraft 그대로 넘겨서 {data, etag} 유지
    mutationFn: ({ id, dto, etag }) => {
      if (id && id > 0) {
        return updateDraft(id, dto, etag);   // If-Match 헤더 사용
      } else {
        return createDraft(dto);
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["drafts"] });
      qc.invalidateQueries({ queryKey: ["posts"] });
    },
  });
}
