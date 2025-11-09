// 게시물
export type PostStatus = "DRAFT" | "SCHEDULED" | "PUBLISHED";

export interface PostRequestDto {
  title: string;
  subTitle?: string;
  category: string;
  type: "ARTICLE" | "VIDEO" | string;
  content: string;
  images?: string[];                 // S3 등 절대/상대 URL
  workflowStatus?: string;           // 검수, 작업완료 등 선택
  postStatus?: PostStatus;           // DRAFT | SCHEDULED | PUBLISHED
  scheduledTime?: string;            // ISO (Schedule에서 NotBlank)
  editorPick?: boolean;              // 선택, 기본 false
}


export interface PostResponseDto extends PostRequestDto {
  id: number;
  createdAt: string;
  updatedAt: string;
}

export interface PostHitResponseDto {
  postId: number;
  hitCount: number;
}
