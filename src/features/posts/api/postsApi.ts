import api from "@/lib/apiClient";
import { PostRequestDto, PostResponseDto, PostHitResponseDto } from "../types";

// ✅ 전체 게시물 조회
export const fetchPosts = async (): Promise<PostResponseDto[]> => {
  console.log("📡 [전체 게시물 조회 요청]");
  try {
    const res = await api.get<PostResponseDto[]>("/posts");
    console.log("✅ [전체 게시물 조회 성공]", res.data);
    return res.data;
  } catch (error) {
    console.error("🚨 [전체 게시물 조회 실패]", error);
    throw error;
  }
};

// ✅ 게시된 게시물 수 조회
export const fetchPublishedCount = async (): Promise<number> => {
  console.log("🔢 [게시된 게시물 수 조회 요청]");
  try {
    const res = await api.get<number>("/posts/count/published");
    console.log("✅ [게시물 수 조회 성공]", res.data);
    return res.data;
  } catch (error) {
    console.error("🚨 [게시물 수 조회 실패]", error);
    throw error;
  }
};

// ✅ 게시된 게시물 n개 조회
export const fetchPublishedPosts = async (limit?: number): Promise<PostResponseDto[]> => {
  console.log("📰 [게시된 게시물 조회 요청]", { limit });
  try {
    const res = await api.get<PostResponseDto[]>("/posts/published", { params: { limit } });
    console.log("✅ [게시된 게시물 조회 성공]", res.data);
    return res.data;
  } catch (error) {
    console.error("🚨 [게시된 게시물 조회 실패]", error);
    throw error;
  }
};

// ✅ 게시물 상세 조회
export const fetchPost = async (id: number): Promise<PostResponseDto> => {
  console.log(`📄 [게시물 상세 조회 요청] ID=${id}`);
  try {
    const res = await api.get<PostResponseDto>(`/posts/${id}`);
    console.log("✅ [게시물 상세 조회 성공]", res.data);
    return res.data;
  } catch (error) {
    console.error("🚨 [게시물 상세 조회 실패]", error);
    throw error;
  }
};

// ✅ 상태별 게시물 조회
export const fetchPostsByStatus = async (status: string): Promise<PostResponseDto[]> => {
  console.log(`📋 [상태별 게시물 조회 요청] postStatus=${status}`);
  try {
    const res = await api.get<PostResponseDto[]>("/posts/by-status", {
      params: { postStatus: status },
    });
    console.log("✅ [상태별 게시물 조회 성공]", res.data);
    return res.data;
  } catch (error) {
    console.error("🚨 [상태별 게시물 조회 실패]", error);
    throw error;
  }
};

// ✅ 임시 저장 생성
export const createDraft = async (dto: PostRequestDto): Promise<PostResponseDto> => {
  console.log("📝 [임시 저장 생성 요청]", dto);
  try {
    const res = await api.post<PostResponseDto>("/posts/drafts", dto);
    console.log("✅ [임시 저장 생성 성공]", res.data);
    return res.data;
  } catch (error) {
    console.error("🚨 [임시 저장 생성 실패]", error);
    throw error;
  }
};

// ✅ 임시/예약 글 업데이트
export const updateDraft = async (
  id: number,
  dto: PostRequestDto
): Promise<PostResponseDto> => {
  console.log(`✏️ [임시/예약 글 수정 요청] ID=${id}`, dto);
  try {
    const res = await api.patch<PostResponseDto>(`/posts/drafts/${id}`, dto);
    console.log("✅ [임시/예약 글 수정 성공]", res.data);
    return res.data;
  } catch (error) {
    console.error("🚨 [임시/예약 글 수정 실패]", error);
    throw error;
  }
};

// ✅ 게시 (신규/업서트)
export const createPost = async (dto: PostRequestDto): Promise<PostResponseDto> => {
  console.log("🚀 [게시물 업서트 요청]", dto);
  try {
    const res = await api.post<PostResponseDto>("/posts/publish", dto);
    console.log("✅ [게시물 업서트 성공]", res.data);
    return res.data;
  } catch (error) {
    console.error("🚨 [게시물 업서트 실패]", error);
    throw error;
  }
};

// ✅ 예약 업서트
export const schedulePost = async (dto: PostRequestDto): Promise<PostResponseDto> => {
  console.log("⏰ [게시물 예약 업서트 요청]", dto);
  try {
    const res = await api.post<PostResponseDto>("/posts/schedule", dto);
    console.log("✅ [게시물 예약 업서트 성공]", res.data);
    return res.data;
  } catch (error) {
    console.error("🚨 [게시물 예약 업서트 실패]", error);
    throw error;
  }
};

// ✅ 게시물 삭제
export const deletePost = async (id: number): Promise<void> => {
  console.log(`🗑️ [게시물 삭제 요청] ID=${id}`);
  try {
    await api.delete(`/posts/${id}`);
    console.log("✅ [게시물 삭제 성공]");
  } catch (error) {
    console.error("🚨 [게시물 삭제 실패]", error);
    throw error;
  }
};

// ✅ 게시물 클릭 카운트 증가
export const increaseHit = async (id: number): Promise<PostHitResponseDto> => {
  console.log(`👆 [게시물 클릭 카운트 요청] ID=${id}`);
  try {
    const res = await api.post<PostHitResponseDto>(`/posts/click/${id}`);
    console.log("✅ [클릭 카운트 증가 성공]", res.data);
    return res.data;
  } catch (error) {
    console.error("🚨 [클릭 카운트 증가 실패]", error);
    throw error;
  }
};
