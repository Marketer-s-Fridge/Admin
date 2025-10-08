import api from "@/lib/apiClient";
import { CommentRequestDto, CommentResponseDto } from "../types";

// ✅ 댓글 작성
export const createComment = async (dto: CommentRequestDto): Promise<CommentResponseDto> => {
  const res = await api.post<CommentResponseDto>("/comments", dto);
  return res.data;
};

// ✅ 댓글 수정
export const updateComment = async (
  id: number,
  content: string
): Promise<CommentResponseDto> => {
  const res = await api.put<CommentResponseDto>(`/comments/${id}`, { content });
  return res.data;
};

// ✅ 댓글 삭제
export const deleteComment = async (id: number): Promise<void> => {
  await api.delete(`/comments/${id}`);
};

// ✅ 특정 문의 댓글 목록 조회
export const fetchCommentsByEnquiry = async (
  enquiryId: number
): Promise<CommentResponseDto[]> => {
  const res = await api.get<CommentResponseDto[]>(`/comments/enquiry/${enquiryId}`);
  return res.data;
};
