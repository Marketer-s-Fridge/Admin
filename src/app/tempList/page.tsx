"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import AdminHeader from "@/components/adminHeader";
import AdminCategoryBar from "@/components/adminCategoryBar";
import Pagination from "@/components/pagination";
import CustomDropdown from "@/components/customDropdown";
import AdminSearchInput from "@/components/adminSearchInput";
import AdminContentTable, {
  AdminContentItem,
} from "@/components/adminContentTable";

const sampleData: AdminContentItem[] = [
  {
    id: 24,
    title: "뭐라고? 쿠션이 40가지나 된다고?!",
    category: "Beauty",
    date: "2025/05/10",
    status: "작성 중",
    visibility: "공개",
    image: "/images/sample1.png",
    author: "admin12",
  },
  {
    id: 23,
    title: "뭐라고? 쿠션이 40가지나 된다고?!",
    category: "Beauty",
    date: "2025/05/10",
    status: "작성 중",
    visibility: "공개",
    image: "/images/sample1.png",
    author: "admin12",
  },
  {
    id: 22,
    title: "뭐라고? 쿠션이 40가지나 된다고?!",
    category: "Food",
    date: "2025/05/10",
    status: "작성 중",
    visibility: "공개",
    image: "/images/sample1.png",
    author: "admin12",
  },
  {
    id: 21,
    title: "건강한 아침 식사 아이디어:에너지 충전을 위한 메뉴",
    category: "Fashion",
    date: "2025/05/10",
    status: "작성 중",
    visibility: "공개",
    image: "/images/sample2.png",
    author: "admin12",
  },
  {
    id: 20,
    title: "건강한 라이프스타일을 위한 스트레스 관리 방법",
    category: "Beauty",
    date: "2025/05/10",
    status: "검토 대기",
    visibility: "공개",
    image: "/images/sample3.png",
    author: "admin12",
  },
  {
    id: 19,
    title: "창의성을 끌어올리는 방법:아이디어 발생 기술",
    category: "Tech",
    date: "2025/05/10",
    status: "작성 완료",
    visibility: "공개",
    image: "/images/sample4.png",
    author: "admin12",
  },
  {
    id: 18,
    title: "자연 속에서 힐링하는 베스트 트레킹 여행지 5선",
    category: "Beauty",
    date: "2025/05/10",
    status: "피드백 반영 중",
    visibility: "공개",
    image: "/images/sample5.png",
    author: "admin12",
  },
  {
    id: 17,
    title: "자기 계발의 시작:5가지 효과적인 습관",
    category: "Lifestyle",
    date: "2025/05/10",
    status: "작성 완료",
    visibility: "비공개",
    image: "/images/sample6.png",
    author: "admin12",
  },
];

const TempListPage = () => {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const router = useRouter();

  const filteredData = sampleData.filter((item) => {
    const matchesCategory = !categoryFilter || categoryFilter === item.category;
    const matchesStatus = !statusFilter || statusFilter === item.status;
    const matchesSearch =
      !search || item.title.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesStatus && matchesSearch;
  });

  const enhancedData = filteredData.map((item) => ({
    ...item,
    onEdit: () => console.log(`Edit ${item.id}`),
    onDelete: () => console.log(`Delete ${item.id}`),
    onShare: () => console.log(`Share ${item.id}`), // ✅ 공유버튼이 보이게 함
  }));

  return (
    <main className="bg-white min-h-screen">
      <AdminHeader />
      <AdminCategoryBar />

      <section className="px-4 sm:px-10 lg:px-[15%] py-[2%]">
        <div className="flex flex-wrap gap-3 mb-4 justify-between ">
          <AdminSearchInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="flex flex-row w-3/10 gap-2">
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

        <div className="flex py-3 px-3 justify-between">
          <div className="flex flex-row gap-2 items-center">
            <p className="font-semibold">임시 저장본</p>
            <p className="text-xs">{filteredData.length}</p>
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

        <AdminContentTable
          data={enhancedData.map((item) => ({
            ...item,
            onClickRow: () => router.push("/contentsUpload"),
          }))}
          columns={[
            "id",
            "image",
            "title",
            "author",
            "category",
            "date",
            "status",
            "actions",
          ]}
          columnWidths={[
            "40px",
            "50px",
            "3fr",
            "0.5fr",
            "0.5fr",
            "0.7fr",
            "70px",
            "80px",
          ]}
        />

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
