"use client";

import Image from "next/image";
import Link from "next/link";
import { FiMenu } from "react-icons/fi";

interface AdminHeaderProps {
  onMenuClick?: () => void; // 햄버거 클릭 콜백
}

export default function AdminHeader({ onMenuClick }: AdminHeaderProps) {
  return (
    <header className="relative w-full border-b border-gray-300 py-4 flex lg:justify-between items-center pl-4 sm:pl-10 lg:pl-[19%] lg:pr-[6%]">
      {/* 햄버거 버튼 (lg 이하에서만 보임) */}
      <div className=" lg:hidden flex self-end items-end">
        <button className="cursor-pointer" onClick={onMenuClick}>
          <FiMenu size={24} />
        </button>
      </div>

      {/* 로고 (lg 이하에서 가운데, lg 이상에서 왼쪽) */}
      <Link
        href="/"
        className="absolute left-1/2 transform -translate-x-1/2 lg:left-0 lg:relative lg:transform-none text-red-500 font-bold text-md lg:text-sm font-playfair"
      >
        Marketer&apos;s Fridge
      </Link>

      {/* 오른쪽 아이콘 + 이름 */}
      <div className="absolute right-4 sm:right-10 lg:relative flex items-center gap-1 lg:gap-3">
        <Image
          src="/icons/bell-bt.png"
          alt="Notification"
          width={20}
          height={20}
        />
        <div className="w-5 h-5 bg-gray-500 rounded-full" />
        <span className="text-xs lg:text-sm font-semibold text-black">Admin12</span>
      </div>
    </header>
  );
}
