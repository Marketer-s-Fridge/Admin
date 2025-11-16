// types/mostViewedCategory.ts

/** 🔹 조회 기록 요청 DTO (POST /api/most-viewed-category) */
export interface MostViewedCategoryRequestDto {
  /** 조회로 집계할 카테고리명 (@NotBlank) */
  category: string;

  /** 조회한 콘텐츠 ID (notNull) */
  postId: number;
}

/** 🔹 조회 기록 응답 DTO */
export interface MostViewedCategoryResponseDto {
  /** 조회 기록 ID */
  id: number;

  /** 조회한 유저 식별자 */
  userId: string;

  /** 조회된 콘텐츠의 카테고리 */
  category: string;

  /** 해당 카테고리를 가진 콘텐츠를 본 시각 (ISO LocalDateTime 문자열) */
  viewedAt: string;
}
export interface RecentViewedResponseDto {
  /** 최근 본 게시글 ID */
  postId: number;          // Long

  /** 게시글 제목 */
  title: string;           // String

  /** 썸네일 이미지 URL */
  thumbnailUrl: string;    // String

  /** 조회한 시각 (ISO LocalDateTime 문자열) */
  viewedAt: string;        // LocalDateTime
}

