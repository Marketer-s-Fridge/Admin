"use client";

import { useState } from "react";
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

  const handleSelect = (option: string) => {
    setSelected(option);
    setIsOpen(false);
    onSelect?.(option);
  };

  return (
    <div className={clsx("relative w-full text-sm font-medium", className)}>
      {/* 드롭다운 버튼 */}
      <div
        onClick={() => setIsOpen((prev) => !prev)}
        className={clsx(
          "flex items-center justify-between w-full gap-2 px-4 py-2 border border-gray-300 bg-white cursor-pointer",
          buttonClassName
        )}
      >
        <span>{selected}</span>
        <Image
          src="/icons/down.png"
          alt="드롭다운 열기"
          width={16}
          height={16}
          className=" w-5 h-5"
        />
      </div>

      {/* 드롭다운 리스트 */}
      {isOpen && (
        <div
          className={clsx(
            "absolute top-0 left-0 w-full bg-white border border-gray-100 rounded-lg shadow-lg z-50 max-h-72 overflow-y-auto",
            buttonClassName
          )}
        >
          {/* 현재 선택된 항목 표시 */}
          <div
            className="flex justify-between items-center px-4 py-2 cursor-pointer"
            onClick={() => setIsOpen(false)}
          >
            <span>{selected}</span>
            <Image
              alt="close"
              src="/icons/down.png"
              width={20}
              height={20}
              className="w-5 h-5"
            />
          </div>

          <hr className="border-t border-gray-200 mt-1 mb-1.5 mx-2" />

          {/* 옵션 목록 */}
          {options
            .filter((opt) => opt !== selected)
            .map((opt) => (
              <div
                key={opt}
                onClick={() => handleSelect(opt)}
                className="cursor-pointer px-2"
              >
                <div className="px-2 py-1.5 mb-2 rounded-md hover:bg-[#FF4545] hover:text-white transition-colors">
                  {opt}
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
