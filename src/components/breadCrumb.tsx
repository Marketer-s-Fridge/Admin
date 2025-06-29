"use client";

import Link from "next/link";

interface BreadcrumbItem {
  label: string;
  href?: string; // 마지막 항목은 링크가 없을 수도 있으니까
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <div className="flex px-4 sm:px-6 xl:px-[15%] text-xs pt-8 text-gray-500">
      {items.map((item, index) => (
        <div key={index} className="flex items-center">
          {item.href ? (
            <Link href={item.href} className="hover:text-black">
              {item.label}
            </Link>
          ) : (
            <span className="text-black font-medium">{item.label}</span>
          )}
          {index < items.length - 1 && <span className="mx-2">&gt;</span>}
        </div>
      ))}
    </div>
  );
}
