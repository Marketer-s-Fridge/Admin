"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import clsx from "clsx";

interface CustomDropdownProps {
  options: string[];
  label: string;
  onSelect?: (value: string) => void;
  className?: string;
  buttonClassName?: string;
}

export default function CustomDropdown2A11Y({
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
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [dropdownWidth, setDropdownWidth] = useState<number | null>(null);

  // ✅ 버튼 너비 기반 드롭다운 너비 자동 조정
  useEffect(() => {
    if (buttonRef.current) setDropdownWidth(buttonRef.current.offsetWidth);
  }, [selected, isOpen]);

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

  // ✅ ESC / 방향키 탐색 / Enter 선택
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);

      if (isOpen) {
        if (e.key === "ArrowDown") {
          e.preventDefault();
          setFocusedIndex((prev) =>
            prev === null ? 0 : (prev + 1) % options.length
          );
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          setFocusedIndex((prev) =>
            prev === null
              ? options.length - 1
              : (prev - 1 + options.length) % options.length
          );
        } else if (e.key === "Enter" && focusedIndex !== null) {
          handleSelect(options[focusedIndex]);
        }
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, focusedIndex, options]);

  const handleSelect = (option: string) => {
    setSelected(option);
    setIsOpen(false);
    setFocusedIndex(null);
    onSelect?.(option);
  };

  return (
    <div
      ref={dropdownRef}
      className={clsx("relative inline-block text-[12px] lg:text-sm", className)}
    >
      {/* ✅ 버튼 */}
      <button
        ref={buttonRef}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={clsx(
          "px-2 flex items-center justify-between gap-1 py-2 bg-white cursor-pointer select-none border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-300",
          buttonClassName
        )}
      >
        <span className="whitespace-nowrap">{selected}</span>
        <Image
          src="/icons/down2.png"
          alt="드롭다운 열기"
          width={20}
          height={20}
          className={clsx(
            "w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5 object-contain transition-transform duration-200",
            isOpen ? "rotate-180" : "rotate-0"
          )}
        />
      </button>

      {/* ✅ 드롭다운 리스트 */}
      {isOpen && (
        <ul
          role="listbox"
          tabIndex={-1}
          className={clsx(
            "absolute top-full mt-1 right-0 bg-white border border-gray-200 rounded-lg shadow-md z-50 max-h-72 overflow-y-auto min-w-max",
            "transition-all duration-150 ease-out"
          )}
          style={{
            width: dropdownWidth ? `${dropdownWidth}px` : "auto",
          }}
        >
          {options.map((opt, index) => (
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
                  "px-2 py-2 rounded-md transition-colors duration-150 whitespace-nowrap",
                  focusedIndex === index
                    ? "bg-[#FF4545] text-white"
                    : "hover:bg-[#FF4545] hover:text-white "
                )}
              >
                {opt}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
