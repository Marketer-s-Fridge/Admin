// src/features/comments/hooks/useComments.ts
"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createComment,
  updateComment,
  deleteComment,
  fetchCommentsByEnquiry,
} from "../api/commentApi";
import { CommentRequestDto, CommentResponseDto } from "../types";

/** ✅ 특정 문의의 댓글 목록 조회 */
export function useComments(enquiryId: number) {
  return useQuery<CommentResponseDto[]>({
    queryKey: ["comments", enquiryId],
    queryFn: () => fetchCommentsByEnquiry(enquiryId),
    enabled: !!enquiryId, // enquiryId가 있어야 실행
  });
}

/** ✅ 댓글 작성 */
export function useCreateComment() {
  const queryClient = useQueryClient();

  return useMutation<CommentResponseDto, Error, CommentRequestDto>({
    mutationFn: createComment,
    onSuccess: (data) => {
      // 성공 시 해당 문의의 댓글 목록 갱신
      queryClient.invalidateQueries({ queryKey: ["comments", data.enquiryId] });
    },
  });
}

/** ✅ 댓글 수정 */
export function useUpdateComment() {
  const queryClient = useQueryClient();

  return useMutation<
    CommentResponseDto,
    Error,
    { id: number; dto: CommentRequestDto }
  >({
    mutationFn: ({ id, dto }) => updateComment(id, dto),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["comments", data.enquiryId] });
    },
  });
}

/** ✅ 댓글 삭제 */
export function useDeleteComment() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, { id: number; enquiryId: number }>({
    mutationFn: ({ id }) => deleteComment(id),
    onSuccess: (_, { enquiryId }) => {
      queryClient.invalidateQueries({ queryKey: ["comments", enquiryId] });
    },
  });
}
