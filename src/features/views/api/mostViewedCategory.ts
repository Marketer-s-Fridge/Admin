// src/features/views/api/mostViewedCategory.ts
import api from "@/lib/apiClient";
import {
  MostViewedCategoryRequestDto,
  MostViewedCategoryResponseDto,
  RecentViewedResponseDto,
} from "../types";

/** ✅ 최근 본 콘텐츠 목록 (GET /api/most-viewed-category/recentViews) */
export const fetchRecentViews = async (): Promise<RecentViewedResponseDto[]> => {
  const res = await api.get<RecentViewedResponseDto[]>(
    "/api/most-viewed-category/recentViews"
  );
  return res.data;
};

/** ✅ 카테고리 별 조회수 통계 (GET /api/most-viewed-category/stats) */
export const fetchCategoryStats = async (): Promise<Record<string, number>> => {
  const res = await api.get<Record<string, number>>(
    "/api/most-viewed-category/stats"
  );
  return res.data;
};

/** ✅ 내가 가장 많이 본 카테고리 (GET /api/most-viewed-category)
 *  200: "NEWS" 같은 String
 *  204: body 없음 → null 처리
 */
export const fetchMostViewedCategory = async (): Promise<string | null> => {
  const res = await api.get<string | null>("/api/most-viewed-category");
  // 204면 res.data가 undefined일 수 있으니까 null로 통일
  return res.data ?? null;
};

/** ✅ 조회 기록 반영 (POST /api/most-viewed-category) */
export const postViewRecord = async (
  dto: MostViewedCategoryRequestDto
): Promise<MostViewedCategoryResponseDto> => {
  const res = await api.post<MostViewedCategoryResponseDto>(
    "/api/most-viewed-category",
    dto
  );
  return res.data;
};
