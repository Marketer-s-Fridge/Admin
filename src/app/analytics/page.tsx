"use client";

import React, { useState } from "react";
import AdminHeader from "@/components/adminHeader";
import AdminCategoryBar from "@/components/adminCategoryBar";
import Pagination from "@/components/pagination";
import CustomDropdown from "@/components/customDropdown";
import AdminSearchInput from "@/components/adminSearchInput";
import MobileMenu from "@/components/mobileMenu";
import AdminContentTable, {
  AdminContentItem,
} from "@/components/adminContentTable";
import DateRangePickerModal from "@/components/dateRangePickerModal";
import Image from "next/image";
import CustomDropdown2A11Y from "@/components/customDropdown2";

interface AnalyticsItem extends AdminContentItem {
  views: number;
  clicks: number;
  engagementRate: string; // format: "12.6%"
}

const sampleData: AnalyticsItem[] = Array.from({ length: 8 }, (_, i) => ({
  id: 15 - i,
  title: "뭐라고? 쿠션이 40가지나 된다고?!",
  date: "2025/05/10",
  image: "/images/Category-1.jpg",
  views: 4234 + i * 100,
  clicks: 245 + i * 10,
  engagementRate: `${(12.6 + i * 0.5).toFixed(1)}%`,
}));

const AnalyticsPage = () => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showCalendar, setShowCalendar] = useState(false);
  const [sortOption, setSortOption] = useState<string>("전체");
  const [menuOpen, setMenuOpen] = useState(false);

  const filteredData = sampleData
    .filter((item) => {
      const keyword = search.toLowerCase();
      return item.title.toLowerCase().includes(keyword);
    })
    .sort((a, b) => {
      switch (sortOption) {
        case "조회수 높은 순":
          return b.views - a.views;
        case "클릭수 높은 순":
          return b.clicks - a.clicks;
        case "반응수 높은 순":
          return parseFloat(b.engagementRate) - parseFloat(a.engagementRate);
        default:
          return b.id - a.id; // 최신순
      }
    });

  return (
    <main className="bg-white min-h-screen">
      <AdminHeader onMenuClick={() => setMenuOpen(!menuOpen)} />
      <AdminCategoryBar />
      {/* 오버레이 메뉴 (모바일용) */}
      <MobileMenu menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      <section className="px-4 sm:px-10 lg:px-[15%] py-[3%]">
        <div className="flex flex-row gap-3 justify-between pb-[1.5%]">
          <AdminSearchInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="flex flex-row flex-1 justify-between">
            <div className="relative flex">
              <button
                onClick={() => setShowCalendar(true)}
                className="cursor-pointer border-gray-300 border-1 rounded-lg w-30 text-gray-500 text-[12px] lg:text-sm text-justify px-2.5"
              >
                기간 선택
              </button>
              <Image
                alt="달력"
                width={30}
                height={20}
                src="/icons/calendar1.png"
                className="absolute w-5 h-5 right-2.5 top-2"
              />
            </div>

            <div className=" pl-2">
              <CustomDropdown2A11Y
                label="클릭수 높은 순"
                options={["클릭수 높은 순", "반응수 높은 순", "조회수 높은 순"]}
                onSelect={(value) => setSortOption(value)}
                buttonClassName="border-0"
                className="text-gray-500 place-self-end"
              />
            </div>
          </div>
        </div>

        <AdminContentTable
          data={filteredData}
          columns={[
            "id",
            "image",
            "title",
            "date",
            "views",
            "clicks",
            "engagementRate",
          ]}
          columnLabels={[
            "번호",
            "",
            "콘텐츠",
            "업로드 날짜",
            "조회수",
            "클릭수",
            "반응률",
          ]}
          showHeader={true}
        />

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
