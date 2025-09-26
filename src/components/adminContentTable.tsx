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
  const gridTemplate =
    columnWidths?.join(" ") || `repeat(${columns.length}, 1fr)`;

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
                          
                          className="w-4 h-4 accent-gray-800"
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
                          src={item.image || "/images/Category-1.jpg"}
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
            className="flex gap-4 py-4 cursor-pointer"
            onClick={item.onClickRow}
          >
            {/* 체크박스 (모바일 왼쪽) */}
            {showCheckbox && (
              <div className="flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 accent-gray-800"
                  checked={item.selected || false}
                  onChange={(e) => item.onSelectChange?.(e.target.checked)}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            )}

            {/* 썸네일 */}
            <div className="w-20 h-20 flex-shrink-0 rounded-lg bg-gray-100 overflow-hidden">
              <Image
                src={item.image || "/images/Category-1.jpg"}
                alt={item.title}
                width={80}
                height={80}
                className="w-full h-full object-cover"
              />
            </div>

            {/* 텍스트 정보 */}
            <div className="flex flex-col flex-1">
              <h4 className="font-semibold text-sm truncate text-wrap">{item.title}</h4>
              <p className="text-xs text-gray-500">{item.author}</p>
              <p className="text-xs text-gray-400">{item.date}</p>
              {item.status && (
                <span
                  className={`text-[11px] font-medium mt-1 ${
                    item.status === "작성 완료"
                      ? "text-green-600"
                      : item.status === "작성 중"
                      ? "text-yellow-500"
                      : "text-gray-500"
                  }`}
                >
                  {item.status}
                </span>
              )}
            </div>

            {/* 액션 버튼 */}
            <div className="flex flex-col justify-between items-end text-gray-500 text-xs">
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
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminContentTable;
