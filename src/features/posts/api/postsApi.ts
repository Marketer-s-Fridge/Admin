import api from "@/lib/apiClient";
import { PostRequestDto, PostResponseDto, PostHitResponseDto } from "../types";

// ✅ 전체 게시물 조회
export const fetchPosts = async (): Promise<PostResponseDto[]> => {
  const res = await api.get<PostResponseDto[]>("/posts");
  return res.data;
};

// ✅ 게시된 게시물 수 조회
export const fetchPublishedCount = async (): Promise<number> => {
  const res = await api.get<number>("/posts/count/published");
  return res.data;
};

// ✅ 게시된 게시물 n개 조회 (기본 6개)
export const fetchPublishedPosts = async (limit?: number): Promise<PostResponseDto[]> => {
  const res = await api.get<PostResponseDto[]>("/posts/published", {
    params: { limit },
  });
  return res.data;
};

// ✅ 게시물 상세 조회 (+뷰 카운트)
export const fetchPost = async (id: number): Promise<PostResponseDto> => {
  const res = await api.get<PostResponseDto>(`/posts/${id}`);
  return res.data;
};

// ✅ 상태별 게시물 조회
export const fetchPostsByStatus = async (status: string): Promise<PostResponseDto[]> => {
  const res = await api.get<PostResponseDto[]>("/posts/by-status", {
    params: { postStatus: status },
  });
  return res.data;
};

// ✅ 임시 저장 생성
export const createDraft = async (dto: PostRequestDto): Promise<PostResponseDto> => {
  const res = await api.post<PostResponseDto>("/posts/drafts", dto);
  return res.data;
};
3
// ✅ 임시/예약 글 업데이트
export const updateDraft = async (
  id: number,
  dto: PostRequestDto
): Promise<PostResponseDto> => {
  const res = await api.patch<PostResponseDto>(`/posts/drafts/${id}`, dto);
  return res.data;
};

// ✅ 게시 (신규/업서트)
export const createPost = async (dto: PostRequestDto): Promise<PostResponseDto> => {
  const res = await api.post<PostResponseDto>("/posts/publish", dto);
  return res.data;
};

// ✅ 예약 업서트
export const schedulePost = async (dto: PostRequestDto): Promise<PostResponseDto> => {
  const res = await api.post<PostResponseDto>("/posts/schedule", dto);
  return res.data;
};

// ✅ 게시물 삭제
export const deletePost = async (id: number): Promise<void> => {
  await api.delete(`/posts/${id}`);
};

// ✅ 게시물 클릭 카운트 증가
export const increaseHit = async (id: number): Promise<PostHitResponseDto> => {
  const res = await api.post<PostHitResponseDto>(`/posts/click/${id}`);
  return res.data;
};
