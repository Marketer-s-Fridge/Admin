"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import AdminHeader from "@/components/adminHeader";
import AdminCategoryBar from "@/components/adminCategoryBar";
import Pagination from "@/components/pagination";
import CustomDropdown from "@/components/customDropdown";
import MobileMenu from "@/components/mobileMenu";
import AdminContentTable from "@/components/adminContentTable";
import CustomDropdown2 from "@/components/customDropdown2";
import { useEnquiries } from "@/features/enquiries/hooks/useEnquiries";
import { EnquiryResponseDto } from "@/features/enquiries/types";

type SortLabel = "최신순" | "오래된 순";
const PAGE_SIZE = 20;

// ✅ 상태 코드 → 한글 라벨 매핑
const mapStatusToLabel = (status?: string): string => {
  switch (status) {
    case "REPORTED":
      return "접수됨";
    case "DRAFT":
      return "답변 임시 저장";
    case "PUBLISHED":
      return "답변 완료";
    case "JUNK":
      return "스팸/무효";
    default:
      return "-";
  }
};

export default function InquiryRepliesPage() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1); // 1-base
  const [statusFilter, setStatusFilter] = useState<string>("전체");
  const [categoryFilter, setCategoryFilter] = useState<string>("전체");
  const [sortOrder, setSortOrder] = useState<SortLabel>("최신순");

  const { data, isLoading, isError } = useEnquiries();

  // 1) 전체 → 2) 필터 → 3) 정렬 → 4) 페이징
  const filteredSorted = useMemo(() => {
    const list: EnquiryResponseDto[] = data ?? [];

    const filtered = list.filter((it) => {
      const statusLabel = mapStatusToLabel(it.status);
      const sOk =
        statusFilter === "전체" || statusLabel === statusFilter;
      const cOk =
        categoryFilter === "전체" ||
        (it.category ?? "-") === categoryFilter;
      return sOk && cOk;
    });

    const sorted = filtered.sort((a, b) => {
      const aDate = (a.updatedAt || a.createdAt || "").toString();
      const bDate = (b.updatedAt || b.createdAt || "").toString();
      // 최신순 = 내림차순
      return sortOrder === "최신순"
        ? bDate.localeCompare(aDate)
        : aDate.localeCompare(bDate);
    });

    return sorted;
  }, [data, statusFilter, categoryFilter, sortOrder]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredSorted.length / PAGE_SIZE)
  );
  const pageSlice = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredSorted.slice(start, start + PAGE_SIZE);
  }, [filteredSorted, currentPage]);

  const rows = useMemo(
    () =>
      pageSlice.map((item) => ({
        id: item.id,
        title: item.title ?? "-",
        email: item.writerEmail ?? "-",
        category: item.category ?? "-",
        date: (item.updatedAt || item.createdAt || "").slice(0, 10),
        status: mapStatusToLabel(item.status), // ✅ 한글 라벨로 넣기
        image: "",
        onClickRow: () => router.push(`/admin/inquiryReplies/${item.id}`),
      })),
    [pageSlice, router]
  );

  const onChangeStatus = (v: string) => {
    setStatusFilter(v);
    setCurrentPage(1);
  };
  const onChangeCategory = (v: string) => {
    setCategoryFilter(v);
    setCurrentPage(1);
  };
  const onChangeSort = (v: string) => {
    setSortOrder(v as SortLabel);
    setCurrentPage(1);
  };

  return (
    <main className="bg-white min-h-screen">
      <AdminHeader onMenuClick={() => setMenuOpen(!menuOpen)} />
      <AdminCategoryBar />
      <MobileMenu menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      <section className="px-4 sm:px-10 lg:px-[15%] py-[4%]">
        {/* 필터 */}
        <div className="flex flex-col sm:flex-row gap-3 justify-between pb-[1.5%]">
          <div className="flex flex-row gap-2">
            <CustomDropdown
              label="처리 상태"
              options={[
                "전체",
                "접수됨",
                "답변 임시 저장",
                "답변 완료",
                "스팸/무효",
              ]}
              onSelect={onChangeStatus}
              buttonClassName="rounded-lg"
              className="text-gray-500"
            />
            <CustomDropdown
              label="카테고리"
              options={[
                "전체",
                "시스템 문제",
                "회원/계정 관련",
                "콘텐츠 관련",
                "제안/피드백",
                "광고/제휴 문의",
                "기타",
              ]}
              onSelect={onChangeCategory}
              buttonClassName="rounded-lg"
              className="text-gray-500"
            />
          </div>
          <div className="flex justify-end">
            <CustomDropdown2
              label={sortOrder}
              options={["최신순", "오래된 순"]}
              onSelect={onChangeSort}
              buttonClassName="border-0"
              className="text-gray-500 place-self-end"
            />
          </div>
        </div>

        {/* 테이블 */}
        <AdminContentTable
          data={rows}
          columns={[
            "id",
            "title",
            "email",
            "category",
            "date",
            "status",
          ]}
          showHeader
          columnLabels={[
            "번호",
            "제목",
            "이메일",
            "문의 유형",
            "작성일",
            "처리 상태",
          ]}
        />

        {/* 페이지네이션 */}
        <div className="flex justify-center mt-6">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(p) => setCurrentPage(p)}
          />
        </div>
      </section>
    </main>
  );
}
