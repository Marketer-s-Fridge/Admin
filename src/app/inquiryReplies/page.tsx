"use client";

import React, { useState } from "react";
import AdminHeader from "@/components/adminHeader";
import AdminCategoryBar from "@/components/adminCategoryBar";
import Pagination from "@/components/pagination";
import CustomDropdown from "@/components/customDropdown";
import { FiPaperclip } from "react-icons/fi";
import Link from "next/link";

interface InquiryItem {
  id: number;
  name: string;
  email: string;
  type: string;
  date: string;
  status: "답변 완료" | "답변 임시저장" | "미답변" | "삭제 변경";
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
  },
  {
    id: 6,
    name: "luckyseven",
    email: "ahn123@gmail.com",
    type: "기술적 문제",
    date: "2025/05/10",
    status: "답변 임시저장",
    responder: "Admin12",
  },
  {
    id: 5,
    name: "saraminjoa",
    email: "park987@naver.com",
    type: "기술적 문제",
    date: "2025/05/10",
    status: "미답변",
    responder: "Admin12",
  },
  {
    id: 4,
    name: "vividsun44",
    email: "jung456@gmail.com",
    type: "기술적 문제",
    date: "2025/05/10",
    status: "삭제 변경",
    responder: "Admin12",
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
  },
  {
    id: 1,
    name: "winterstorm",
    email: "baek789@naver.com",
    type: "기술적 문제",
    date: "2025/05/10",
    status: "삭제 변경",
    responder: "Admin12",
  },
];


const InquiryRepliesPage = () => {
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

  // ✅ 필터 및 정렬 적용
  const filteredData = sampleData
  .filter((item) => {
    const statusMatch =
      !statusFilter || statusFilter === "전체" || item.status === statusFilter;
    const typeMatch =
      !typeFilter || typeFilter === "전체" || item.type === typeFilter;
    return statusMatch && typeMatch;
  })
  .sort((a, b) => {
    if (sortOrder === "최신순") {
      return b.id - a.id;
    } else {
      return a.id - b.id;
    }
  });

  return (
    <main className="bg-white min-h-screen">
      <AdminHeader />
      <AdminCategoryBar />

      <section className="px-[10%] sm:px-[15%] py-[3%]">
        {/* 필터 & 검색 */}
        <div className="flex flex-row gap-3 justify-between pb-[1.5%]">
          <div className="flex flex-row w-4/11 gap-2">
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

        {/* 테이블 헤더 */}
        <div className="grid grid-cols-[1fr_2.2fr_3.5fr_2fr_2fr_2fr_2fr] py-2 border-y-[2px] border-gray-500 font-bold text-sm text-gray-800">
          <div className="text-center">문의번호</div>
          <div className="text-center">문의자</div>
          <div className="text-center">이메일</div>
          <div className="text-center">문의 유형</div>
          <div className="text-center">문의 날짜</div>
          <div className="text-center">처리 상태</div>
          <div className="text-center">답변자</div>
        </div>

        {/* 필터된 데이터 표시 */}
        {filteredData.length > 0 ? (
          filteredData.map((item) => (
            <Link key={item.id} href={`/inquiryReplies/detail`} passHref>
              <div className="grid grid-cols-[1fr_2.5fr_3.2fr_2fr_2fr_2fr_2fr] py-3 items-center text-sm text-gray-700 hover:bg-gray-50 cursor-pointer">
                <div className="flex justify-center items-center font-semibold">
                  {item.id}
                </div>
                <div className="flex justify-start items-center gap-1 mx-9">
                  {item.hasAttachment && (
                    <FiPaperclip className="text-gray-400 w-4 h-4" />
                  )}
                  {item.name}
                </div>
                <div className="flex justify-start items-center pl-12">
                  {item.email}
                </div>
                <div className="flex justify-center items-center">
                  {item.type}
                </div>
                <div className="flex justify-center items-center">
                  {item.date}
                </div>
                <div
                  className={`flex justify-start items-center font-semibold pl-10 ${
                    item.status === "답변 완료"
                      ? "text-green-600"
                      : item.status === "답변 임시저장"
                      ? "text-orange-400"
                      : item.status === "미답변"
                      ? "text-blue-500"
                      : "text-gray-500"
                  }`}
                >
                  {item.status}
                </div>
                <div className="flex justify-center items-center">
                  {item.responder}
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="text-center py-6 text-gray-400 text-sm">
            조건에 맞는 문의가 없습니다.
          </div>
        )}

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
