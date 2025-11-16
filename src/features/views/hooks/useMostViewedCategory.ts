// src/features/views/hooks/useMostViewedCategory.ts
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  RecentViewedResponseDto,
  MostViewedCategoryRequestDto,
} from "../types";
import {
  fetchRecentViews,
  fetchCategoryStats,
  fetchMostViewedCategory,
  postViewRecord,
} from "../api/mostViewedCategory";

/** ✅ 최근 본 콘텐츠 목록 */
export const useRecentViews = () =>
  useQuery<RecentViewedResponseDto[]>({
    queryKey: ["recentViews"],
    queryFn: fetchRecentViews,
  });

/** ✅ 카테고리별 조회 수 통계 */
export const useCategoryStats = () =>
  useQuery<Record<string, number>>({
    queryKey: ["categoryStats"],
    queryFn: fetchCategoryStats,
  });

/** ✅ 내가 가장 많이 본 카테고리 (string | null) */
export const useMostViewedCategory = () =>
  useQuery<string | null>({
    queryKey: ["mostViewedCategory"],
    queryFn: fetchMostViewedCategory,
  });

/** ✅ 게시글 조회 기록 남기기 mutation */
export const usePostViewRecord = () =>
  useMutation({
    mutationFn: (dto: MostViewedCategoryRequestDto) => postViewRecord(dto),
  });
