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
  columnLabels?: string[];
  showHeader?: boolean;
  showCheckbox?: boolean;
  columnWidths?: string[];
}

const AdminContentTable: React.FC<AdminContentTableProps> = ({
  data,
  columns,
  columnLabels,
  showHeader = false,
  showCheckbox = false,
  columnWidths,
}) => {
  const defaultColumnWidths: Record<string, string> = {
    id: "minmax(50px,0.5fr)",
    checkbox: "minmax(50px, 0.5fr)",
    image: "minmax(70px, 0.5fr)",
    title: "minmax(180px, 3fr)",
    date: "minmax(100px, 1fr)",
    author: "minmax(100px, 1fr)",
    status: "minmax(80px, 1fr)",
    actions: "minmax(80px, 1fr)",
  };

  const gridTemplate =
    columnWidths?.join(" ") ||
    columns.map((col) => defaultColumnWidths[col] || "1fr").join(" ");

  return (
    <div className="border-t-2 border-gray-500">
      {/* ================== */}
      {/* 데스크탑 테이블 뷰 */}
      {/* ================== */}
      <div className="hidden md:block">
        {showHeader && columnLabels && (
          <div
            className="font-bold text-gray-700 py-2 text-[12px] lg:text-sm border-b-2 border-b-gray-500"
            style={{
              display: "grid",
              gridTemplateColumns: gridTemplate,
              gap: "1rem",
            }}
          >
            {columnLabels.map((label, i) => (
              <div key={i} className="text-center truncate">
                {label}
              </div>
            ))}
          </div>
        )}

        <div className="overflow-x-auto">
          {data.map((item) => (
            <div
              key={item.id}
              onClick={item.onClickRow}
              className="text-center cursor-pointer py-3 items-center text-[12px] lg:text-sm hover:bg-gray-50 text-gray-700"
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
                          className={`
    relative w-5 h-5 appearance-none rounded border-1 border-gray-300 cursor-pointer
    transition-all duration-200
    checked:bg-gray-800 checked:border-gray-800
    before:content-[''] before:absolute before:top-[2px] before:left-[6px]
    before:w-[6px] before:h-[10px]
    before:border-r-2 before:border-b-2 before:border-white
    before:rotate-45 before:scale-0 checked:before:scale-100
    before:transition-transform before:duration-200
  `}
                          checked={item.selected || false}
                          onChange={(e) =>
                            item.onSelectChange?.(e.target.checked)
                          }
                          onClick={(e) => e.stopPropagation()} // 체크만 되고 row 클릭은 막음
                        />
                      </div>
                    ) : (
                      <div key={col} />
                    );
                  case "image":
                    return (
                      <div key={col}>
                        <Image
                          src={item.image || "/images/Category-1.jpg"} // ✅ 여기!
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
                        className="truncate font-semibold flex text-left items-center gap-1 min-w-[100px]"
                      >
                        {item.hasAttachment && (
                          <FiPaperclip className="text-gray-400 w-4 h-4" />
                        )}
                        {item.title}
                      </div>
                    );
                  case "date":
                    return <div key={col}>{item.date}</div>;
                  case "author":
                    return <div key={col}>{item.author}</div>;
                  case "status":
                    return (
                      <div
                        key={col}
                        className={`text-xs font-semibold ${
                          item.status === "작성 완료"
                            ? "text-green-600"
                            : item.status === "작성 중"
                            ? "text-yellow-500"
                            : "text-gray-500"
                        }`}
                      >
                        {item.status}
                      </div>
                    );
                  case "actions":
                    return (
                      <div key={col} className="flex justify-center gap-3">
                        <FiEdit2
                          className="cursor-pointer w-4 h-4"
                          onClick={item.onEdit}
                        />
                        <FiTrash2
                          className="cursor-pointer w-4 h-4"
                          onClick={(e) => {
                            e.stopPropagation();
                            item.onDelete?.();        // ✅ 여기에서 위에서 만든 handleDelete 실행됨
                          }}                          
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
                    return (
                      <div key={col}>
                        {item[col as keyof AdminContentItem] as React.ReactNode}
                      </div>
                    );
                }
              })}
            </div>
          ))}
        </div>
      </div>

      {/* ================== */}
      {/* 모바일 카드 뷰 */}
      {/* ================== */}
      <div className="block md:hidden divide-y divide-gray-200">
        {data.map((item) => (
          <div
            key={item.id}
            className="flex flex-col gap-3 py-4 cursor-pointer px-2"
            onClick={item.onClickRow}
          >
            {/* 이미지 */}
            {columns.includes("image") && (
              <div className="w-full aspect-[3/2] bg-gray-100 rounded-lg overflow-hidden">
                <Image
                  src={"/images/Category-1.jpg"}
                  alt={item.title}
                  width={300}
                  height={200}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* 텍스트 필드 */}
            <div className="flex flex-col gap-1 text-[13px] text-gray-700">
              {columns.map((col, index) => {
                if (col === "image" || col === "checkbox" || col === "actions")
                  return null; // 이미 처리했거나 모바일에서 제외할 항목

                const label = columnLabels?.[index] || col;
                const value = item[col as keyof AdminContentItem] ?? "-";

                // status 컬러 처리
                if (col === "status") {
                  return (
                    <div
                      key={col}
                      className="flex justify-between items-center"
                    >
                      <span className="font-semibold">{label}</span>
                      <span
                        className={`text-xs font-semibold ${
                          value === "작성 완료"
                            ? "text-green-600"
                            : value === "작성 중"
                            ? "text-yellow-500"
                            : "text-gray-500"
                        }`}
                      >
                        {value as string}
                      </span>
                    </div>
                  );
                }

                // 기본 필드
                return (
                  <div
                    key={col}
                    className="flex justify-between items-center border-b border-gray-100 pb-1"
                  >
                    <span className="text-gray-500 font-semibold">{label}</span>
                    <span className="text-gray-700 text-sm text-right max-w-[60%] truncate">
                      {value as string}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* 액션 버튼 */}
            {columns.includes("actions") && (
              <div className="flex justify-end gap-3 text-gray-500 pt-2">
                {item.onEdit && (
                  <FiEdit2
                    className="cursor-pointer w-4 h-4"
                    onClick={(e) => {
                      e.stopPropagation();
                      item.onEdit?.();
                    }}
                  />
                )}
                {item.onDelete && (
                  <FiTrash2
                    className="cursor-pointer w-4 h-4"
                    onClick={(e) => {
                      e.stopPropagation();
                      item.onDelete?.();
                    }}
                  />
                )}
                {item.onShare && (
                  <FiShare2
                    className="cursor-pointer w-4 h-4"
                    onClick={(e) => {
                      e.stopPropagation();
                      item.onShare?.();
                    }}
                  />
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminContentTable;
