export interface CommentRequestDto {
  /** 댓글이 달릴 문의의 ID */
  enquiryId: number;

  /** 댓글 내용 */
  content: string;

  /** 문의 상태 (선택) — 예: "REPORTED" | "DRAFT" | "PUBLISHED" | "JUNK" */
  enquiryStatus?: "REPORTED" | "DRAFT" | "PUBLISHED" | "JUNK";
}

export interface CommentResponseDto extends CommentRequestDto {
  /** 댓글 고유 ID */
  id: number;

  /** 생성일시 */
  createdAt: string;

  /** 수정일시 */
  updatedAt: string;
}
