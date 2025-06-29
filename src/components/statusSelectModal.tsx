"use client";

import React, { useState } from "react";

interface StatusSelectModalProps {
  onClose: () => void;
  onSave: (selectedStatus: string) => void;
  defaultStatus?: string;
}

const statusOptions = ["작성 중", "작성 완료", "검토 대기", "피드백 반영 중"];

const StatusSelectModal: React.FC<StatusSelectModalProps> = ({
  onClose,
  onSave,
  defaultStatus = "",
}) => {
  const [selected, setSelected] = useState<string>(defaultStatus);

  const handleSave = () => {
    if (selected) onSave(selected);
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
      <div className="bg-white w-[400px] rounded-xl p-7">
        <h2 className="text-2xl font-bold mb-8">작업 상태를 선택해주세요.</h2>

        <div className="flex flex-col gap-6 mb-6">
          {statusOptions.map((status) => (
            <label
              key={status}
              className="flex justify-between items-center cursor-pointer"
            >
              <span className="text-gray-800">{status}</span>
              <label className="relative w-5 h-5">
                <input
                  type="checkbox"
                  checked={selected === status}
                  onChange={() => setSelected(status)}
                  className="appearance-none w-5 h-5 border border-gray-300 rounded-sm 
               checked:bg-[#555555] checked:border-gray-300 
               hover:border-gray-600 hover:border-2"
                />
                {/* 체크 시 아이콘 이미지 띄우기 */}
                {selected === status && (
                  <img
                    src="/icons/check.png"
                    alt="체크"
                    className="absolute inset-0 w-3 h-3 m-auto pointer-events-none"
                  />
                )}
              </label>
            </label>
          ))}
        </div>

        <hr className="mb-4 border-t border-gray-300" />

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="w-1/2 border-1 border-gray-300  px-6 py-2 rounded text-gray-800 cursor-pointer"
          >
            취소
          </button>
          <button
            onClick={handleSave}
            className="w-1/2 bg-[#FF4545] text-white font-semibold px-6 py-2 rounded cursor-pointer"
          >
            저장하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default StatusSelectModal;
