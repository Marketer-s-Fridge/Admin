// app/admin/tempList/page.tsx
"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import AdminHeader from "@/components/adminHeader";
import AdminCategoryBar from "@/components/adminCategoryBar";
import Pagination from "@/components/pagination";
import CustomDropdown from "@/components/customDropdown";
import AdminSearchInput from "@/components/adminSearchInput";
import MobileMenu from "@/components/mobileMenu";
import AdminContentTable, {
  AdminContentItem,
} from "@/components/adminContentTable";
import CustomDropdown2A11Y from "@/components/customDropdown2";

// 상태별 게시물 훅
import { usePostsByStatus } from "@/features/posts/hooks/usePostByStatus";
import { PostResponseDto } from "@/features/posts/types";

// 🔥 삭제 훅 & 모달 추가
import { useDeletePost } from "@/features/posts/hooks/admin/useDelete";
import DeleteConfirmModal from "@/components/deleteConfirmModal";

const fmtDate = (iso?: string) =>
  iso
    ? new Date(iso)
        .toLocaleDateString("ko-KR")
        .replace(/\./g, "/")
        .replace(/\s/g, "")
    : "-";
const fmtTime = (iso?: string) =>
  iso
    ? new Date(iso).toLocaleTimeString("ko-KR", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
    : "-";

// PostResponseDto → AdminContentItem 매핑
const mapToRow = (p: PostResponseDto): AdminContentItem => {
  const created = p.createdAt ?? (p as any).updatedAt;
  return {
    id: p.id!,
    title: p.title ?? "-",
    category: (p as any).category?.name ?? (p as any).category ?? "-",
    date: fmtDate(created),
    // 테이블의 'status' 컬럼을 "저장 시간" 표시에 사용
    status: fmtTime(created),
    visibility: (p as any).visibility === "PRIVATE" ? "비공개" : "공개",
    image: (p as any).images?.[0] || "",
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

  // ✅ 삭제 대상 & 모달 상태
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

  // ✅ 삭제 훅
  const { mutate: deletePostMutate, isPending: isDeleting } = useDeletePost();

  // DRAFT 불러오기
  const { data, isLoading, isError } = usePostsByStatus("DRAFT");

  // 서버 데이터 → 행
  const rows: AdminContentItem[] = useMemo(
    () => (data ?? []).map(mapToRow),
    [data]
  );

  // 필터 + 검색
  const filteredData = useMemo(() => {
    return rows.filter((item) => {
      const matchesCategory =
        !categoryFilter || categoryFilter === item.category;
      const matchesStatus = !statusFilter || statusFilter === item.status; // 현재 status 칸에 "시간"을 넣음
      const q = search.trim().toLowerCase();
      const matchesSearch =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.category?.toLowerCase().includes(q);
      return matchesCategory && matchesStatus && matchesSearch;
    });
  }, [rows, categoryFilter, statusFilter, search]);

  // 페이지네이션
  const itemsPerPage = 20;
  const totalPages = Math.max(
    1,
    Math.ceil(filteredData.length / itemsPerPage)
  );
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  // ✅ 삭제 버튼 클릭 시 모달 오픈
  const openDeleteModal = (id: number) => {
    setDeleteTargetId(id);
    setDeleteModalOpen(true);
  };

  // ✅ 모달에서 실제 삭제 실행
  const confirmDelete = () => {
    if (deleteTargetId == null || isDeleting) return;

    deletePostMutate(deleteTargetId, {
      onSuccess: () => {
        // React Query가 알아서 리패치하도록 router.refresh() 정도만
        router.refresh();
        setDeleteModalOpen(false);
        setDeleteTargetId(null);
      },
      onError: (err) => {
        console.error(err);
        alert("삭제 중 오류가 발생했습니다.");
      },
    });
  };

  return (
    <main className="bg-white min-h-screen">
      <AdminHeader onMenuClick={() => setMenuOpen(!menuOpen)} />
      <AdminCategoryBar />
      <MobileMenu menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      <section className="px-4 sm:px-10 lg:px-[15%] py-[4%]">
        <div className="flex flex-col sm:flex-row gap-3 mb-4 justify-between ">
          <AdminSearchInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="flex flex-row gap-2">
            <CustomDropdown
              label="카테고리 선택"
              options={[
                "전체",
                "Beauty",
                "Food",
                "Fashion",
                "Lifestyle",
                "Tech",
              ]}
              onSelect={(v) => setCategoryFilter(v === "전체" ? null : v)}
              buttonClassName="rounded-lg"
              className="text-gray-500"
            />
            <CustomDropdown
              label="상태"
              options={[
                "전체",
                "검토 대기",
                "작성 중",
                "피드백 반영 중",
                "작성 완료",
              ]}
              onSelect={(v) => setStatusFilter(v === "전체" ? null : v)}
              buttonClassName="rounded-lg"
              className="text-gray-500"
            />
          </div>
        </div>

        {/* 로딩/에러 */}
        {isLoading && (
          <p className="text-sm text-gray-500 px-2">불러오는 중…</p>
        )}
        {isError && (
          <p className="text-sm text-red-500 px-2">
            임시 저장본을 불러오지 못했습니다.
          </p>
        )}

        {/* 데이터 없을 때 */}
        {!isLoading && !isError && filteredData.length === 0 && (
          <div className="text-center text-gray-500 mt-10">
            게시물이 없습니다.
          </div>
        )}

        {/* 데이터 있을 때만 테이블과 페이지네이션 */}
        {!isLoading && !isError && filteredData.length > 0 && (
          <>
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
              data={currentData.map((item) => ({
                ...item,
                onDelete: () => openDeleteModal(item.id), // ← 여기서 모달 오픈
                onClickRow: () =>
                  router.push(`/admin/contentsUpload/${item.id}`),
              }))}
              columns={[
                "id",
                "image",
                "title",
                "category",
                "date",
                "status", // "저장 시간"이 들어감
                "actions",
              ]}
              showHeader
              columnLabels={[
                "번호",
                "",
                "콘텐츠",
                "카테고리",
                "저장 날짜",
                "저장 시간",
                "",
              ]}
            />

            <div className="flex justify-center mt-6">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          </>
        )}
      </section>

      {/* ✅ 삭제 모달 */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
      />
    </main>
  );
};

export default TempListPage;
