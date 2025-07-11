"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

import AdminHeader from "@/components/adminHeader";
import AdminCategoryBar from "@/components/adminCategoryBar";
import Pagination from "@/components/pagination";
import CustomDropdown from "@/components/customDropdown";
import AdminContentTable, {
  AdminContentItem,
} from "@/components/adminContentTable";

interface InquiryItem extends AdminContentItem {
  name: string;
  email: string;
  type: string;
  responder: string;
  hasAttachment?: boolean;
}

const sampleData: InquiryItem[] = [
  {
    id: 7,
    name: "Sohn678",
    email: "sohn678@gmail.com",
    type: "기술적 문제",
    date: "2025/05/10",
    status: "답변 완료",
    responder: "Admin12",
    hasAttachment: true,
    title: "Sohn678",
    image: "",
  },
  {
    id: 6,
    name: "luckyseven",
    email: "ahn123@gmail.com",
    type: "기술적 문제",
    date: "2025/05/10",
    status: "답변 임시저장",
    responder: "Admin12",
    title: "luckyseven",
    image: "",
  },
  {
    id: 5,
    name: "saraminjoa",
    email: "park987@naver.com",
    type: "기술적 문제",
    date: "2025/05/10",
    status: "미답변",
    responder: "Admin12",
    title: "saraminjoa",
    image: "",
  },
  {
    id: 4,
    name: "vividsun44",
    email: "jung456@gmail.com",
    type: "기술적 문제",
    date: "2025/05/10",
    status: "삭제 변경",
    responder: "Admin12",
    title: "vividsun44",
    image: "",
  },
  {
    id: 3,
    name: "springbloom57",
    email: "lee@gmail.com",
    type: "기술적 문제",
    date: "2025/05/10",
    status: "답변 완료",
    responder: "Admin12",
    hasAttachment: true,
    title: "springbloom57",
    image: "",
  },
  {
    id: 2,
    name: "banjjak",
    email: "kim012@kakao.com",
    type: "기술적 문제",
    date: "2025/05/10",
    status: "답변 임시저장",
    responder: "Admin12",
    hasAttachment: true,
    title: "banjjak",
    image: "",
  },
  {
    id: 1,
    name: "winterstorm",
    email: "baek789@naver.com",
    type: "기술적 문제",
    date: "2025/05/10",
    status: "삭제 변경",
    responder: "Admin12",
    title: "winterstorm",
    image: "",
  },
];

const InquiryRepliesPage = () => {
  const router = useRouter();

  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"최신순" | "오래된 순">("최신순");

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
  };

  const handleTypeFilterChange = (value: string) => {
    setTypeFilter(value);
  };

  const handleSortOrderChange = (value: "최신순" | "오래된 순") => {
    setSortOrder(value);
  };

  const filteredData = sampleData
    .filter((item) => {
      const statusMatch =
        !statusFilter ||
        statusFilter === "전체" ||
        item.status === statusFilter;
      const typeMatch =
        !typeFilter || typeFilter === "전체" || item.type === typeFilter;
      return statusMatch && typeMatch;
    })
    .sort((a, b) => (sortOrder === "최신순" ? b.id - a.id : a.id - b.id));

  return (
    <main className="bg-white min-h-screen">
      <AdminHeader />
      <AdminCategoryBar />

      <section className="px-4 sm:px-10 lg:px-[15%] py-[3%]">
        {/* 필터 */}
        <div className="flex flex-row gap-3 justify-between pb-[1.5%]">
          <div className="flex flex-row w-3/10 gap-2">
            <CustomDropdown
              label="답변 처리 상태"
              options={[
                "전체",
                "답변 완료",
                "답변 임시저장",
                "미답변",
                "삭제 변경",
              ]}
              onSelect={handleStatusFilterChange}
              buttonClassName="rounded-lg"
              className="text-gray-500"
            />
            <CustomDropdown
              label="문의 유형"
              options={[
                "전체",
                "기술적 문제",
                "버그/오류 제보",
                "피드백 및 제안",
                "기타 문의",
              ]}
              onSelect={handleTypeFilterChange}
              buttonClassName="rounded-lg"
              className="text-gray-500"
            />
          </div>
          <div className="flex">
            <CustomDropdown
              label="최신순"
              options={["최신순", "오래된 순"]}
              onSelect={(value: string) =>
                handleSortOrderChange(value as "최신순" | "오래된 순")
              }
              buttonClassName="border-0"
              className="text-gray-500 place-self-end"
            />
          </div>
        </div>

        {/* 공통 테이블 적용 */}
        <AdminContentTable
          data={filteredData.map((item) => ({
            ...item,
            onClickRow: () => router.push("/inquiryReplies/detail"),
          }))}
          columns={[
            "id",
            "name",
            "email",
            "type",
            "date",
            "status",
            "responder",
          ]}
          columnWidths={["1fr", "2.2fr", "3.5fr", "2fr", "2fr", "2fr", "2fr"]}
          showHeader={true}
          columnLabels={[
            "문의번호",
            "문의자",
            "이메일",
            "문의 유형",
            "문의 날짜",
            "처리 상태",
            "답변자",
          ]}
        />

        {/* 페이지네이션 */}
        <div className="flex justify-center mt-6">
          <Pagination
            currentPage={currentPage}
            totalPages={1}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      </section>
    </main>
  );
};

export default InquiryRepliesPage;
