// components/DeleteConfirmModal.tsx
"use client";

import BaseModal from "@/components/baseModal";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
}: DeleteConfirmModalProps) {
  return (
    <BaseModal isOpen={isOpen} onClose={onClose}>
      <div className="text-center">
        <p className="text-lg font-semibold mb-4">정말 삭제하시겠습니까?</p>

        <div className="flex justify-center gap-4 mt-3">
          <button
            className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700"
            onClick={onClose}
          >
            취소
          </button>

          <button
            className="px-4 py-2 rounded-lg bg-red-500 text-white"
            onClick={onConfirm}
          >
            삭제
          </button>
        </div>
      </div>
    </BaseModal>
  );
}
