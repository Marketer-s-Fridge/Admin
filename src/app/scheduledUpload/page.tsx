// ScheduledUploadPage.tsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import AdminHeader from "@/components/adminHeader";
import AdminCategoryBar from "@/components/adminCategoryBar";
import Pagination from "@/components/pagination";
import CustomDropdown from "@/components/customDropdown";
import AdminSearchInput from "@/components/adminSearchInput";
import MobileMenu from "@/components/mobileMenu";
import AdminContentTable, { AdminContentItem } from "@/components/adminContentTable";
import CustomDropdown2A11Y from "@/components/customDropdown2";

// ✅ 추가
import { usePostsByStatus } from "@/features/posts/hooks/usePostByStatus";
import { PostResponseDto } from "@/features/posts/types";

interface ContentItem extends AdminContentItem {
  category: string;
  date: string;
  time: string;
  visibility: "공개" | "비공개";
}

const fmtDate = (iso?: string) =>
  iso ? new Date(iso).toLocaleDateString("ko-KR").replace(/\./g, "/").replace(/\s/g, "") : "-";
const fmtTime = (iso?: string) =>
  iso ? new Date(iso).toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit", hour12: false }) : "-";

// 서버 필드 이름이 프로젝트마다 다를 수 있음 → scheduledAt 우선, 없으면 createdAt 사용
const getWhen = (p: Partial<PostResponseDto>): { d: string; t: string } => {
  const ts =
    (p as any).scheduledAt ||
    (p as any).reserveAt ||
    (p as any).reservedAt ||
    (p as any).publishAt ||
    p.createdAt;
  return { d: fmtDate(ts), t: fmtTime(ts) };
};

const ScheduledUploadPage = () => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const router = useRouter();

  // ✅ SCHEDULED 게시물 로드
  const { data: scheduled, isLoading, isError } = usePostsByStatus("SCHEDULED");

  // ✅ 서버 데이터 → 테이블 rows
  const [rows, setRows] = useState<ContentItem[]>([]);

  useEffect(() => {
    if (!scheduled) return;
    const mapped: ContentItem[] = scheduled.map((p) => {
      const { d, t } = getWhen(p);
      return {
        id: p.id!,
        title: p.title ?? "-",
        category: (p as any).category ?? "-",
        date: d,
        time: t,
        visibility: (p as any).visibility === "PRIVATE" ? "비공개" : "공개",
        image: (p as any).thumbnailUrl || (p as any).imageUrl || "",
        selected: false,
        onSelectChange: () => {},
      };
    });
    setRows(mapped);
  }, [scheduled]);

  // ✅ 개별 체크박스
  const handleSelectChange = (id: number, checked: boolean) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, selected: checked } : r)));
  };

  // ✅ 전체 선택
  const handleSelectAll = (checked: boolean) => {
    setRows((prev) => prev.map((r) => ({ ...r, selected: checked })));
  };

  const filteredData = useMemo(() => {
    return rows.filter((item) => {
      const matchesCategory = !selectedCategory || item.category === selectedCategory;
      const matchesSearch = !search || item.title.includes(search) || item.category.includes(search);
      return matchesCategory && matchesSearch;
    });
  }, [rows, selectedCategory, search]);

  // ✅ 페이지네이션 계산 (페이지당 20개 예시)
  const itemsPerPage = 20;
  const totalPages = Math.max(1, Math.ceil(filteredData.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  if (isLoading) {
    return (
      <main className="bg-white min-h-screen">
        <AdminHeader onMenuClick={() => setMenuOpen(!menuOpen)} />
        <AdminCategoryBar />
        <div className="px-4 sm:px-10 lg:px-[15%] py-[4%] text-sm text-gray-500">불러오는 중…</div>
      </main>
    );
  }
  if (isError) {
    return (
      <main className="bg-white min-h-screen">
        <AdminHeader onMenuClick={() => setMenuOpen(!menuOpen)} />
        <AdminCategoryBar />
        <div className="px-4 sm:px-10 lg:px-[15%] py-[4%] text-sm text-red-500">예약 글을 불러오지 못했습니다.</div>
      </main>
    );
  }

  return (
    <main className="bg-white min-h-screen">
      <AdminHeader onMenuClick={() => setMenuOpen(!menuOpen)} />
      <AdminCategoryBar />
      <MobileMenu menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      <section className="px-4 sm:px-10 lg:px-[15%] py-[4%]">
        <div className="flex flex-row sm:flex-row gap-3 mb-4 justify-between">
          <AdminSearchInput value={search} onChange={(e) => setSearch(e.target.value)} />
          <div className="flex flex-row ">
            <CustomDropdown
              label="카테고리 선택"
              options={["전체", "Beauty", "Food", "Fashion", "Lifestyle", "Tech"]}
              onSelect={(v) => setSelectedCategory(v === "전체" ? null : v)}
              buttonClassName="rounded-lg"
              className="text-gray-500"
            />
          </div>
        </div>

        <div className="flex justify-between items-center mb-2 ml-4">
          <div className="flex items-center gap-6">
            <input
              type="checkbox"
              checked={rows.length > 0 && rows.every((r) => r.selected)}
              onChange={(e) => handleSelectAll(e.target.checked)}
              className="relative w-5 h-5 appearance-none rounded border-1 border-gray-300 cursor-pointer
                         transition-all duration-200 checked:bg-gray-800 checked:border-gray-800
                         before:content-[''] before:absolute before:top-[2px] before:left-[6px]
                         before:w-[6px] before:h-[10px] before:border-r-2 before:border-b-2
                         before:border-white before:rotate-45 before:scale-0 checked:before:scale-100
                         before:transition-transform before:duration-200"
            />
            {(() => {
              const hasSelected = rows.some((r) => r.selected);
              const active = hasSelected ? "text-black" : "text-[#C6C6C6]";
              return (
                <>
                  <button className={`text-sm font-semibold ${active}`} disabled={!hasSelected}>
                    전체 업로드
                  </button>
                  <button className={`text-sm font-semibold ${active}`} disabled={!hasSelected}>
                    전체 삭제
                  </button>
                </>
              );
            })()}
          </div>

          <CustomDropdown2A11Y
            label="업로드 예정 순"
            options={["업로드 예정 순", "작성일 순"]}
            onSelect={() => {}}
            buttonClassName="border-0"
            className="text-gray-500"
          />
        </div>

        {/* ✅ 조건부 렌더링: 데이터 없을 때 메시지 표시 */}
        {filteredData.length === 0 ? (
          <div className="text-center text-gray-500 mt-10">게시물이 없습니다.</div>
        ) : (
          <>
            <AdminContentTable
              data={currentData.map((item) => ({
                ...item,
                onSelectChange: (checked) => handleSelectChange(item.id, checked),
                onEdit: () => console.log("Edit", item.id),
                onDelete: () => console.log("Delete", item.id),
                onShare: () => console.log("Share", item.id),
                onClickRow: () => router.push(`/admin/contentsUpload/${item.id}`),
              }))}
              columns={["checkbox", "image", "title", "", "category", "date", "time", "actions"]}
              showCheckbox
              showHeader
              columnLabels={["", "", "콘텐츠", "", "카테고리", "예정 날짜", "예정 시간", ""]}
            />

            {/* 페이지네이션은 데이터 있을 때만 */}
            <div className="flex justify-center mt-6">
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
            </div>
          </>
        )}
      </section>
    </main>
  );
};

export default ScheduledUploadPage;
