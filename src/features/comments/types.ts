// src/features/comments/types.ts

/** 댓글 상태 (백엔드 enum 값에 맞춰서) */
export type CommentStatus = "DRAFT" | "PUBLISHED" | "JUNK" | "REPORTED";

/** ✅ CommentRequestDto
 *  - POST /api/comments/drafts
 *  - PATCH /api/comments/drafts/{id}
 *  - POST /api/comments/publish
 *  - POST /api/comments/publish/{id}
 */
export interface CommentRequestDto {
  /** 댓글이 달릴 문의의 ID (enquiryId: Long) */
  enquiryId: number;
  /** 댓글 내용 (content: String) */
  content: string;
}

/** ✅ CommentResponseDto
 *  모든 성공 응답(200 CommentResponseDto)에 공통으로 온다고 가정
 *  - drafts, publish, publish/{id}, enquiry/{id} 조회 등
 */
export interface CommentResponseDto {
  /** 댓글 ID */
  id: number;
  /** 어떤 문의(enquiry)에 달린 댓글인지 */
  enquiryId: number;
  /** 댓글 내용 */
  content: string;

  /** 댓글 상태 (초안 / 발행 / 정크 등) */
  status: CommentStatus; // 백엔드 필드명이 enquiryStatus면 여기도 맞춰서 변경

  /** 작성/수정 일시 (ISO 문자열) */
  createdAt: string;
  updatedAt: string;

  /** 그 외 서버에서 내려줄 수 있는 부가 정보들 (있으면 사용) */
  authorName?: string;
  authorEmail?: string;
}
