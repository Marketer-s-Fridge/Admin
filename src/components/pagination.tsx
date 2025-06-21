"use client";

import React from "react";
import Image from "next/image";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  return (
    <div className="flex justify-center items-center gap-8 mt-15 text-xs xs:mt-30 mb-0 sm:text-sm  text-gray-600">
      <button
        className="cursor-pointer disabled:opacity-40"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <Image
          src="/icons/left.png"
          alt="이전"
          className="w-5 h-5"
          width={30}
          height={30}
        />
      </button>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`${
            page === currentPage
              ? " text-red-500 font-semibold"
              : "hover:text-black cursor-pointer"
          }`}
        >
          {page}
        </button>
      ))}

      <button
        className="cursor-pointer disabled:opacity-40"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <Image
          src="/icons/right.png"
          alt="이전"
          className="w-5 h-5"
          width={30}
          height={30}
        />
      </button>
    </div>
  );
};

export default Pagination;
