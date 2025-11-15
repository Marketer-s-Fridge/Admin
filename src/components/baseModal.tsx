"use client";

import React, { useEffect, useState } from "react";

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  closeOnBackdropClick?: boolean; // ✅ 추가 (기본값: true)
}

const BaseModal: React.FC<BaseModalProps> = ({
  isOpen,
  onClose,
  children,
  closeOnBackdropClick = true, // ✅ 기본값
}) => {
  const [visible, setVisible] = useState(false);

  // ✅ fade in/out 트리거 관리
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => setVisible(true), 10); // fade in
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => setVisible(false), 300); // fade out
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // 완전히 닫힌 상태일 땐 렌더하지 않음
  if (!isOpen && !visible) return null;

  return (
    <div
      onClick={() => {
        if (closeOnBackdropClick) onClose(); // ✅ 조건부로 닫기 동작
      }}
      className={`fixed inset-0 z-50 flex items-center justify-center 
        bg-black/30 backdrop-blur-[1px]
        transition-opacity duration-300 
        ${isOpen ? "opacity-100" : "opacity-0"}
      `}
    >
      <div
        onClick={(e) => e.stopPropagation()} // 내부 클릭 시 닫힘 방지
        className={`bg-white rounded-2xl px-10 py-5 shadow-xl text-center transform
          transition-all duration-300
          ${isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"}
        `}
      >
        {children}
      </div>
    </div>
  );
};

export default BaseModal;
