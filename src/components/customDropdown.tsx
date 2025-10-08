"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import clsx from "clsx";

interface CustomDropdownProps {
  options: string[];
  label: string;
  onSelect?: (value: string) => void;
  className?: string;
  buttonClassName?: string;
}

export default function CustomDropdown({
  options,
  label,
  onSelect,
  className = "",
  buttonClassName = "",
}: CustomDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(label);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // ✅ 밖 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✅ 선택 핸들러 (useCallback으로 안정화)
  const handleSelect = useCallback(
    (option: string) => {
      setSelected(option);
      setIsOpen(false);
      setFocusedIndex(null);
      onSelect?.(option);
    },
    [onSelect]
  );

  // ✅ 키보드 제어 (ESC, ↑↓, Enter)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === "Escape") {
        setIsOpen(false);
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setFocusedIndex((prev) =>
          prev === null ? 0 : (prev + 1) % options.length
        );
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setFocusedIndex((prev) =>
          prev === null
            ? options.length - 1
            : (prev - 1 + options.length) % options.length
        );
      }
      if (e.key === "Enter" && focusedIndex !== null) {
        handleSelect(options[focusedIndex]);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, focusedIndex, options, handleSelect]); // ✅ handleSelect 추가됨

  // ✅ 드롭다운 열릴 때 포커스 이동
  useEffect(() => {
    if (isOpen && listRef.current) listRef.current.focus();
  }, [isOpen]);

  return (
    <div
      ref={dropdownRef}
      className={clsx(
        "relative w-full text-nowrap text-[12px] lg:text-[13px]",
        className
      )}
    >
      {/* ✅ 드롭다운 버튼 */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={clsx(
          "min-w-30 flex items-center justify-between w-full py-2 border border-gray-300 bg-white cursor-pointer focus:outline-none focus:ring-1 focus:ring-gray-300 rounded-md",
          buttonClassName
        )}
      >
        <span className="ml-2 lg:ml-2.5">{selected}</span>
        <Image
          src="/icons/down2.png"
          alt="드롭다운 열기"
          width={20}
          height={20}
          className={clsx(
            "mr-2 lg:mr-2.5 relative w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5 object-contain transition-transform duration-200",
            isOpen ? "rotate-180" : "rotate-0"
          )}
        />
      </button>

      {/* ✅ 드롭다운 리스트 */}
      {isOpen && (
        <ul
          ref={listRef}
          role="listbox"
          tabIndex={-1}
          className={clsx(
            "absolute top-full mt-1 left-0 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-72 overflow-y-auto animate-fade-slide"
          )}
        >
          {options
            .filter((opt) => opt !== selected)
            .map((opt, index) => (
              <li
                key={opt}
                role="option"
                aria-selected={selected === opt}
                onClick={() => handleSelect(opt)}
                onMouseEnter={() => setFocusedIndex(index)}
                className="px-1 py-1 cursor-pointer select-none"
              >
                <div
                  className={clsx(
                    "px-2 py-2 rounded-md transition-colors duration-150",
                    focusedIndex === index
                      ? "bg-[#FF4545] text-white"
                      : "hover:bg-[#FF4545] hover:text-white"
                  )}
                >
                  {opt}
                </div>
              </li>
            ))}
        </ul>
      )}

      {/* ✅ 애니메이션 */}
      <style jsx>{`
        @keyframes fade-slide {
          from {
            opacity: 0;
            transform: translateY(-4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-slide {
          animation: fade-slide 0.15s ease-out;
        }
      `}</style>
    </div>
  );
}
