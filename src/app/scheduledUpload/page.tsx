"use client";

import React, { useState } from "react";
import Image from "next/image";
import { FiEdit2, FiTrash2, FiShare2 } from "react-icons/fi";
import AdminHeader from "@/components/adminHeader";
import AdminCategoryBar from "@/components/adminCategoryBar";
import Pagination from "@/components/pagination";
import CustomDropdown from "@/components/customDropdown";
import AdminSearchInput from "@/components/adminSearchInput";

// 인터페이스에 time 속성 추가
interface ContentItem {
  id: number;
  title: string;
  category: string;
  type: string;
  date: string;
  time: string; // ⬅️ 추가
  visibility: "공개" | "비공개";
  image: string;
}

const sampleData: ContentItem[] = [
  {
    id: 24,
    title: "뭐라고? 쿠션이 40가지나 된다고?!",
    category: "Beauty",
    type: "마케팅 트렌드",
    date: "2025/05/10",
    time: "11:30", // ⬅️ 추가
    visibility: "공개",
    image: "/images/sample1.png",
  },
  {
    id: 23,
    title: "뭐라고? 쿠션이 40가지나 된다고?!",
    category: "Beauty",
    type: "브랜드 사례",
    date: "2025/05/10",
    time: "13:30", // ⬅️ 추가
    visibility: "공개",
    image: "/images/sample1.png",
  },
  {
    id: 22,
    title: "뭐라고? 쿠션이 40가지나 된다고?!",
    category: "Food",
    type: "마케팅 트렌드",
    date: "2025/05/10",
    time: "20:30", // ⬅️ 추가
    visibility: "공개",
    image: "/images/sample1.png",
  },
  {
    id: 21,
    title: "건강한 아침 식사 아이디어:에너지 충전을 위한 메뉴",
    category: "Fashion",
    type: "마케팅 트렌드",
    date: "2025/05/10",
    time: "12:30", // ⬅️ 추가
    visibility: "공개",
    image: "/images/sample2.png",
  },
  {
    id: 20,
    title: "건강한 라이프스타일을 위한 스트레스 관리 방법",
    category: "Beauty",
    type: "브랜드 사례",
    date: "2025/05/10",
    time: "14:30", // ⬅️ 추가
    visibility: "공개",
    image: "/images/sample3.png",
  },
  {
    id: 19,
    title: "창의성을 끌어올리는 방법:아이디어 발생 기술",
    category: "Tech",
    type: "마케팅 트렌드",
    date: "2025/05/10",
    time: "18:20", // ⬅️ 추가
    visibility: "공개",
    image: "/images/sample4.png",
  },
  {
    id: 18,
    title: "자연 속에서 힐링하는 베스트 트레킹 여행지 5선",
    category: "Beauty",
    type: "마케팅 트렌드",
    date: "2025/05/10",
    time: "19:30", // ⬅️ 추가
    visibility: "공개",
    image: "/images/sample5.png",
  },
  {
    id: 17,
    title: "자기 계발의 시작:5가지 효과적인 습관",
    category: "Lifestyle",
    type: "마케팅 트렌드",
    date: "2025/05/10",
    time: "18:30", // ⬅️ 추가
    visibility: "비공개",
    image: "/images/sample6.png",
  },
];

const ScheduledUploadPage = () => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  return (
    <main className="bg-white min-h-screen">
      <AdminHeader />
      <AdminCategoryBar />

      <section className="px-[10%] sm:px-[15%] py-[2%]">
        {/* 필터 & 검색 */}
        <div className="flex flex-wrap gap-3 mb-4 justify-between ">
          {/* 검색창 */}
          <AdminSearchInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="flex flex-row w-4/10 gap-2">
            <CustomDropdown
              label="카테고리 선택"
              options={["Beauty", "Food", "Fashion", "Lifestyle", "Tech"]}
              onSelect={() => {}}
              buttonClassName="rounded-lg"
              className="text-gray-500"
            />
            <CustomDropdown
              label="유형 선택"
              options={[
                "트렌드 리포트",
                "SNS 캠페인 사례",
                "광고 분석",
                "브랜드 전략",
              ]}
              onSelect={() => {}}
              buttonClassName="rounded-lg"
              className="text-gray-500"
            />
          </div>
        </div>

        <div className="flex py-3 px-3 justify-between">
          <div className="flex items-center gap-4 ">
            <input
              type="checkbox"
              className="w-4 h-4 accent-gray-800"
              checked={selectedItems.length === sampleData.length}
              onChange={(e) => {
                if (e.target.checked) {
                  setSelectedItems(sampleData.map((item) => item.id));
                } else {
                  setSelectedItems([]);
                }
              }}
            />
            <button
              disabled={selectedItems.length === 0}
              className={`text-sm ${
                selectedItems.length > 0
                  ? "text-black font-semibold cursor-pointer"
                  : "text-gray-500"
              }`}
            >
              전체 업로드
            </button>
            <button
              disabled={selectedItems.length === 0}
              className={` text-sm ${
                selectedItems.length > 0
                  ? "text-black font-semibold cursor-pointer"
                  : "text-gray-500"
              }`}
            >
              전체 삭제
            </button>
            {selectedItems.length > 0 && (
              <span className="text-sm text-red-500">
                {selectedItems.length}개 선택
              </span>
            )}
          </div>

          <div className="w-[14%]">
            <CustomDropdown
              label="업로드 예정 순"
              options={["업로드 예정 순"]}
              onSelect={() => {}}
              buttonClassName="border-0"
              className="text-gray-500"
            />
          </div>
        </div>
        {/* 테이블 */}
        <div className="border-t-2 border-gray-500 py-3">
          {sampleData.map((item) => (
            <div
              key={item.id}
              className="grid grid-cols-[30px_50px_3fr_0.5fr_0.5fr_0.7fr_0.7fr_50px_80px] gap-x-6 py-3 items-center text-sm text-gray-700"
            >
              {/* 체크박스 */}
              <div className="flex justify-center w-10 h-10 content-center items-center place-items-center justify-items-center">
                <input
                  type="checkbox"
                  className="w-3.5 h-3.5 accent-gray-800 "
                  checked={selectedItems.includes(item.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedItems([...selectedItems, item.id]);
                    } else {
                      setSelectedItems(
                        selectedItems.filter((id) => id !== item.id)
                      );
                    }
                  }}
                />{" "}
              </div>

              <div>
                <Image
                  src={"/icons/rectangle-gray.png"}
                  alt="썸네일"
                  width={40}
                  height={40}
                  className="rounded"
                />
              </div>

              {/* 타이틀 */}
              <div className="truncate font-semibold">{item.title}</div>

              {/* 담당자 */}
              <div className="text-sm text-gray-600">admin12</div>

              <div>{item.category}</div>
              <div>{item.type}</div>
              <div>{item.date}</div>

              {/* 시간 */}
              <div className="text-sm">{item.time}</div>

              {/* 아이콘 */}
              <div className="flex items-center gap-3">
                <FiEdit2 className="cursor-pointer w-4 h-4" />
                <FiTrash2 className="cursor-pointer w-4 h-4" />
                <FiShare2 className="cursor-pointer w-4 h-4 text-gray-500" />
              </div>
            </div>
          ))}
        </div>

        {/* 페이지네이션 */}
        <div className="flex justify-center mt-6">
          <Pagination
            currentPage={currentPage}
            totalPages={3}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      </section>
    </main>
  );
};

export default ScheduledUploadPage;
