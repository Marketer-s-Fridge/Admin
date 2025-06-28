"use client";

import React, { useState, useRef, useEffect } from "react";

interface TimeDropdownProps {
  value: string;
  onSelect: (time: string) => void;
}

const generateTimeOptions = () => {
  const times: string[] = [];
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 10) {
      const hour = h === 0 ? 12 : h > 12 ? h - 12 : h;
      const period = h < 12 ? "오전" : "오후";
      const minute = m.toString().padStart(2, "0");
      times.push(`${period} ${hour}:${minute}`);
    }
  }
  return times;
};

const timeOptions = generateTimeOptions();

const TimeDropdown: React.FC<TimeDropdownProps> = ({ value, onSelect }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <input
        readOnly
        value={value}
        onClick={() => setOpen((prev) => !prev)}
        className="border border-gray-300 rounded-lg px-3 py-2.5 w-full cursor-pointer"
      />
      {open && (
        <div className="absolute z-50 mt-2 max-h-60 w-full overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-lg text-base">
          {timeOptions.map((time) => (
            <div
              key={time}
              onClick={() => {
                onSelect(time);
                setOpen(false);
              }}
              className={`px-2 mx-2 py-2 my-2 hover:bg-[#FF4545] rounded-lg cursor-pointer hover:text-white transition-colors${
                time === value ? "bg-gray-100 font-bold" : ""
              }`}
            >
              {time}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TimeDropdown;
