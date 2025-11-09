// src/features/posts/hooks/admin/useUpdateDraft.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createDraft, updateDraft } from "../../api/postsApi";
import { PostRequestDto, PostResponseDto } from "../../types";

// id는 옵션
type DraftParam = { id?: number; dto: PostRequestDto };

export function useUpdateDraft() {
  const qc = useQueryClient();

  return useMutation<PostResponseDto, Error, DraftParam>({
    // ✅ API가 {data, etag}를 주므로 여기서 data만 꺼내 반환
    mutationFn: async ({ id, dto }) => {
      if (id && id > 0) {
        const res = await updateDraft(id, dto); // { data, etag }
        return res.data;
      } else {
        const res = await createDraft(dto);     // { data, etag }
        return res.data;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["drafts"] });
      qc.invalidateQueries({ queryKey: ["posts"] });
    },
  });
}
