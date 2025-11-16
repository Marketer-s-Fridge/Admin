// src/features/posts/hooks/admin/useSetEditorPick.ts
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { setEditorPick } from "@/features/posts/api/postsApi";
import type { PostResponseDto } from "@/features/posts/types";

interface SetEditorPickParams {
  postId: number;
  editorPick: boolean;
}

export const useSetEditorPick = () => {
  const queryClient = useQueryClient();

  return useMutation<PostResponseDto, Error, SetEditorPickParams>({
    mutationFn: ({ postId, editorPick }) => setEditorPick(postId, editorPick),
    onSuccess: (data, variables) => {
      // 에디터 픽 리스트 새로고침
      queryClient.invalidateQueries({ queryKey: ["editorPicks"] });

      // 전체/관리자 게시글 리스트 새로고침 (키 네이밍에 맞춰 수정)
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["adminPosts"] });

      // 상세 페이지 캐시도 있으면 갱신
      queryClient.invalidateQueries({ queryKey: ["post", variables.postId] });
    },
  });
};
