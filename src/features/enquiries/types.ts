// types/enquiries.ts

/** 🔹 문의 상태 */
export type EnquiryStatus = "REPORTED" | "DRAFT" | "PUBLISHED" | "JUNK" | string;

/** 🔹 작성자 정보 DTO (WriterDto) */
export interface WriterDto {
  /** 회원 ID */
  id: number;
  /** 회원 닉네임/아이디 */
  username: string;
}

/** 🔹 문의 생성/수정 요청 DTO (EnquiryRequestDto) */
export interface EnquiryRequestDto {
  /** 제목 (@NotBlank) */
  title: string;

  /** 작성자 이메일 (@NotBlank) */
  writerEmail: string;

  /** 문의 유형/카테고리 (@NotBlank) */
  category: string;

  /** 본문 내용 (@NotBlank) */
  content: string;

  /** 개인정보 수집·이용 동의 여부 (@NotNull) */
  agreement: boolean;

  /** 첨부 이미지 URL (선택) */
  imageUrl?: string;
}

/** 🔹 문의 응답 DTO (EnquiryResponseDto) */
export interface EnquiryResponseDto {
  /** 문의 ID (Primary Key) */
  id: number;

  /** 회원 문의일 경우 작성자 정보 (비회원이면 null 가능) */
  writer: WriterDto | null;

  /** 문의 작성자 이메일 */
  writerEmail: string;

  /** 제목 */
  title: string;

  /** 문의 유형/카테고리 */
  category: string;

  /** 문의 상태 (예: RECEIVED, ANSWERED, CLOSED 등 시스템 정의 값) */
  status: EnquiryStatus;

  /** 본문 내용 */
  content: string;

  /** 생성 시각 (LocalDateTime → ISO string) */
  createdAt: string;

  /** 최종 수정 시각 (LocalDateTime → ISO string) */
  updatedAt: string;

  /** 개인정보 수집·이용 동의 여부 */
  agreement: boolean;

  /** 첨부 이미지 URL */
  imageUrl?: string | null;
}

/** 🔹 페이지네이션 공통 응답 */
export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
}
