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

interface ContentItem extends AdminContentItem {
  category: string;
  type: string;
  date: string;
  time: string;
  visibility: "공개" | "비공개";
}

const sampleData: ContentItem[] = [
  {
    id: 24,
    title: "뭐라고? 쿠션이 40가지나 된다고?!",
    category: "Beauty",
    type: "마케팅 트렌드",
    date: "2025/05/10",
    time: "11:30",
    visibility: "공개",
    image: "/images/sample1.png",
  },
  {
    id: 23,
    title: "뭐라고? 쿠션이 40가지나 된다고?!",
    category: "Beauty",
    type: "브랜드 사례",
    date: "2025/05/10",
    time: "13:30",
    visibility: "공개",
    image: "/images/sample1.png",
  },
  {
    id: 22,
    title: "뭐라고? 쿠션이 40가지나 된다고?!",
    category: "Food",
    type: "마케팅 트렌드",
    date: "2025/05/10",
    time: "20:30",
    visibility: "공개",
    image: "/images/sample1.png",
  },
  {
    id: 21,
    title: "건강한 아침 식사 아이디어:에너지 충전을 위한 메뉴",
    category: "Fashion",
    type: "마케팅 트렌드",
    date: "2025/05/10",
    time: "12:30",
    visibility: "공개",
    image: "/images/sample2.png",
  },
  {
    id: 20,
    title: "건강한 라이프스타일을 위한 스트레스 관리 방법",
    category: "Beauty",
    type: "브랜드 사례",
    date: "2025/05/10",
    time: "14:30",
    visibility: "공개",
    image: "/images/sample3.png",
  },
  {
    id: 19,
    title: "창의성을 끌어올리는 방법:아이디어 발생 기술",
    category: "Tech",
    type: "마케팅 트렌드",
    date: "2025/05/10",
    time: "18:20",
    visibility: "공개",
    image: "/images/sample4.png",
  },
  {
    id: 18,
    title: "자연 속에서 힐링하는 베스트 트레킹 여행지 5선",
    category: "Beauty",
    type: "마케팅 트렌드",
    date: "2025/05/10",
    time: "19:30",
    visibility: "공개",
    image: "/images/sample5.png",
  },
  {
    id: 17,
    title: "자기 계발의 시작:5가지 효과적인 습관",
    category: "Lifestyle",
    type: "마케팅 트렌드",
    date: "2025/05/10",
    time: "18:30",
    visibility: "비공개",
    image: "/images/sample6.png",
  },
];

const ScheduledUploadPage = () => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();

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
            <input type="checkbox" className="w-4 h-4 accent-gray-800" />
            <button className="text-sm text-black font-semibold cursor-pointer">
              전체 업로드
            </button>
            <button className="text-sm text-black font-semibold cursor-pointer">
              전체 삭제
            </button>
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

        <AdminContentTable
          data={sampleData.map((item) => ({
            ...item,
            author: "admin12",
            onEdit: () => console.log("Edit", item.id),
            onDelete: () => console.log("Delete", item.id),
            onShare: () => console.log("Share", item.id),
            onClickRow: () => router.push("/contentsUpload"),
          }))}
          columns={[
            "checkbox", // ✅ 체크박스
            "image", // 썸네일
            "title", // 제목
            "author", // 담당자
            "category", // 카테고리
            "type", // 유형
            "date", // 날짜
            "time", // 시간
            "actions", // 액션
          ]}
          columnWidths={[
            "40px", // ✅ checkbox
            "60px", // 썸네일
            "3fr", // 제목
            "1fr", // 담당자
            "1fr", // 카테고리
            "1fr", // 유형
            "1fr", // 날짜
            "1fr", // 시간
            "90px", // 액션 버튼
          ]}
          showCheckbox={true}
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
