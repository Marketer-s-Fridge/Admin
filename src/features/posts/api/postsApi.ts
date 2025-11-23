// src/features/posts/api/postsApi.ts
import api from "@/lib/apiClient";
import {
  PostRequestDto,
  PostResponseDto,
  PostHitResponseDto,
} from "../types";
import { AxiosHeaderValue } from "axios";

/** 게시 상태 enum */
export type PostStatus = "DRAFT" | "SCHEDULED" | "PUBLISHED";

/** =========================
 *  공통 유틸
 * ========================*/

/** 
 * 쿼리 파라미터 유틸: undefined/null/"" 제거
 * any 사용 없이 안전하게 타입 유지
 */
const qp = <
  T extends Record<string, AxiosHeaderValue | undefined | null | "">
>(
  obj?: T
): Record<string, AxiosHeaderValue> | undefined => {
  if (!obj) return undefined;

  const clean: Record<string, AxiosHeaderValue> = {};

  for (const key of Object.keys(obj)) {
    const value = obj[key];
    if (value !== undefined && value !== null && value !== "") {
      clean[key] = value;
    }
  }

  // 아무 값도 없으면 undefined 리턴
  return Object.keys(clean).length > 0 ? clean : undefined;
};

/** 응답 헤더에서 ETag 추출 */
const getEtag = (headers?: unknown): string | undefined => {
  if (!headers || typeof headers !== "object") return undefined;

  const h = headers as Record<string, unknown>;
  const raw = h["etag"] ?? h["ETag"];

  return typeof raw === "string" ? raw : undefined;
};

/** =========================
 *  조회
 * ========================*/

export const fetchPosts = async (): Promise<PostResponseDto[]> => {
  const res = await api.get<PostResponseDto[]>("/api/posts");
  return res.data;
};

export const fetchPublishedCount = async (): Promise<number> => {
  const res = await api.get<number>("/api/posts/count/published");
  return res.data;
};

export const fetchPublishedPosts = async (
  limit?: number
): Promise<PostResponseDto[]> => {
  const res = await api.get<PostResponseDto[]>("/api/posts/published", {
    params: qp({ limit }),
  });
  return res.data;
};

export const fetchPost = async (id: number): Promise<PostResponseDto> => {
  const res = await api.get<PostResponseDto>(`/api/posts/${id}`);
  return res.data;
};

export const fetchPostWithEtag = async (
  id: number
): Promise<{ data: PostResponseDto; etag?: string }> => {
  const res = await api.get<PostResponseDto>(`/api/posts/${id}`);
  const etag = getEtag(res.headers);
  return { data: res.data, etag };
};

export const fetchPostsByStatus = async (
  status: PostStatus
): Promise<PostResponseDto[]> => {
  const res = await api.get<PostResponseDto[]>("/api/posts/by-status", {
    params: { postStatus: status },
  });
  return res.data;
};

export const fetchByCategory = async (
  category: string,
  limit?: number
): Promise<PostResponseDto[]> => {
  const res = await api.get<PostResponseDto[]>("/api/posts/by-category", {
    params: qp({ category, limit }),
  });
  return res.data;
};

export const fetchEditorPicks = async (
  limit?: number
): Promise<PostResponseDto[]> => {
  const res = await api.get<PostResponseDto[]>("/api/posts/editor-picks", {
    params: qp({ limit }),
  });
  return res.data;
};

export const fetchHotPosts = async (
  limit?: number
): Promise<PostResponseDto[]> => {
  const res = await api.get<PostResponseDto[]>("/api/posts/hot", {
    params: qp({ limit }),
  });
  return res.data;
};

/** =========================
 *  생성/수정/게시/예약
 * ========================*/

export const createDraft = async (
  dto: PostRequestDto
): Promise<{ data: PostResponseDto; etag?: string }> => {
  const res = await api.post<PostResponseDto>("/api/posts/drafts", dto);
  return { data: res.data, etag: getEtag(res.headers) };
};

export const updateDraft = async (
  id: number,
  dto: PostRequestDto,
  etag?: string
): Promise<{ data: PostResponseDto; etag?: string }> => {
  const res = await api.patch<PostResponseDto>(`/api/posts/drafts/${id}`, dto, {
    headers: qp({ "If-Match": etag }),
  });
  return { data: res.data, etag: getEtag(res.headers) };
};

export const createPost = async (args: {
  dto: PostRequestDto;
  postId?: number;
  etag?: string;
}): Promise<PostResponseDto> => {
  const res = await api.post<PostResponseDto>("/api/posts/publish", args.dto, {
    params: qp({ postId: args.postId }),
    headers: qp({ "If-Match": args.etag }),
  });
  return res.data;
};

export const schedulePost = async (args: {
  dto: PostRequestDto;
  postId?: number;
  etag?: string;
}): Promise<PostResponseDto> => {
  const res = await api.post<PostResponseDto>("/api/posts/schedule", args.dto, {
    params: qp({ postId: args.postId }),
    headers: qp({ "If-Match": args.etag }),
  });
  return res.data;
};

export const setEditorPick = async (
  postId: number,
  editorPick: boolean
): Promise<PostResponseDto> => {
  const res = await api.patch<PostResponseDto>(
    `/api/posts/${postId}/editor-pick`,
    { editorPick }
  );
  return res.data;
};

/** =========================
 *  삭제/카운트
 * ========================*/

export const deletePost = async (id: number): Promise<void> => {
  await api.delete(`/api/posts/${id}`);
};

export const increaseHit = async (
  id: number
): Promise<PostHitResponseDto> => {
  const res = await api.post<PostHitResponseDto>(`/api/posts/click/${id}`);
  return res.data;
};
