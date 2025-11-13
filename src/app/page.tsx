"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import AdminHeader from "@/components/adminHeader";
import MobileMenu from "@/components/mobileMenu";

// 통계 관련 훅들
import { usePublishedCount } from "@/features/posts/hooks/usePublishedCount";
import { useUserCount } from "@/features/auth/hooks/useUserCount";
import { usePublishedPosts } from "@/features/posts/hooks/usePublishedPosts";
import { useVisitorStats } from "@/features/visitors/hooks/useVisitorStats";

// ✅ 문의 조회 훅 추가
import { useEnquiries } from "@/features/enquiries/hooks/useEnquiries";

export default function DashboardPage() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  // 게시된 게시물 수 / 전체 사용자 수 조회
  const { data: publishedCnt, isLoading: pubLoading, isError: pubErr } = usePublishedCount();
  const { data: userCnt, isLoading: userLoading, isError: userErr } = useUserCount();

  // 최신 6개 게시물 조회
  const { data: publishedPosts, isLoading: postsLoading, isError: postsErr } = usePublishedPosts(6);

  // 방문자 통계 조회
  const {
    data: visitorStats,
    isLoading: visitorLoading,
    isError: visitorErr,
  } = useVisitorStats();

  // ✅ 전체 문의 조회 (갯수 사용)
  const {
    data: enquiries,
    isLoading: enquiryLoading,
    isError: enquiryErr,
  } = useEnquiries();

  const fmt = (n: number) => n.toLocaleString("ko-KR");

  const menuItems = [
    { label: "콘텐츠 업로드", icon: "/admin/icons/upload.png", path: "contentsUpload" },
    { label: "콘텐츠 관리", icon: "/admin/icons/menu.png", path: "contentsManagement" },
    { label: "임시 저장 리스트", icon: "/admin/icons/archive.png", path: "tempList" },
    { label: "업로드 예약", icon: "/admin/icons/clock.png", path: "scheduledUpload" },
    { label: "문의 답변 관리", icon: "/admin/icons/mdi_comment-question-outline.png", path: "inquiryReplies" },
    { label: "통계 및 분석", icon: "/admin/icons/entypo_bar-graph.png", path: "analytics" },
  ];

  return (
    <div className="bg-white">
      <AdminHeader onMenuClick={() => setMenuOpen(!menuOpen)} />
      <MobileMenu menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      <div className="min-h-screen flex flex-col lg:flex-row bg-white">
        {/* Sidebar */}
        <aside className="hidden lg:block bg-[#f9f9f9] border-r border-gray-200 py-15 px-4 text-sm w-full lg:w-[15%]">
          <ul className="space-y-10 font-bold flex lg:flex-col flex-wrap justify-between">
            {menuItems.map(({ label, icon, path }, idx) => (
              <li
                key={idx}
                className="flex items-center gap-3.5 cursor-pointer"
                onClick={() => path && router.push(path)}
              >
                <Image
                  alt={label}
                  src={icon}
                  width={30}
                  height={30}
                  className="w-5 aspect-square"
                  unoptimized
                />
                {label}
              </li>
            ))}
          </ul>
        </aside>

        {/* Main Content */}
        <main className="flex-1 px-4 sm:px-10 lg:pl-10 lg:pr-[15%] bg-white">
          {/* Summary */}
          <div className="grid grid-cols-3 gap-6 text-center text-base sm:text-lg lg:text-xl font-semibold my-20 lg:my-20">
            <div>
              게시물 수
              <div className="text-red-500 text-xl sm:text-2xl lg:text-3xl mt-1">
                {pubLoading ? "…" : pubErr ? "-" : fmt(publishedCnt ?? 0)}
              </div>
            </div>

            <div>
              문의사항
              <div className="text-red-500 text-xl sm:text-2xl lg:text-3xl mt-1">
                {enquiryLoading
                  ? "…"
                  : enquiryErr
                  ? "-"
                  : enquiries?.length ?? 0}
              </div>
            </div>

            <div>
              회원 수
              <div className="text-red-500 text-xl sm:text-2xl lg:text-3xl mt-1">
                {userLoading ? "…" : userErr ? "-" : fmt(userCnt ?? 0)}
              </div>
            </div>
          </div>

          <div className="bg-gray-200 w-full h-0.5"></div>

          {/* 하단 콘텐츠 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 my-10">
            {/* 최근 업로드 */}
            <div>
              <h2 className="text-lg sm:text-xl font-bold mb-4">최근 업로드</h2>

              {postsLoading && (
                <div className="text-sm text-gray-500">로딩 중...</div>
              )}
              {postsErr && (
                <div className="text-sm text-red-500">게시물 로드 실패</div>
              )}
              {!postsLoading && !postsErr && publishedPosts && publishedPosts.length > 0 ? (
                <ul className="space-y-3 text-sm">
                  {publishedPosts.map((post, index) => (
                    <li
                      key={post.id ?? index}
                      className="grid grid-cols-[80px_1fr_auto] sm:grid-cols-[100px_1fr_auto] items-center gap-3"
                    >
                      <span className="font-bold text-xs sm:text-sm">
                        {post.category ?? "기타"}
                      </span>
                      <span className="truncate text-xs sm:text-sm">
                        {post.title ?? "(제목 없음)"}
                      </span>
                      <span className="text-xs text-gray-500">
                        {post.updatedAt
                          ? post.updatedAt.slice(0, 10)
                          : post.createdAt?.slice(0, 10) ?? "-"}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                !postsLoading && (
                  <div className="text-sm text-gray-500">등록된 게시물이 없습니다.</div>
                )
              )}
            </div>

            {/* 방문자 수 */}
            <div>
              <h2 className="text-lg sm:text-xl font-bold mb-4">방문자 수</h2>

              <div className="flex flex-wrap gap-4">
                {[
                  { label: "오늘 방문자 수", value: visitorStats?.todayCount },
                  { label: "이번 달 방문자 수", value: visitorStats?.monthCount },
                  { label: "전체 방문자 수", value: visitorStats?.totalCount },
                ].map(({ label, value }, i) => (
                  <div
                    key={i}
                    className="bg-red-100 p-4 rounded-md text-center w-[30%] min-w-[110px]"
                  >
                    <div className="text-xs mb-1">{label}</div>
                    <div className="text-lg sm:text-xl font-bold">
                      {visitorLoading ? "…" : visitorErr ? "-" : fmt(value ?? 0)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 text-xs text-gray-500">
                {new Date().toLocaleDateString("ko-KR")} 기준
              </div>

              <div className="mt-2 w-full h-32 bg-gray-100 rounded-md flex items-center justify-center text-gray-400 text-xs">
                [방문자 수 그래프 자리]
              </div>

              <button
                onClick={() => router.push("/")}
                className="bg-red-500 w-full mt-5 text-white px-6 py-3 rounded-lg text-sm font-semibold"
              >
                홈으로 돌아가기
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
