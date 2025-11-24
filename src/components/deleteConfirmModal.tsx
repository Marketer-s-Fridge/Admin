// components/DeleteConfirmModal.tsx
"use client";

import { useState, useEffect } from "react";
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
  // 1단계: 일반 경고 / 2단계: 되돌릴 수 없음 최종 경고
  const [step, setStep] = useState<1 | 2>(1);

  // 모달이 닫힐 때마다 단계 초기화
  useEffect(() => {
    if (!isOpen) {
      setStep(1);
    }
  }, [isOpen]);

  const handleClose = () => {
    setStep(1);
    onClose();
  };

  const handleFirstConfirm = () => {
    setStep(2);
  };

  const handleFinalConfirm = () => {
    onConfirm();
    setStep(1);
    onClose();
  };

  return (
    <BaseModal isOpen={isOpen} onClose={handleClose}>
      <div className="text-center mx-4">
        {step === 1 ? (
          <>
            <p className="text-lg font-semibold my-8">
              정말 삭제하시겠습니까?
            </p>
            <div className="flex justify-center gap-4 mt-3">
              <button
                className="cursor-pointer px-5 py-1.5 rounded-lg bg-gray-200 text-gray-700"
                onClick={handleClose}
              >
                취소
              </button>
              <button
                className="cursor-pointer px-5 py-1.5 rounded-lg bg-red-500 text-white"
                onClick={handleFirstConfirm}
              >
                삭제
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="text-lg font-semibold mt-4 mb-3">
              정말로 삭제하시겠습니까?
            </p>
            <p className="text-sm text-gray-600 mb-6">
              삭제 후에는 되돌릴 수 없습니다.{" "}
              <br className="hidden md:block" />
              그래도 삭제하시겠어요?
            </p>
            <div className="flex justify-center gap-4 mt-3">
              <button
                className="cursor-pointer px-5 py-1.5 rounded-lg bg-gray-200 text-gray-700"
                onClick={handleClose}
              >
                취소
              </button>
              <button
                className="cursor-pointer px-5 py-1.5 rounded-lg bg-red-600 text-white font-semibold"
                onClick={handleFinalConfirm}
              >
                네, 삭제할게요
              </button>
            </div>
          </>
        )}
      </div>
    </BaseModal>
  );
}
