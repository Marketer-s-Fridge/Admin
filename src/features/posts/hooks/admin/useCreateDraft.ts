// src/features/posts/hooks/admin/useCreateDraft.ts
import { useMutation } from "@tanstack/react-query";
import { createDraft } from "../../api/postsApi";
import { PostRequestDto } from "../../types";

export const useCreateDraft = () => {
  return useMutation({
    mutationFn: (dto: PostRequestDto) => createDraft(dto),
  });
};
