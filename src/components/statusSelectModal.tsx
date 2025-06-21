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
      <div className="bg-white w-[400px] rounded-xl p-9">
        <h2 className="text-xl font-bold mb-6">작업 상태를 선택해주세요.</h2>

        <div className="flex flex-col gap-6 mb-6">
          {statusOptions.map((status) => (
            <label
              key={status}
              className="flex justify-between items-center cursor-pointer"
            >
              <span className="text-gray-800">{status}</span>
              <input
                type="checkbox"
                checked={selected === status}
                onChange={() => setSelected(status)}
                className="w-5 h-5 accent-gray-600"
              />
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
