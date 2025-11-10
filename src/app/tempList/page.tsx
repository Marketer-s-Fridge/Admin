// app/admin/tempList/page.tsx
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

// ✅ 추가: 상태별 게시물 훅
import { usePostsByStatus } from "@/features/posts/hooks/usePostByStatus";
import { PostResponseDto } from "@/features/posts/types";

const fmtDate = (iso?: string) =>
  iso ? new Date(iso).toLocaleDateString("ko-KR").replace(/\./g, "/").replace(/\s/g, "") : "-";
const fmtTime = (iso?: string) =>
  iso ? new Date(iso).toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit", hour12: false }) : "-";

// PostResponseDto → AdminContentItem 매핑
const mapToRow = (p: PostResponseDto): AdminContentItem => {
  const created = p.createdAt ?? (p as any).updatedAt;
  return {
    id: p.id!,
    title: p.title ?? "-",
    category: (p as any).category?.name ?? (p as any).category ?? "-",
    date: fmtDate(created),
    // ⚠️ 이 테이블은 columns에 'status'를 쓰면서 라벨은 "저장 시간"을 달아둠.
    // 따라서 'status' 칸에 시간을 넣어 표시한다.
    status: fmtTime(created),
    visibility: (p as any).visibility === "PRIVATE" ? "비공개" : "공개",
    image: (p as any).thumbnailUrl || (p as any).imageUrl || "",
    author: (p as any).author?.username || (p as any).author || "admin",
  };
};

const TempListPage = () => {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  // ✅ DRAFT 불러오기
  const { data, isLoading, isError } = usePostsByStatus("DRAFT");

  // 서버 데이터 → 테이블 행
  const rows: AdminContentItem[] = useMemo(
    () => (data ?? []).map(mapToRow),
    [data]
  );

  const filteredData = useMemo(() => {
    return rows.filter((item) => {
      const matchesCategory = !categoryFilter || categoryFilter === item.category;
      const matchesStatus = !statusFilter || statusFilter === item.status; // 현재 'status' 칸에 시간을 넣음
      const matchesSearch =
        !search ||
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.category?.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesStatus && matchesSearch;
    });
  }, [rows, categoryFilter, statusFilter, search]);

  return (
    <main className="bg-white min-h-screen">
      <AdminHeader onMenuClick={() => setMenuOpen(!menuOpen)} />
      <AdminCategoryBar />
      <MobileMenu menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      <section className="px-4 sm:px-10 lg:px-[15%] py-[4%]">
        <div className="flex flex-col sm:flex-row gap-3 mb-4 justify-between ">
          <AdminSearchInput value={search} onChange={(e) => setSearch(e.target.value)} />

          <div className="flex flex-row gap-2">
            <CustomDropdown
              label="카테고리 선택"
              options={["전체", "Beauty", "Food", "Fashion", "Lifestyle", "Tech"]}
              onSelect={(v) => setCategoryFilter(v === "전체" ? null : v)}
              buttonClassName="rounded-lg"
              className="text-gray-500"
            />
            <CustomDropdown
              label="상태"
              options={["전체", "검토 대기", "작성 중", "피드백 반영 중", "작성 완료"]}
              onSelect={(v) => setStatusFilter(v === "전체" ? null : v)}
              buttonClassName="rounded-lg"
              className="text-gray-500"
            />
          </div>
        </div>

        {/* 로딩/에러 */}
        {isLoading && <p className="text-sm text-gray-500 px-2">불러오는 중…</p>}
        {isError && <p className="text-sm text-red-500 px-2">임시 저장본을 불러오지 못했습니다.</p>}

        <div className="flex py-3 px-2 sm:px-3 justify-between">
          <div className="flex flex-row gap-2 items-center">
            <p className="font-semibold">임시 저장본</p>
            <p className="text-xs">{filteredData.length}</p>
          </div>
          <CustomDropdown2A11Y
            label="최신 저장 순"
            options={["최신 저장 순", "오래된 순"]}
            onSelect={() => {}}
            buttonClassName="border-0"
            className="text-gray-500"
          />
        </div>

        <AdminContentTable
          data={filteredData.map((item) => ({
            ...item,
            onEdit: () => console.log(`Edit ${item.id}`),
            onDelete: () => console.log(`Delete ${item.id}`),
            onShare: () => console.log(`Share ${item.id}`),
            onClickRow: () => router.push("/admin/contentsUpload"),
          }))}
          columns={[
            "id",
            "image",
            "title",
            "author",
            "category",
            "date",
            // ⚠️ 테이블이 'status' 컬럼을 사용 중이므로 시간 문자열을 여기에 넣어둠
            "status",
            "actions",
          ]}
          showHeader
          columnLabels={[
            "번호",
            "",
            "콘텐츠",
            "관리자",
            "카테고리",
            "저장 날짜",
            "저장 시간",
            "",
          ]}
        />

        <div className="flex justify-center mt-6">
          <Pagination currentPage={currentPage} totalPages={Math.max(1, Math.ceil(filteredData.length / 20))} onPageChange={setCurrentPage} />
        </div>
      </section>
    </main>
  );
};

export default TempListPage;
