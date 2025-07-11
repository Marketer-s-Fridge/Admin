"use client";

import Image from "next/image";
import Link from "next/link";

export default function AdminHeader() {
  return (
    <header className="relative w-full border-b border-gray-300 py-4 flex justify-between items-center  pl-4 sm:pl-10 lg:pl-[15%]  pr-[4%] lg:pr-[6%]">
      {/* 로고 */}
      <Link href="/" className="text-red-500 font-bold text-sm font-playfair">
        Marketer&apos;s Fridge
      </Link>

      {/* 오른쪽 아이콘 + 이름 */}
      <div className="flex items-center gap-3">
        <Image
          src="/icons/bell-bt.png"
          alt="Notification"
          width={20}
          height={20}
        />
        <div className="w-5 h-5 bg-gray-500 rounded-full" />
        <span className="text-sm font-semibold text-black">Admin12</span>
      </div>
    </header>
  );
}
