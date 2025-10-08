// 게시물
export type PostStatus = "DRAFT" | "SCHEDULED" | "PUBLISHED";

export interface PostRequestDto {
  title: string;
  subTitle?: string;
  category: string;
  type: string;
  content: string;
  images?: string[];
  workflowStatus?: string;
  postStatus?: PostStatus;
  scheduledTime?: string; // ISO format
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
