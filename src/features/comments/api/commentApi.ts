// src/features/comments/api/commentApi.ts
import api from "@/lib/apiClient";
import { CommentRequestDto, CommentResponseDto } from "../types";

/** ✅ 특정 문의의 댓글 목록 조회
 *  GET /api/comments/enquiry/{enquiryId}
 */
export const fetchCommentsByEnquiry = async (
  enquiryId: number
): Promise<CommentResponseDto[]> => {
  const res = await api.get<CommentResponseDto[]>(
    `/api/comments/enquiry/${enquiryId}`
  );
  return res.data;
};

/** ✅ 댓글 초안 생성
 *  POST /api/comments/drafts
 *  Body: CommentRequestDto (Draft)
 */
export const createDraftComment = async (
  dto: CommentRequestDto
): Promise<CommentResponseDto> => {
  const res = await api.post<CommentResponseDto>("/api/comments/drafts", dto);
  return res.data;
};

/** ✅ 댓글 초안 수정
 *  PATCH /api/comments/drafts/{commentId}
 *  Header: If-Match (옵션)
 *  Body: CommentRequestDto (Draft)
 */
export const updateDraftComment = async (
  commentId: number,
  dto: CommentRequestDto,
  etag?: string
): Promise<CommentResponseDto> => {
  const res = await api.patch<CommentResponseDto>(
    `/api/comments/drafts/${commentId}`,
    dto,
    etag
      ? {
          headers: {
            "If-Match": etag,
          },
        }
      : undefined
  );
  return res.data;
};

/** ✅ 댓글 게시 생성 (바로 Publish)
 *  POST /api/comments/publish
 *  Body: CommentRequestDto (Publish)
 */
export const createPublishComment = async (
  dto: CommentRequestDto
): Promise<CommentResponseDto> => {
  const res = await api.post<CommentResponseDto>("/api/comments/publish", dto);
  return res.data;
};

/** ✅ 댓글 게시 업데이트/갱신
 *  POST /api/comments/publish/{commentId}
 *  Header: If-Match (옵션)
 *  Body: CommentRequestDto (Publish)
 */
export const updatePublishComment = async (
  commentId: number,
  dto: CommentRequestDto,
  etag?: string
): Promise<CommentResponseDto> => {
  const res = await api.post<CommentResponseDto>(
    `/api/comments/publish/${commentId}`,
    dto,
    etag
      ? {
          headers: {
            "If-Match": etag,
          },
        }
      : undefined
  );
  return res.data;
};

/** ✅ 문의를 정크 처리
 *  POST /api/comments/junk/{enquiryId}
 */
export const markEnquiryAsJunk = async (
  enquiryId: number
): Promise<void> => {
  await api.post<void>(`/api/comments/junk/${enquiryId}`);
};

/** ✅ 댓글 삭제
 *  DELETE /api/comments/{id}
 */
export const deleteComment = async (id: number): Promise<void> => {
  await api.delete<void>(`/api/comments/${id}`);
};
