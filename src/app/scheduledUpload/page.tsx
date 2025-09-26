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

interface ContentItem extends AdminContentItem {
  category: string;
  date: string;
  time: string;
  visibility: "공개" | "비공개";
}


const initialData: ContentItem[] = [
  {
    id: 24,
    title: "뭐라고? 쿠션이 40가지나 된다고?!",
    category: "Beauty",
    date: "2025/05/10",
    time: "11:30",
    visibility: "공개",
    image: "/images/sample1.png",
  },
  {
    id: 23,
    title: "뭐라고? 쿠션이 40가지나 된다고?!",
    category: "Beauty",
    date: "2025/05/10",
    time: "13:30",
    visibility: "공개",
    image: "/images/sample1.png",
  },
  {
    id: 22,
    title: "뭐라고? 쿠션이 40가지나 된다고?!",
    category: "Food",
    date: "2025/05/10",
    time: "20:30",
    visibility: "공개",
    image: "/images/sample1.png",
  },
  {
    id: 21,
    title: "건강한 아침 식사 아이디어:에너지 충전을 위한 메뉴",
    category: "Fashion",
    date: "2025/05/10",
    time: "12:30",
    visibility: "공개",
    image: "/images/sample2.png",
  },
  {
    id: 20,
    title: "건강한 라이프스타일을 위한 스트레스 관리 방법",
    category: "Beauty",
    date: "2025/05/10",
    time: "14:30",
    visibility: "공개",
    image: "/images/sample3.png",
  },
  {
    id: 19,
    title: "창의성을 끌어올리는 방법:아이디어 발생 기술",
    category: "Tech",
    date: "2025/05/10",
    time: "18:20",
    visibility: "공개",
    image: "/images/sample4.png",
  },
  {
    id: 18,
    title: "자연 속에서 힐링하는 베스트 트레킹 여행지 5선",
    category: "Beauty",
    date: "2025/05/10",
    time: "19:30",
    visibility: "공개",
    image: "/images/sample5.png",
  },
  {
    id: 17,
    title: "자기 계발의 시작:5가지 효과적인 습관",
    category: "Lifestyle",
    date: "2025/05/10",
    time: "18:30",
    visibility: "비공개",
    image: "/images/sample6.png",
  },
];

const ScheduledUploadPage = () => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // ✅ 상태로 데이터 관리
  const [rows, setRows] = useState<ContentItem[]>(
    initialData.map((item) => ({ ...item, selected: false }))
  );

  const router = useRouter();

  // ✅ 개별 체크박스 변경
  const handleSelectChange = (id: number, checked: boolean) => {
    setRows((prev) =>
      prev.map((row) => (row.id === id ? { ...row, selected: checked } : row))
    );
  };

  // ✅ 전체 선택/해제
  const handleSelectAll = (checked: boolean) => {
    setRows((prev) => prev.map((row) => ({ ...row, selected: checked })));
  };

  const filteredData = rows.filter((item) => {
    const matchesCategory =
      !selectedCategory || item.category === selectedCategory;
    const matchesSearch =
      !search || item.title.includes(search) || item.category.includes(search);
    return matchesCategory && matchesSearch;
  });

  return (
    <main className="bg-white min-h-screen">
      <AdminHeader onMenuClick={() => setMenuOpen(!menuOpen)} />
      <AdminCategoryBar />
      <MobileMenu menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      <section className="px-4 sm:px-10 lg:px-[15%] py-[2%]">
        <div className="flex flex-wrap gap-3 mb-4 justify-between">
          <AdminSearchInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="flex flex-row sm:w-3/20">
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
          </div>
        </div>

        <div className="flex py-3 px-1 sm:px-3 justify-between">
          <div className="flex items-center gap-4">
            <input
              type="checkbox"
              className="w-4 h-4 accent-gray-800"
              checked={rows.every((row) => row.selected)} // ✅ 전체 선택 여부
              onChange={(e) => handleSelectAll(e.target.checked)}
            />
            <button className="text-sm text-black font-semibold cursor-pointer">
              전체 업로드
            </button>
            <button className="text-sm text-black font-semibold cursor-pointer">
              전체 삭제
            </button>
          </div>

          <div className="w-[1/4] sm:w-[14%]">
            <CustomDropdown
              label="업로드 예정 순"
              options={["업로드 예정 순", "작성일 순"]}
              onSelect={() => {}}
              buttonClassName="border-0"
              className="text-gray-500"
            />
          </div>
        </div>

        <AdminContentTable
          data={filteredData.map((item) => ({
            ...item,
            onSelectChange: (checked) => handleSelectChange(item.id, checked),
            onEdit: () => console.log("Edit", item.id),
            onDelete: () => console.log("Delete", item.id),
            onShare: () => console.log("Share", item.id),
            onClickRow: () => router.push("/contentsUpload"),
          }))}
          columns={[
            "checkbox",
            "image",
            "title",
            "author",
            "category",
            "date",
            "time",
            "actions",
          ]}
          columnWidths={[
            "40px",
            "0.7fr",
            "3fr",
            "1fr",
            "1fr",
            "1fr",
            "1fr",
            "90px",
          ]}
          showCheckbox
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

export default ScheduledUploadPage;
