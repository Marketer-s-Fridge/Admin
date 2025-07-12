"use client";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import AdminHeader from "@/components/adminHeader";
import MobileMenu from "@/components/mobileMenu";

export default function DashboardPage() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const menuItems = [
    {
      label: "콘텐츠 업로드",
      icon: "/icons/upload.png",
      path: "contentsUpload",
    },
    {
      label: "콘텐츠 관리",
      icon: "/icons/menu.png",
      path: "contentsManagement",
    },
    {
      label: "임시 저장 리스트",
      icon: "/icons/archive.png",
      path: "tempList",
    },
    {
      label: "업로드 예약",
      icon: "/icons/clock.png",
      path: "scheduledUpload",
    },
    {
      label: "문의 답변 관리",
      icon: "/icons/mdi_comment-question-outline.png",
      path: "inquiryReplies",
    },
    {
      label: "통계 및 분석",
      icon: "/icons/entypo_bar-graph.png",
      path: "analytics",
    },
  ];

  return (
    <div className="bg-white">
      <AdminHeader onMenuClick={() => setMenuOpen(!menuOpen)} />

      {/* 오버레이 메뉴 (모바일용) */}
      <MobileMenu menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      <div className="min-h-screen flex flex-col lg:flex-row bg-white">
        {/* Sidebar */}
        <aside className="hidden lg:block bg-[#f9f9f9] border-r border-gray-200 py-6 px-4 text-sm w-full lg:w-[15%]">
          <ul className="space-y-8 font-bold flex lg:flex-col flex-wrap justify-between">
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
                435
              </div>
            </div>
            <div>
              문의사항
              <div className="text-red-500 text-xl sm:text-2xl lg:text-3xl mt-1">
                1
              </div>
            </div>
            <div>
              회원 수
              <div className="text-red-500 text-xl sm:text-2xl lg:text-3xl mt-1">
                1,654
              </div>
            </div>
          </div>

          <div className="bg-gray-200 w-full h-0.5"></div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 my-10">
            {/* Recent Uploads */}
            <div>
              <h2 className="text-lg sm:text-xl font-bold mb-4">최근 업로드</h2>
              <ul className="space-y-3 text-sm">
                {[
                  {
                    category: "Lifestyle",
                    title: "효과적인 의사소통을 위한 비언어적 신호",
                    date: "2025.05.16",
                  },
                  {
                    category: "Food",
                    title: "맛있고 건강한 채식 요리 레시피 10가지",
                    date: "2025.05.12",
                  },
                  {
                    category: "Lifestyle",
                    title: "건강한 머리카락을 위한 헤어케어 팁",
                    date: "2025.05.07",
                  },
                  {
                    category: "Fashion",
                    title: "패션 스타일링: 개인 맞춤형 옷차림의 중요성",
                    date: "2025.05.05",
                  },
                  {
                    category: "Lifestyle",
                    title: "마인드풀니스: 현대인의 스트레스 해소 비법",
                    date: "2025.04.29",
                  },
                  {
                    category: "Lifestyle",
                    title: "마인드풀니스: 현대인의 스트레스 해소 비법",
                    date: "2025.04.22",
                  },
                ].map((item, index) => (
                  <li
                    key={index}
                    className="grid grid-cols-[80px_1fr_auto] sm:grid-cols-[100px_1fr_auto] items-center gap-3"
                  >
                    <span className="font-bold text-xs sm:text-sm">
                      {item.category}
                    </span>
                    <span className="truncate text-xs sm:text-sm">
                      {item.title}
                    </span>
                    <span className="text-xs text-gray-500">{item.date}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Visitor Count */}
            <div>
              <h2 className="text-lg sm:text-xl font-bold mb-4">방문자 수</h2>
              <div className="flex flex-wrap gap-4">
                {[
                  { label: "오늘 방문자 수", value: 12 },
                  { label: "이번 달 방문자 수", value: 210 },
                  { label: "전체 방문자 수", value: 3456 },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="bg-red-100 p-4 rounded-md text-center w-[30%] min-w-[90px]"
                  >
                    <div className="text-xs mb-1">{item.label}</div>
                    <div className="text-lg sm:text-xl font-bold">
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 text-xs text-gray-500">
                2025.05.16 24:00 기준
              </div>
              <div className="mt-2 w-full h-32 bg-gray-100 rounded-md flex items-center justify-center text-gray-400 text-xs">
                [방문자 수 그래프 자리]
              </div>
              <button className="bg-red-500 w-full mt-5 text-white px-6 py-3 rounded-lg text-sm font-semibold">
                홈으로 돌아가기
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
