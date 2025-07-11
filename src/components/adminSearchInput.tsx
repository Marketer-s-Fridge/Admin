"use client";

import React from "react";
import Image from "next/image";

interface AdminSearchInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

const AdminSearchInput: React.FC<AdminSearchInputProps> = ({
  value,
  onChange,
  placeholder = "검색",
}) => {
  return (
    <div className="relative w-full sm:w-2/5 lg:w-1/3">
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="border border-gray-300 rounded-lg px-3 py-2 w-full text-[12px] lg:text-sm"
      />
      <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer">
        <Image
          src="/icons/search.png"
          alt="검색"
          width={20}
          height={20}
          className="w-4 h-4 sm:w-5 sm:h-5"
        />
      </button>
    </div>
  );
};

export default AdminSearchInput;
