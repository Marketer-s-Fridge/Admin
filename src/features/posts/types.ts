// ======================
// 공통 타입
// ======================

// 게시물 상태 (요청에는 DELETED 안 쓰더라도 응답에서 올 수 있으니 포함)
export type PostStatus = "DRAFT" | "SCHEDULED" | "PUBLISHED" | "DELETED";

// Hit 타입
export type HitType = "VIEW" | "CLICK" | "SCROLL" | string;

// ======================
// 요청 DTO (PostRequestDto)
// ======================

export interface PostRequestDto {
  /** 제목 (@NotBlank 공통) */
  title: string;

  /** 부제목 (선택) */
  subTitle?: string;

  /** 카테고리 (@NotBlank: Publish, Schedule) */
  category: string;

  /** 유형 (@NotBlank: Publish, Schedule) */
  type: string;

  /** 본문 내용 (@NotBlank: Publish, Schedule) */
  content: string;

  /** 이미지 URL 목록 (선택) */
  images?: string[];

  /** 워크플로우 상태 (선택: 작업중, 작업 완료, 검토 대기 등) */
  workflowStatus?: string;

  /** 게시 상태 (선택: DRAFT / PUBLISHED / SCHEDULED) */
  postStatus?: PostStatus;

  /** 예약 시간 (@NotBlank: Schedule, ISO LocalDateTime 문자열) */
  scheduledTime?: string;

  /** 에디터 픽 여부 (선택, 기본 false) */
  editorPick?: boolean;
}

// ======================
// 응답 DTO (PostHitResponseDto)
// ======================

export interface PostHitResponseDto {
  /** Post Hit(조회/클릭 등) 기록 ID */
  id: number;

  /** 어떤 게시글에 대한 Hit인지 나타내는 게시글 ID */
  postId: number;

  /** Hit 종류 (VIEW / CLICK / SCROLL 등) */
  hitType: HitType;

  /** Hit을 발생시킨 유저 식별자 (비회원일 경우 null 또는 익명 ID) */
  userId: string | null;

  /** 요청자의 IP 주소 */
  ip: string;

  /** 요청자의 브라우저·디바이스 User-Agent 정보 */
  userAgent: string;

  /** 해당 Hit 기록이 저장된 시각 (ISO LocalDateTime 문자열) */
  createdAt: string;
}

// ======================
// 응답 DTO (PostResponseDto)
// ======================

export interface PostResponseDto {
  /** 게시글 ID */
  id: number;

  /** 게시글 제목 */
  title: string;

  /** 부제목 */
  subTitle: string;

  /** 게시글 분류 카테고리 */
  category: string;

  /** 게시글 유형(ex: GUIDE, REVIEW 등 서비스 정의 타입) */
  type: string;

  /** 게시글 본문 내용 (HTML 또는 Markdown 가능) */
  content: string;

  /** 첨부 이미지 URL 리스트 */
  images: string[];

  /** 워크플로우 상태 (예: DRAFT, REVIEWING, APPROVED 등) */
  workflowStatus: string;

  /** 게시 상태 (예: PUBLISHED, SCHEDULED, DELETED 등) */
  postStatus: PostStatus;

  /** 예약 발생 시간(예약 게시글일 경우, 없으면 null 가능) */
  scheduledTime: string | null;

  /** 실제 게시된 시각 (없으면 null 가능) */
  publishedAt: string | null;

  /** 게시글 버전(낙관적 락 및 업데이트 관리용) */
  version: number;

  /** 게시글 생성일 */
  createdAt: string;

  /** 게시글 수정일 */
  updatedAt: string;

  /** 조회수 */
  viewCount: number;

  /** 클릭 수 (Call-to-action 버튼 또는 링크 클릭 등) */
  clickCount: number;
}
