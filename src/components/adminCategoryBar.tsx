"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";

interface AdminCategoryBarProps {
  items?: string[];
  onSelect?: (value: string) => void;
}

// ✅ 기본 메뉴 항목
const defaultItems = [
  "콘텐츠 업로드",
  "콘텐츠 관리",
  "임시 저장 리스트",
  "업로드 예약 리스트",
  "문의 답변 관리",
  "통계 및 분석",
];

export default function AdminCategoryBar({
  items = defaultItems,
  onSelect,
}: AdminCategoryBarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const routeMap: Record<string, string> = {
    "콘텐츠 업로드": "/contentsUpload",
    "콘텐츠 관리": "/contentsManagement",
    "임시 저장 리스트": "/tempList",
    "업로드 예약 리스트": "/scheduledUpload",
    "문의 답변 관리": "/inquiryReplies",
    "통계 및 분석": "/analytics",
  };

  // ✅ 현재 경로에 따른 기본 선택값
  const currentLabel = Object.entries(routeMap).find(
    ([, path]) => path === pathname
  )?.[0];
  const [selected, setSelected] = useState(currentLabel || items[0]);
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

  // ✅ 외부 클릭 시 닫기
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  // ✅ 선택 핸들러 (useCallback으로 안정화)
  const handleSelect = useCallback(
    (item: string) => {
      setSelected(item);
      setIsOpen(false);
      setFocusedIndex(null);
      onSelect?.(item);
      const route = routeMap[item];
      if (route) router.push(route);
    },
    [onSelect, router]
  );

  // ✅ 키보드 접근성
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === "Escape") setIsOpen(false);

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setFocusedIndex((prev) =>
          prev === null ? 0 : (prev + 1) % items.length
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setFocusedIndex((prev) =>
          prev === null
            ? items.length - 1
            : (prev - 1 + items.length) % items.length
        );
      } else if (e.key === "Enter" && focusedIndex !== null) {
        handleSelect(items[focusedIndex]);
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, focusedIndex, items, handleSelect]); // ✅ handleSelect 추가됨

  // ✅ 드롭다운 열릴 때 포커스 이동
  useEffect(() => {
    if (isOpen && listRef.current) listRef.current.focus();
  }, [isOpen]);

  return (
    <div className="hidden lg:block relative px-4 sm:px-10 lg:px-[15%] w-full border-b-2 border-gray-300 text-base font-semibold select-none">
      <div ref={dropdownRef} className="relative inline-block">
        {/* ✅ 버튼 */}
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          className="flex items-center justify-between gap-2 text-start px-3 py-2 bg-white cursor-pointer rounded-md hover:bg-gray-50 transition-colors"
        >
          <span className="whitespace-nowrap">{selected}</span>
          <Image
            src="/icons/down.png"
            alt="dropdown icon"
            width={20}
            height={20}
            className={`transition-transform duration-200 ${
              isOpen ? "rotate-180" : "rotate-0"
            }`}
          />
        </button>

        {/* ✅ 드롭다운 목록 */}
        {isOpen && (
          <ul
            ref={listRef}
            role="listbox"
            tabIndex={-1}
            className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-50 py-1 min-w-[180px] animate-fade-slide"
          >
            {items.map((item, index) => {
              const isSelected = item === selected;
              return (
                <li
                  key={`${item}-${index}`}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setFocusedIndex(index)}
                  className="px-1 py-1 cursor-pointer select-none"
                >
                  <div
                    className={`px-2 py-2 rounded-md transition-colors duration-150 ${
                      isSelected
                        ? "bg-[#FF4545] text-white"
                        : focusedIndex === index
                        ? "bg-gray-100 text-black"
                        : "hover:bg-[#FF4545] hover:text-white text-black"
                    }`}
                  >
                    {item}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* ✅ 간단한 fade+slide 애니메이션 */}
      <style jsx>{`
        @keyframes fade-slide {
          from {
            opacity: 0;
            transform: translateY(-5px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-slide {
          animation: fade-slide 0.18s ease-out;
        }
      `}</style>
    </div>
  );
}
