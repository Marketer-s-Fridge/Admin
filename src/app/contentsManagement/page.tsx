"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminHeader from "@/components/adminHeader";
import AdminCategoryBar from "@/components/adminCategoryBar";
import Pagination from "@/components/pagination";
import CustomDropdown from "@/components/customDropdown";
import AdminSearchInput from "@/components/adminSearchInput";
import MobileMenu from "@/components/mobileMenu";
import AdminContentTable, {
} from "@/components/adminContentTable";
import { fetchPosts } from "@/features/posts/api/postsApi";
import { PostResponseDto } from "@/features/posts/types";

const ContentManagementPage = () => {
  const [posts, setPosts] = useState<PostResponseDto[]>([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // ✅ 게시물 데이터 불러오기
  useEffect(() => {
    const loadPosts = async () => {
      try {
        setLoading(true);
        const data = await fetchPosts();
        setPosts(data);
        console.log("✅ 게시물 불러오기 성공:", data);
      } catch (err) {
        console.error("게시물 불러오기 실패:", err);
      } finally {
        setLoading(false);
      }
    };
    loadPosts();
  }, []);

  // ✅ 필터 + 검색
  const filteredData = posts.filter((item) => {
    const matchCategory =
      !selectedCategory || item.category === selectedCategory;
    const matchStatus =
      !selectedStatus ||
      (item.postStatus === "DRAFT" && selectedStatus === "임시저장") ||
      (item.postStatus === "PUBLISHED" && selectedStatus === "게시 완료") ||
      (item.postStatus === "SCHEDULED" && selectedStatus === "예약됨");
    const matchSearch =
      !search ||
      item.title.includes(search) ||
      item.category?.includes(search) ||
      item.content?.includes(search);

    return matchCategory && matchStatus && matchSearch;
  });

  // ✅ 페이지네이션 (10개씩 예시)
  const itemsPerPage = 10;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filteredData.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  return (
    <main className="bg-white min-h-screen">
      <AdminHeader onMenuClick={() => setMenuOpen(!menuOpen)} />
      <AdminCategoryBar />
      <MobileMenu menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      <section className="relative px-4 sm:px-10 lg:px-[15%] py-[4%]">
        {/* 🔍 필터 & 검색 */}
        <div className=" flex flex-wrap gap-3 mb-4 justify-between">
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

        {/* 📋 게시물 테이블 */}
        {loading ? (
          <div className="text-center text-gray-500 mt-10">로딩 중...</div>
        ) : filteredData.length === 0 ? (
          <div className=" text-center text-gray-500 mt-10">
            게시물이 없습니다.
          </div>
        ) : (
          <AdminContentTable
            data={currentData.map((item) => ({
              id: item.id,
              title: item.title,
              category: item.category,
              date: new Date(item.createdAt).toLocaleDateString("ko-KR"),
              status:
                item.postStatus === "DRAFT"
                  ? "임시저장"
                  : item.postStatus === "SCHEDULED"
                  ? "예약됨"
                  : "게시 완료",
              visibility: "공개", // 필요시 item.visibility 로 변경
              image: item.images?.[0] || "/images/sample1.png",
              onClickRow: () => router.push(`/contents/${item.id}`),
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
            // columnWidths={[
            //   "40px",
            //   "0.7fr",
            //   "3.9fr",
            //   "1fr",
            //   "1fr",
            //   "1fr",
            //   "60px",
            //   "40px",
            // ]}
            showHeader={true}
            columnLabels={[
              "번호",
              "",
              "콘텐츠",
              "카테고리",
              "게시일자",
              "처리상태",
              "",
              "공개유무",
            ]}
          />
        )}

        {/* 페이지네이션 */}
        {filteredData.length > 0 && (
          <div className="flex justify-center mt-6">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => setCurrentPage(page)}
            />
          </div>
        )}
      </section>
    </main>
  );
};

export default ContentManagementPage;
