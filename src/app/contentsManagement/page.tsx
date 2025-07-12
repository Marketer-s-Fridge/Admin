"use client";

import React, { useState } from "react";
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

const sampleData: AdminContentItem[] = [
  {
    id: 24,
    title: "뭐라고? 쿠션이 40가지나 된다고?!",
    category: "Beauty",
    date: "2025/05/10",
    status: "게시 완료",
    visibility: "공개",
    image: "/images/sample1.png",
  },
  {
    id: 23,
    title: "뭐라고? 쿠션이 40가지나 된다고?!",
    category: "Beauty",
    date: "2025/05/10",
    status: "게시 완료",
    visibility: "공개",
    image: "/images/sample1.png",
  },
  {
    id: 22,
    title: "뭐라고? 쿠션이 40가지나 된다고?!",
    category: "Food",
    date: "2025/05/10",
    status: "게시 완료",
    visibility: "공개",
    image: "/images/sample1.png",
  },
  {
    id: 21,
    title: "건강한 아침 식사 아이디어:에너지 충전을 위한 메뉴",
    category: "Fashion",
    date: "2025/05/10",
    status: "게시 완료",
    visibility: "공개",
    image: "/images/sample2.png",
  },
  {
    id: 20,
    title: "건강한 라이프스타일을 위한 스트레스 관리 방법",
    category: "Beauty",
    date: "2025/05/10",
    status: "임시저장",
    visibility: "공개",
    image: "/images/sample3.png",
  },
  {
    id: 19,
    title: "창의성을 끌어올리는 방법:아이디어 발생 기술",
    category: "Tech",
    date: "2025/05/10",
    status: "게시 완료",
    visibility: "공개",
    image: "/images/sample4.png",
  },
  {
    id: 18,
    title: "자연 속에서 힐링하는 베스트 트레킹 여행지 5선",
    category: "Beauty",
    date: "2025/05/10",
    status: "예약됨",
    visibility: "공개",
    image: "/images/sample5.png",
  },
  {
    id: 17,
    title: "자기 계발의 시작:5가지 효과적인 습관",
    category: "Lifestyle",
    date: "2025/05/10",
    status: "게시 완료",
    visibility: "비공개",
    image: "/images/sample6.png",
  },
];

const ContentManagementPage = () => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const filteredData = sampleData.filter((item) => {
    const matchCategory =
      !selectedCategory || item.category === selectedCategory;
    const matchStatus = !selectedStatus || item.status === selectedStatus;
    const matchSearch =
      !search ||
      item.title.includes(search) ||
      item.category?.includes(search) ||
      item.type?.includes(search);

    return matchCategory && matchStatus && matchSearch;
  });

  return (
    <main className="bg-white min-h-screen">
      <AdminHeader onMenuClick={() => setMenuOpen(!menuOpen)} />
      <AdminCategoryBar />
      {/* 오버레이 메뉴 (모바일용) */}
      <MobileMenu menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      <section className="px-4 sm:px-10 lg:px-[15%] py-[2%]">
        {/* 필터 & 검색 */}
        <div className="flex flex-wrap gap-3 mb-4 justify-between">
          <AdminSearchInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="flex flex-row w-3/10 gap-2 ">
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
              onSelect={(value) =>
                setSelectedCategory(value === "전체" ? null : value)
              }
              buttonClassName="rounded-lg"
              className="text-gray-500"
            />

            <CustomDropdown
              label="상태"
              options={["전체", "임시저장", "게시 완료", "예약됨"]}
              onSelect={(value) =>
                setSelectedStatus(value === "전체" ? null : value)
              }
              buttonClassName="rounded-lg"
              className="text-gray-500"
            />
          </div>
        </div>

        {/* ✅ 공통 테이블 컴포넌트 */}
        <AdminContentTable
          data={filteredData.map((item) => ({
            ...item,
            onClickRow: () => router.push("/contentsUpload"),
          }))}
          columns={[
            "id",
            "image",
            "title",
            "category",
            "date",
            "status",
            "actions",
            "visibility",
          ]}
          columnWidths={[
            "40px",
            "50px",
            "3.9fr",
            "1fr",
            "1fr",
            "1fr",
            "60px",
            "40px",
          ]}
        />

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

export default ContentManagementPage;
