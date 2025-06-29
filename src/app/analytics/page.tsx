"use client";

import React, { useState } from "react";
import AdminHeader from "@/components/adminHeader";
import AdminCategoryBar from "@/components/adminCategoryBar";
import Pagination from "@/components/pagination";
import CustomDropdown from "@/components/customDropdown";
import AdminSearchInput from "@/components/adminSearchInput";
import Image from "next/image";
import DateRangePickerModal from "@/components/dateRangePickerModal";

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
        <div className="grid grid-cols-[0.7fr_4fr_2fr_2fr_2fr_2fr] py-2 border-y-[2px] border-gray-500 font-bold text-sm text-gray-800">
          <div className="text-center">번호</div>
          <div className="text-center">콘텐츠</div>
          <div className="text-center">업로드 날짜</div>
          <div className="text-center">조회수</div>
          <div className="text-center">클릭수</div>
          <div className="text-center">반응률</div>
        </div>

        {/* 테이블 데이터 */}
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="grid grid-cols-[0.7fr_4fr_2fr_2fr_2fr_2fr] py-4 items-center text-sm text-gray-700"
          >
            <div className="flex justify-center font-semibold">{15}</div>
            <div className="flex items-center gap-4">
              <img
                src="/images/Category-1.jpg"
                alt="콘텐츠 썸네일"
                className="w-10 aspect-[3/4] rounded object-cover"
              />
              <span className="font-semibold">
                뭐라고? 쿠션이 40가지나 된다고?!
              </span>
            </div>
            <div className="text-center">2025/05/10</div>
            <div className="text-center">4,234</div>
            <div className="text-center">245</div>
            <div className="text-center">12.6%</div>
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
