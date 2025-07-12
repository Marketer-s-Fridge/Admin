"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";

interface AdminCategoryBarProps {
  items?: string[];
  onSelect?: (value: string) => void;
}

// 기본 메뉴 항목
const defaultItems = [
  "콘텐츠 업로드",
  "콘텐츠 관리",
  "임시 저장 리스트",
  "업로드 예약",
  "문의 답변 관리",
  "통계 및 분석",
];

const AdminCategoryBar: React.FC<AdminCategoryBarProps> = ({
  items = defaultItems, // ✅ 기본값 설정
  onSelect,
}) => {
  const pathname = usePathname();
  const router = useRouter();

  const routeMap: Record<string, string> = {
    "콘텐츠 업로드": "/contentsUpload",
    "콘텐츠 관리": "/contentsManagement",
    "임시 저장 리스트": "/tempList",
    "업로드 예약": "/scheduledUpload",
    "문의 답변 관리": "/inquiryReplies",
    "통계 및 분석": "/analytics",
  };

  const currentLabel = Object.entries(routeMap).find(
    ([, path]) => path === pathname
  )?.[0];

  const [selected, setSelected] = useState(currentLabel || items[0]);
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (item: string) => {
    setSelected(item);
    setIsOpen(false);
    onSelect?.(item);
    const route = routeMap[item];
    if (route) router.push(route);
  };

  return (
    <div className="hidden lg:block relative px-4 sm:px-10 lg:px-[15%] w-full border-b-2 border-gray-300 text-lg font-semibold select-none">
      <div className="relative w-[180px]">
        <div
          className="flex flex-row justify-between items-center text-start px-3 py-2 bg-white cursor-pointer"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <span>{selected}</span>
          <Image
            src="/icons/down.png"
            alt="dropdown icon"
            width={20}
            height={20}
          />
        </div>

        {isOpen && (
          <div className="text-start w-full absolute left-0 bg-white border text-sm border-gray-200 rounded-xl shadow z-50 py-1">
            {items.map((item) => {
              const isSelected = item === selected;
              return (
                <div
                  key={item}
                  onClick={() => handleSelect(item)}
                  className="text-start px-2 py-1 flex justify-center cursor-pointer"
                >
                  <span
                    className={`w-full px-2 py-2 rounded-lg transition-colors duration-150 ${
                      isSelected
                        ? "bg-[#FF4545] text-white"
                        : "hover:bg-gray-100 text-black"
                    }`}
                  >
                    {item}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCategoryBar;
