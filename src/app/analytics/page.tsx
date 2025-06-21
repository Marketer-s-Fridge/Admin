"use client";

import React, { useState } from "react";
import AdminHeader from "@/components/adminHeader";
import AdminCategoryBar from "@/components/adminCategoryBar";
import Pagination from "@/components/pagination";
import CustomDropdown from "@/components/customDropdown";
import { FiPaperclip } from "react-icons/fi";
import AdminSearchInput from "@/components/adminSearchInput";
import Image from "next/image";
import DateRangePickerModal from "@/components/dateRangePickerModal";

interface InquiryItem {
  id: number;
  name: string;
  email: string;
  type: string;
  date: string;
  status: "답변 완료" | "답변 임시저장" | "접수됨" | "스팸/무효";
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
    status: "접수됨",
    responder: "Admin12",
  },
  {
    id: 4,
    name: "vividsun44",
    email: "jung456@gmail.com",
    type: "기술적 문제",
    date: "2025/05/10",
    status: "스팸/무효",
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
    status: "스팸/무효",
    responder: "Admin12",
  },
];

const AnalyticsPage = () => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showCalendar, setShowCalendar] = useState(false);

  return (
    <main className="bg-white min-h-screen">
      <AdminHeader />
      <AdminCategoryBar />

      <section className="px-[10%] sm:px-[15%] py-[3%]">
        {/* 필터 & 검색 */}
        <div className="flex flex-row gap-3 justify-between pb-[1.5%]">
          {/* 검색창 */}
          <AdminSearchInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="flex flex-row flex-1 justify-between">
            <div className="relative flex">
              <button
                onClick={() => setShowCalendar(true)}
                className="cursor-pointer border-gray-300 border-1 rounded-lg w-30 text-gray-500 text-sm text-justify px-2.5"
              >
                기간 선택
              </button>
              <Image
                alt="달력"
                width={30}
                height={20}
                src="/icons/calendar1.png"
                className="absolute w-5 h-5 right-2.5 top-2"
              ></Image>
            </div>
            <div className="flex flex-[0.3]">
              <CustomDropdown
                label="전체"
                options={["클릭수 높은 순", "반응수 높은 순", "조회수 높은 순"]}
                onSelect={() => {}}
                buttonClassName="border-0"
                className=" text-gray-500 "
              />
            </div>
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

        {/* 테이블 데이터 */}
        {sampleData.map((item) => (
          <div
            key={item.id}
            className="grid grid-cols-[1fr_2.5fr_3.2fr_2fr_2fr_2fr_2fr] py-3 items-center text-sm text-gray-700 "
          >
            <div className="flex justify-center items-center font-semibold ">
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
            <div className="flex justify-center items-center ">{item.type}</div>
            <div className="flex justify-center items-center">{item.date}</div>

            <div
              className={`flex justify-start items-center font-semibold pl-10 ${
                item.status === "답변 완료"
                  ? "text-green-600"
                  : item.status === "답변 임시저장"
                  ? "text-orange-400"
                  : item.status === "접수됨"
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
        ))}

        {/* 페이지네이션 */}
        <div className="flex justify-center mt-6">
          <Pagination
            currentPage={currentPage}
            totalPages={1}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      </section>
      <DateRangePickerModal
        visible={showCalendar}
        onClose={() => setShowCalendar(false)}
      />
    </main>
  );
};

export default AnalyticsPage;
