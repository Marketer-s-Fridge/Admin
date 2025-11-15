// src/features/comments/types.ts

/** 🔹 문의 상태 (댓글 응답에서 사용)
 *  예: RECEIVED, JUNK, ANSWERED 등 시스템 정의 상태값
 */
export type EnquiryStatusForComment =
  | "RECEIVED"
  | "JUNK"
  | "ANSWERED"
  | string;

/** 🔹 댓글 게시 상태 (publishedStatus)
 *  예: DRAFT, PUBLISHED 등 시스템 정의 상태값
 */
export type CommentPublishedStatus =
  | "DRAFT"
  | "PUBLISHED"
  | "JUNK"
  | "REPORTED"
  | string;

/** ✅ CommentRequestDto
 *  - POST  /api/comments/drafts
 *  - PATCH /api/comments/drafts/{commentId}
 *  - POST  /api/comments/publish
 *  - POST  /api/comments/publish/{commentId}
 */
export interface CommentRequestDto {
  /** 댓글이 달릴 문의의 ID (enquiryId: Long) */
  enquiryId: number;

  /** 댓글(답변) 내용 (content: String) */
  content: string;
}

/** ✅ CommentResponseDto (엑셀 명세 기준)
 *  - GET  /api/comments/enquiry/{enquiryId}
 *  - POST /api/comments/drafts
 *  - POST /api/comments/publish
 *  - 등에서 공통으로 사용
 */
export interface CommentResponseDto {
  /** 댓글 ID (Primary Key) */
  id: number;

  /** 연결된 문의 ID */
  enquiryId: number;

  /** 댓글(답변) 내용 */
  content: string;

  /** 문의 상태 값 (예: RECEIVED, JUNK, ANSWERED 등) */
  enquiryStatus: EnquiryStatusForComment;

  /** 댓글 게시 상태 (예: DRAFT, PUBLISHED 등) */
  publishedStatus: CommentPublishedStatus;

  /** 댓글 생성 시각 (LocalDateTime → ISO 문자열) */
  createdAt: string;

  /** 댓글 마지막 수정 시각 (LocalDateTime → ISO 문자열) */
  updatedAt: string;
}
