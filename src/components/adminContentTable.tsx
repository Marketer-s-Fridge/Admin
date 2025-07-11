// components/common/AdminContentTable.tsx
"use client";

import React from "react";
import Image from "next/image";
import { FiEdit2, FiTrash2, FiShare2, FiPaperclip } from "react-icons/fi";

export interface AdminContentItem {
  id: number;
  title: string;
  category?: string;
  type?: string;
  date: string;
  time?: string;
  status?: string;
  visibility?: "공개" | "비공개";
  image: string;
  author?: string;
  email?: string;
  name?: string;
  responder?: string;
  views?: number;
  clicks?: number;
  engagementRate?: string;
  hasAttachment?: boolean;
  selectable?: boolean;
  selected?: boolean;
  onSelectChange?: (checked: boolean) => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onShare?: () => void;
  onClickRow?: () => void;

}

interface AdminContentTableProps {
  data: AdminContentItem[];
  columns: string[];
  columnLabels?: string[]; // ✅ 컬럼 헤더 명칭
  showHeader?: boolean; // ✅ 컬럼명 보일지 여부
  showCheckbox?: boolean;
  columnWidths?: string[]; // ✅ 예: ['40px', '50px', '3fr', ...]
}

const AdminContentTable: React.FC<AdminContentTableProps> = ({
  data,
  columns,
  columnLabels,
  showHeader = false,
  showCheckbox = false,
  columnWidths,
}) => {
  const gridTemplate =
    columnWidths?.join(" ") || `repeat(${columns.length}, 1fr)`;

  return (
    <div className="border-t-2 border-gray-500 ">
      {/* ✅ 컬럼 헤더 */}
      {showHeader && columnLabels && (
        <div
          className="font-bold text-gray-700 py-2 text-[12px] sm:text-[12px] lg:text-sm border-b-2 border-b-gray-500"
          style={{
            display: "grid",
            gridTemplateColumns: gridTemplate,
            gap: "1rem",
          }}
          
        >
          {columnLabels.map((label, i) => (
            <div key={i} className="text-center ">
              {label}
            </div>
          ))}
        </div>
      )}

      {/* ✅ 데이터 렌더링 */}
      {data.map((item) => (
        <div
          key={item.id}
          onClick={item.onClickRow}
          className=" cursor-pointer py-3 items-center text-[12px] sm:text-[12px] lg:text-sm hover:bg-gray-50 text-gray-700"
          style={{
            display: "grid",
            gridTemplateColumns: gridTemplate,
            gap: "1rem",
          }}
        >
          {columns.map((col) => {
            switch (col) {
              case "checkbox":
                return showCheckbox ? (
                  <div key={col} className="flex justify-center">
                    <input
                      type="checkbox"
                      className="w-4 h-4 accent-gray-800"
                      checked={item.selected || false}
                      onChange={(e) => item.onSelectChange?.(e.target.checked)}
                    />
                  </div>
                ) : (
                  <div key={col} />
                );
              case "id":
                return (
                  <div key={col} className="text-center font-semibold">
                    {item.id}
                  </div>
                );
              case "image":
                return (
                  <div key={col}>
                    <Image
                    //   src={item.image"}
                      src={"/images/Category-1.jpg"}
                      alt="썸네일"
                      width={40}
                      height={40}
                      className="rounded"
                    />
                  </div>
                );
              case "title":
                return (
                  <div
                    key={col}
                    className="truncate font-semibold flex items-center gap-1"
                  >
                    {item.hasAttachment && (
                      <FiPaperclip className="text-gray-400 w-4 h-4" />
                    )}
                    {item.title}
                  </div>
                );
              case "email":
                return (
                  <div key={col} className="truncate">
                    {item.email}
                  </div>
                );
              case "author":
                return (
                  <div key={col} className="text-center">
                    {item.author}
                  </div>
                );
              case "name":
                return (
                  <div key={col} className="text-center">
                    {item.name}
                  </div>
                );
              case "responder":
                return (
                  <div key={col} className="text-center">
                    {item.responder}
                  </div>
                );
              case "category":
                return <div key={col}>{item.category}</div>;
              case "type":
                return <div key={col}>{item.type}</div>;
              case "date":
                return <div key={col}>{item.date}</div>;
              case "time":
                return <div key={col}>{item.time}</div>;
              case "views":
                return (
                  <div key={col} className="text-center">
                    {item.views?.toLocaleString()}
                  </div>
                );
              case "clicks":
                return (
                  <div key={col} className="text-center">
                    {item.clicks?.toLocaleString()}
                  </div>
                );
              case "engagementRate":
                return (
                  <div key={col} className="text-center">
                    {item.engagementRate}
                  </div>
                );
              case "status":
                return (
                  <div
                    key={col}
                    className={`text-xs font-semibold ${
                      item.status === "작성 중" ||
                      item.status === "답변 임시저장"
                        ? "text-yellow-500"
                        : item.status === "검토 대기" ||
                          item.status === "미답변"
                        ? "text-blue-500"
                        : item.status === "피드백 반영 중"
                        ? "text-black"
                        : item.status === "작성 완료" ||
                          item.status === "답변 완료"
                        ? "text-green-600"
                        : "text-gray-400"
                    }`}
                  >
                    {item.status}
                  </div>
                );
              case "visibility":
                return (
                  <div
                    key={col}
                    className={
                      item.visibility === "비공개" ? "text-gray-400" : ""
                    }
                  >
                    {item.visibility}
                  </div>
                );
              case "actions":
                return (
                  <div key={col} className="flex items-center gap-3">
                    <FiEdit2
                      className="cursor-pointer w-4 h-4"
                      onClick={item.onEdit}
                    />
                    <FiTrash2
                      className="cursor-pointer w-4 h-4"
                      onClick={item.onDelete}
                    />
                    {item.onShare && (
                      <FiShare2
                        className="cursor-pointer w-4 h-4 text-gray-500"
                        onClick={item.onShare}
                      />
                    )}
                  </div>
                );
              default:
                return <div key={col} />;
            }
          })}
        </div>
      ))}
    </div>
  );
};

export default AdminContentTable;
