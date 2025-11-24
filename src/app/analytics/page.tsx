// src/app/admin/analytics/page.tsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import AdminHeader from "@/components/adminHeader";
import AdminCategoryBar from "@/components/adminCategoryBar";
import Pagination from "@/components/pagination";
import AdminSearchInput from "@/components/adminSearchInput";
import MobileMenu from "@/components/mobileMenu";
import AdminContentTable, {
  AdminContentItem,
} from "@/components/adminContentTable";
import DateRangePickerModal from "@/components/dateRangePickerModal";
import CustomDropdown2A11Y from "@/components/customDropdown2";

import type { PostStatus } from "@/features/posts/api/postsApi";
import { usePostsByStatus } from "@/features/posts/hooks/usePostByStatus";

interface AnalyticsItem extends AdminContentItem {
  views: number;
  bookmarks: number;
  engagementRate: string; // "12.6%" 형태 (조회수 대비 북마크 비율)
  rawDate: string | null; // 실제 날짜 비교용
}

const PAGE_SIZE = 8; // 한 페이지 당 8개

// 날짜 포맷터: "2025/05/10" 형태
const formatDate = (dateStr: string | null | undefined) => {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return "-";

  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}/${m}/${day}`;
};

const AnalyticsPage = () => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showCalendar, setShowCalendar] = useState(false);
  const [sortOption, setSortOption] = useState<string>("반응률 높은 순");
  const [menuOpen, setMenuOpen] = useState(false);

  // ✅ 기간 필터 상태 (ISO 문자열로 보관)
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);

  // ✅ PUBLISHED 상태 게시글들 조회
  const {
    data: posts,
    isLoading,
    isError,
  } = usePostsByStatus("PUBLISHED" as PostStatus);

  // ✅ 조회한 게시글을 AnalyticsItem 형태로 변환
  const analyticsData: AnalyticsItem[] = useMemo(() => {
    if (!posts) return [];

    return posts.map((post) => {
      const views = post.viewCount ?? 0;
      const bookmarks = post.bookmarkCount ?? 0;
      const engagement =
        views > 0 ? `${((bookmarks / views) * 100).toFixed(1)}%` : "0.0%";

      const rawDate = post.publishedAt || post.createdAt || null;

      return {
        id: post.id,
        title: post.title,
        date: formatDate(rawDate),
        image: post.images?.[0] || "/images/default-thumbnail.jpg", // 썸네일 없을 때 기본 이미지
        views,
        bookmarks,
        engagementRate: engagement,
        rawDate,
      };
    });
  }, [posts]);

  // ✅ 기간 + 검색 + 정렬 적용
  const filteredData = useMemo(() => {
    const keyword = search.toLowerCase();

    // 1) 기간 필터
    const byDate = analyticsData.filter((item) => {
      if (!startDate && !endDate) return true; // 기간 선택 안 했으면 전체

      if (!item.rawDate) return false;
      const time = new Date(item.rawDate).getTime();
      if (Number.isNaN(time)) return false;

      // start ~ end(포함)
      if (startDate) {
        const s = new Date(startDate);
        s.setHours(0, 0, 0, 0);
        if (time < s.getTime()) return false;
      }

      if (endDate) {
        const e = new Date(endDate);
        e.setHours(23, 59, 59, 999);
        if (time > e.getTime()) return false;
      }

      return true;
    });

    // 2) 검색어 필터
    const searched = byDate.filter((item) =>
      item.title.toLowerCase().includes(keyword)
    );

    // 3) 정렬
    const sorted = [...searched].sort((a, b) => {
      switch (sortOption) {
        case "조회수 높은 순":
          return b.views - a.views;
        case "북마크수 높은 순":
          return b.bookmarks - a.bookmarks;
        case "반응률 높은 순":
          return parseFloat(b.engagementRate) - parseFloat(a.engagementRate);
        default:
          // 기본: 번호(게시글 id) 내림차순 = 최신순이라 가정
          return b.id - a.id;
      }
    });

    return sorted;
  }, [analyticsData, search, sortOption, startDate, endDate]);

  // ✅ 페이지네이션 적용
  const totalPages = Math.max(1, Math.ceil(filteredData.length / PAGE_SIZE));
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    return filteredData.slice(start, end);
  }, [filteredData, currentPage]);

  // 페이지 변경 시 목록 길이보다 페이지가 커지면 1페이지로 리셋
  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(1);
  }, [totalPages, currentPage]);

  return (
    <main className="bg-white min-h-screen">
      <AdminHeader onMenuClick={() => setMenuOpen(!menuOpen)} />
      <AdminCategoryBar />
      {/* 오버레이 메뉴 (모바일용) */}
      <MobileMenu menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      <section className="px-4 sm:px-6 lg:px-[15%] py-5 sm:py-[4%]">
        {/* 상단 타이틀 + 검색/필터 */}
        <div className="mb-3 sm:mb-4">
          <h1 className="text-base sm:text-lg font-semibold text-gray-900">
            콘텐츠 성과 분석
          </h1>
          <p className="mt-1 text-[11px] sm:text-xs text-gray-400">
            업로드된 카드뉴스의 조회수, 북마크 수, 반응률을 한 번에 확인할 수 있어요.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pb-3 sm:pb-[1.5%]">
          {/* 검색 영역 */}
          <div className="w-full sm:max-w-xs">
            <AdminSearchInput
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          {/* 기간 + 정렬 영역 */}
          <div className="flex w-full sm:w-auto justify-between sm:justify-end gap-2 sm:gap-3">
            <button
              onClick={() => setShowCalendar(true)}
              className="
                flex-1 sm:flex-none
                cursor-pointer
                border border-gray-300
                rounded-lg
                px-3 py-2
                text-gray-500
                text-[11px] sm:text-[12px] lg:text-sm
                text-left
                inline-flex items-center justify-between sm:justify-start gap-2
                bg-white
              "
            >
              <span className="truncate">
                {startDate && endDate
                  ? `${formatDate(startDate)} ~ ${formatDate(endDate)}`
                  : "기간 선택"}
              </span>
              <span className="hidden sm:inline text-[11px] text-gray-400">
                선택
              </span>
            </button>

            <CustomDropdown2A11Y
              label={sortOption}
              options={[
                "반응률 높은 순",
                "조회수 높은 순",
                "북마크수 높은 순",
              ]}
              onSelect={(value) => {
                setSortOption(value);
                setCurrentPage(1); // 정렬 바뀔 때 1페이지로
              }}
              buttonClassName="border border-gray-300 rounded-lg px-3 py-2 text-[11px] sm:text-[12px] lg:text-sm text-gray-500 bg-white"
              className="text-gray-500 place-self-end"
            />
          </div>
        </div>

        {/* ✅ 로딩 / 에러 처리 */}
        {isLoading && (
          <div className="py-10 text-center text-gray-500 text-sm">
            데이터 불러오는 중...
          </div>
        )}
        {isError && !isLoading && (
          <div className="py-10 text-center text-red-500 text-sm">
            분석 데이터를 불러오는 데 실패했습니다.
          </div>
        )}

        {!isLoading && !isError && (
          <>
            {/* 테이블 래퍼: 모바일에서는 가로 스크롤 허용 */}
            <div className="mt-2 sm:mt-4 rounded-lg border border-gray-100 bg-white shadow-sm">
              <div className="-mx-4 sm:mx-0 overflow-x-auto">
                <div className="min-w-[720px] sm:min-w-0">
                  <AdminContentTable
                    data={paginatedData}
                    columns={[
                      "id",
                      "image",
                      "title",
                      "date",
                      "views",
                      "bookmarks",
                      "engagementRate",
                    ]}
                    columnLabels={[
                      "번호",
                      "",
                      "콘텐츠",
                      "업로드 날짜",
                      "조회수",
                      "북마크 수",
                      "북마크율",
                    ]}
                    showHeader={true}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-center mt-5 sm:mt-6">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => setCurrentPage(page)}
              />
            </div>
          </>
        )}
      </section>

      <DateRangePickerModal
        visible={showCalendar}
        onClose={() => setShowCalendar(false)}
        onApply={(start, end) => {
          setStartDate(start ? start.toISOString() : null);
          setEndDate(end ? end.toISOString() : null);
          setCurrentPage(1);
          setShowCalendar(false);
        }}
      />
    </main>
  );
};

export default AnalyticsPage;
