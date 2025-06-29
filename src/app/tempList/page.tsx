"use client";

import React, { useState } from "react";
import Image from "next/image";
import { FiEdit2, FiTrash2, FiShare2 } from "react-icons/fi";
import AdminHeader from "@/components/adminHeader";
import AdminCategoryBar from "@/components/adminCategoryBar";
import Pagination from "@/components/pagination";
import CustomDropdown from "@/components/customDropdown";
import AdminSearchInput from "@/components/adminSearchInput";

interface ContentItem {
  id: number;
  title: string;
  category: string;
  type: string;
  date: string;
  status: string;
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
    status: "작성 중",
    visibility: "공개",
    image: "/images/sample1.png",
  },
  {
    id: 23,
    title: "뭐라고? 쿠션이 40가지나 된다고?!",
    category: "Beauty",
    type: "브랜드 사례",
    date: "2025/05/10",
    status: "작성 중",
    visibility: "공개",
    image: "/images/sample1.png",
  },
  {
    id: 22,
    title: "뭐라고? 쿠션이 40가지나 된다고?!",
    category: "Food",
    type: "마케팅 트렌드",
    date: "2025/05/10",
    status: "작성 중",
    visibility: "공개",
    image: "/images/sample1.png",
  },
  {
    id: 21,
    title: "건강한 아침 식사 아이디어:에너지 충전을 위한 메뉴",
    category: "Fashion",
    type: "마케팅 트렌드",
    date: "2025/05/10",
    status: "작성 중",
    visibility: "공개",
    image: "/images/sample2.png",
  },
  {
    id: 20,
    title: "건강한 라이프스타일을 위한 스트레스 관리 방법",
    category: "Beauty",
    type: "브랜드 사례",
    date: "2025/05/10",
    status: "검토 대기",
    visibility: "공개",
    image: "/images/sample3.png",
  },
  {
    id: 19,
    title: "창의성을 끌어올리는 방법:아이디어 발생 기술",
    category: "Tech",
    type: "마케팅 트렌드",
    date: "2025/05/10",
    status: "작성 완료",
    visibility: "공개",
    image: "/images/sample4.png",
  },
  {
    id: 18,
    title: "자연 속에서 힐링하는 베스트 트레킹 여행지 5선",
    category: "Beauty",
    type: "마케팅 트렌드",
    date: "2025/05/10",
    status: "피드백 반영 중",
    visibility: "공개",
    image: "/images/sample5.png",
  },
  {
    id: 17,
    title: "자기 계발의 시작:5가지 효과적인 습관",
    category: "Lifestyle",
    type: "마케팅 트렌드",
    date: "2025/05/10",
    status: "작성 완료",
    visibility: "비공개",
    image: "/images/sample6.png",
  },
];

const TempListPage = () => {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  // 🔍 필터된 데이터 계산
  const filteredData = sampleData.filter((item) => {
    const matchesCategory = !categoryFilter || categoryFilter === item.category;
    const matchesType = !typeFilter || typeFilter === item.type;
    const matchesStatus = !statusFilter || statusFilter === item.status;
    const matchesSearch =
      !search || item.title.toLowerCase().includes(search.toLowerCase());

    return matchesCategory && matchesType && matchesStatus && matchesSearch;
  });

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

          <div className="flex flex-row w-5/10 gap-2">
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
              onSelect={(value) => {
                setCategoryFilter(value === "전체" ? null : value);
              }}
              buttonClassName="rounded-lg"
              className="text-gray-500"
            />

            <CustomDropdown
              label="유형 선택"
              options={[
                "전체",
                "트렌드 리포트",
                "SNS 캠페인 사례",
                "광고 분석",
                "브랜드 전략",
              ]}
              onSelect={(value) =>
                setTypeFilter(value === "전체" ? null : value)
              }
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
              onSelect={(value) =>
                setStatusFilter(value === "전체" ? null : value)
              }
              buttonClassName="rounded-lg"
              className="text-gray-500"
            />
          </div>
        </div>

        {/* 테이블 */}
        <div className="flex py-3 px-3 justify-between">
          <div className=" flex flex-row gap-2 items-center">
            <p className=" font-semibold">임시 저장본</p>
            <p className="text-xs">15</p>
          </div>
          <div className="w-[13%]">
            <CustomDropdown
              label="최신 저장 순"
              options={["최신 저장 순", "오래된 순"]}
              onSelect={() => {}}
              buttonClassName="border-0"
              className="text-gray-500"
            />
          </div>
        </div>
        <div className="border-t-2 border-gray-500 py-3">
          {/* 리스트 렌더링 */}
          {filteredData.length > 0 ? (
            filteredData.map((item) => (
              <div
                key={item.id}
                className="grid grid-cols-[40px_50px_3fr_0.5fr_0.5fr_0.7fr_0.7fr_70px_80px] gap-x-6 py-3 items-center text-sm text-gray-700"
              >
                <div className="text-center font-semibold">{item.id}</div>
                <div>
                  <Image
                    src="/images/Category-1.jpg"
                    alt="썸네일"
                    width={40}
                    height={40}
                    className="w-10 aspect-[3/4] rounded"
                  />
                </div>
                <div className="truncate font-semibold">{item.title}</div>
                <div className="text-sm text-gray-600">admin12</div>
                <div>{item.category}</div>
                <div>{item.type}</div>
                <div>{item.date}</div>
                <div
                  className={`text-xs font-semibold ${
                    item.status === "작성 중"
                      ? "text-yellow-500"
                      : item.status === "검토 대기"
                      ? "text-blue-500"
                      : item.status === "피드백 반영 중"
                      ? "text-black"
                      : item.status === "작성 완료"
                      ? "text-green-600"
                      : ""
                  }`}
                >
                  {item.status}
                </div>
                <div className="flex items-center gap-3">
                  <FiEdit2 className="cursor-pointer w-4 h-4" />
                  <FiTrash2 className="cursor-pointer w-4 h-4" />
                  <FiShare2 className="cursor-pointer w-4 h-4 text-gray-500" />
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-gray-400 text-sm">
              조건에 맞는 콘텐츠가 없습니다.
            </div>
          )}
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

export default TempListPage;
