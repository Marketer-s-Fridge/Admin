import api from "@/lib/apiClient";
import { CommentRequestDto, CommentResponseDto } from "../types";

// ✅ 댓글 작성
export const createComment = async (dto: CommentRequestDto): Promise<CommentResponseDto> => {
  console.log("💬 [댓글 작성 요청]", dto);
  try {
    const res = await api.post<CommentResponseDto>("/comments", dto);
    console.log("✅ [댓글 작성 성공]", res.data);
    return res.data;
  } catch (error) {
    console.error("🚨 [댓글 작성 실패]", error);
    throw error;
  }
};

// ✅ 댓글 수정
export const updateComment = async (
  id: number,
  content: string
): Promise<CommentResponseDto> => {
  console.log(`✏️ [댓글 수정 요청] ID=${id}, 내용=${content}`);
  try {
    const res = await api.put<CommentResponseDto>(`/comments/${id}`, { content });
    console.log("✅ [댓글 수정 성공]", res.data);
    return res.data;
  } catch (error) {
    console.error("🚨 [댓글 수정 실패]", error);
    throw error;
  }
};

// ✅ 댓글 삭제
export const deleteComment = async (id: number): Promise<void> => {
  console.log(`🗑️ [댓글 삭제 요청] ID=${id}`);
  try {
    await api.delete(`/comments/${id}`);
    console.log("✅ [댓글 삭제 성공]");
  } catch (error) {
    console.error("🚨 [댓글 삭제 실패]", error);
    throw error;
  }
};

// ✅ 특정 문의 댓글 목록 조회
export const fetchCommentsByEnquiry = async (
  enquiryId: number
): Promise<CommentResponseDto[]> => {
  console.log(`📡 [문의 댓글 조회 요청] enquiryId=${enquiryId}`);
  try {
    const res = await api.get<CommentResponseDto[]>(`/comments/enquiry/${enquiryId}`);
    console.log("✅ [댓글 조회 성공]", res.data);
    return res.data;
  } catch (error) {
    console.error("🚨 [댓글 조회 실패]", error);
    throw error;
  }
};
