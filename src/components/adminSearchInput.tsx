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
    <div className="relative w-4/10">
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="border border-gray-300 rounded-lg px-3 py-1.5 w-full"
      />
      <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer">
        <Image
          src="/icons/search.png"
          alt="검색"
          width={16}
          height={16}
          className="w-5 h-5"
        />
      </button>
    </div>
  );
};

export default AdminSearchInput;
