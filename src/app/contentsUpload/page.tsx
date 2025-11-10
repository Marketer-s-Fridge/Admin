// src/app/admin/upload/page.tsx
"use client";

import React, { useState } from "react";
import AdminHeader from "@/components/adminHeader";
import AdminCategoryBar from "../../components/adminCategoryBar";
import CustomDropdown from "@/components/customDropdown";
import BookingUploadPopup from "@/components/bookingUploadPopup";
import StatusSelectModal from "@/components/statusSelectModal";
import MobileMenu from "@/components/mobileMenu";
import { PostRequestDto } from "@/features/posts/types";

// ✅ React Query 훅 import
import { useCreatePost } from "@/features/posts/hooks/admin/useCreatePost";
import { useSchedulePost } from "@/features/posts/hooks/admin/useSchedulePost";
import { useUpdateDraft } from "@/features/posts/hooks/admin/useUpdateDraft";

const UploadPage: React.FC = () => {
  const [category, setCategory] = useState("카테고리 선택");
  const [title, setTitle] = useState("");
  const [subTitle, setSubTitle] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState("");
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showBookingPopup, setShowBookingPopup] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [modalImageUrl, setModalImageUrl] = useState("");
  const [contextMenu, setContextMenu] = useState<{
    visible: boolean;
    x: number;
    y: number;
    index: number | null;
  }>({ visible: false, x: 0, y: 0, index: null });

  // ✅ React Query 훅들
  const { mutate: uploadPost, isPending: isUploading } = useCreatePost();
  const { mutate: schedulePost, isPending: isScheduling } = useSchedulePost();
  const { mutate: saveDraft, isPending: isSavingDraft } = useUpdateDraft();

  // ✅ 이미지 업로드 (미리보기용: blob URL)
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const urls = Array.from(files).map((file) => URL.createObjectURL(file));
      setSelectedImages((prev) => {
        const next = [...prev, ...urls];
        if (next.length && selectedIndex === null) setSelectedIndex(0);
        return next;
      });
    }
  };

  // ✅ 이미지 삭제
  const handleDeleteImage = () => {
    if (contextMenu.index !== null) {
      const newImages = [...selectedImages];
      newImages.splice(contextMenu.index, 1);
      setSelectedImages(newImages);
      // 선택 인덱스 보정
      setSelectedIndex((prev) => {
        if (prev === null) return null;
        if (prev === contextMenu.index) return newImages.length ? 0 : null;
        if (prev > (contextMenu.index as number)) return prev - 1;
        return prev;
      });
      setContextMenu({ visible: false, x: 0, y: 0, index: null });
    }
  };

  // ✅ 우클릭 시 메뉴 표시
  const handleContextMenu = (e: React.MouseEvent, index: number) => {
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    setContextMenu({
      visible: true,
      x: rect.right + window.scrollX - 10,
      y: rect.bottom + window.scrollY - 10,
      index,
    });
  };

  // ✅ 임시 저장 (React Query)
  const handleSaveDraft = () => {
    if (!title.trim() || !category || category === "카테고리 선택") {
      alert("제목과 카테고리를 입력해주세요.");
      return;
    }

    const dto: PostRequestDto = {
      title,
      subTitle,
      category,
      type: "ARTICLE",
      content,
      images: selectedImages, // 주의: 실제 배포 시엔 S3 URL 등 실 URL로 교체 필요
      postStatus: "DRAFT",
    };

    // id 없이 호출 → 신규 초안 생성
    saveDraft(
      { dto },
      {
        onSuccess: (res) => {
          alert("임시 저장 완료! 📝");
          console.log("✅ 임시 저장 성공:", res);
        },
        onError: (err) => {
          console.error("임시 저장 실패:", err);
          alert("임시 저장 중 오류가 발생했습니다.");
        },
      }
    );
  };

  // ✅ 게시물 업로드 (React Query)
  const handleUpload = () => {
    if (!title.trim() || !content.trim() || category === "카테고리 선택") {
      alert("제목, 카테고리, 내용을 입력해주세요!");
      return;
    }

    const dto: PostRequestDto = {
      title,
      subTitle,
      category,
      type: "ARTICLE",
      content,
      images: selectedImages, // 주의: 실제 배포 시엔 S3 URL 등 실 URL로 교체 필요
      postStatus: "PUBLISHED",
    };

    uploadPost(dto, {
      onSuccess: (res) => {
        alert("게시물이 성공적으로 업로드되었습니다!");
        console.log("✅ 업로드 성공:", res);
        resetForm();
      },
      onError: (err) => {
        console.error("게시물 업로드 실패:", err);
        alert("게시물 업로드 중 오류가 발생했습니다.");
      },
    });
  };

  // ✅ 예약 업로드 (React Query)
  const handleScheduleUpload = (scheduledTime: string | Date) => {
    if (!scheduledTime) {
      alert("예약 시간을 선택해주세요.");
      return;
    }
    if (!title.trim() || !content.trim() || category === "카테고리 선택") {
      alert("제목, 카테고리, 내용을 입력해주세요!");
      return;
    }

    const formattedTime =
      scheduledTime instanceof Date
        ? scheduledTime.toISOString()
        : new Date(scheduledTime).toISOString();

    const dto: PostRequestDto = {
      title,
      subTitle,
      category,
      type: "ARTICLE",
      content,
      images: selectedImages, // 주의
      postStatus: "SCHEDULED",
      scheduledTime: formattedTime,
    };

    schedulePost(dto, {
      onSuccess: (res) => {
        alert("게시물이 예약되었습니다!");
        console.log("✅ 예약 업로드 성공:", res);
        setShowBookingPopup(false);
        resetForm();
      },
      onError: (err) => {
        console.error("예약 업로드 실패:", err);
        alert("예약 업로드 중 오류가 발생했습니다.");
      },
    });
  };

  // ✅ 입력 초기화
  const resetForm = () => {
    setTitle("");
    setSubTitle("");
    setCategory("카테고리 선택");
    setContent("");
    setSelectedImages([]);
    setSelectedIndex(null);
  };

  const mainIdx = selectedIndex ?? 0;

  return (
    <div className="bg-white min-h-screen">
      <AdminHeader onMenuClick={() => setMenuOpen(!menuOpen)} />
      <AdminCategoryBar />
      <MobileMenu menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      <main className="mx-auto px-[5%] sm:px-[10%] lg:px-[15%] py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* 왼쪽 이미지 업로드 */}
          <div className="flex flex-col w-full lg:w-[40%] justify-between">
            <div>
              <div className="relative w-full flex justify-center mb-4">
                {selectedImages.length > 0 ? (
                  <>
                    <img
                      src={selectedImages[mainIdx]}
                      className="w-full aspect-[3/4] rounded object-cover"
                      alt="대표 이미지"
                      onClick={() => {
                        setModalImageUrl(selectedImages[mainIdx]);
                        setShowImageModal(true);
                      }}
                    />
                    <div className="absolute top-3 right-3 bg-white/60 text-gray text-xs px-3 py-0.5 rounded-full">
                      {mainIdx + 1} / {selectedImages.length}
                    </div>
                  </>
                ) : (
                  <div className="w-full aspect-[3/4] bg-gray-100 rounded flex items-center justify-center text-gray-400">
                    대표 이미지 미리보기
                  </div>
                )}
              </div>

              {/* 썸네일 */}
              <div className="w-full flex gap-1 mb-4 relative overflow-x-auto">
                {selectedImages.map((url, i) => (
                  <img
                    key={i}
                    src={url}
                    onClick={() => {
                      setSelectedIndex(i);
                      setModalImageUrl(url);
                      setShowImageModal(true);
                    }}
                    onContextMenu={(e) => handleContextMenu(e, i)}
                    className={`w-[16%] aspect-[3/4] rounded object-cover cursor-pointer ${
                      selectedIndex === i ? "ring-2 ring-red-500" : ""
                    }`}
                    alt={`썸네일-${i + 1}`}
                  />
                ))}
              </div>

              {/* 삭제 메뉴 */}
              {contextMenu.visible && (
                <div
                  className="cursor-pointer absolute z-50 bg-white shadow-md rounded-lg flex items-center px-3 py-2 text-xs"
                  style={{
                    top: `${contextMenu.y}px`,
                    left: `${contextMenu.x}px`,
                  }}
                  onClick={handleDeleteImage}
                >
                  <img
                    src="/icons/trash-2.png"
                    alt="삭제"
                    className="w-4 h-4 mr-2"
                  />
                  <span className="text-gray-700 font-semibold">삭제</span>
                </div>
              )}
            </div>

            {/* 업로드 버튼 */}
            <div className="relative h-[48px] mt-6">
              <input
                type="file"
                accept="image/*"
                multiple
                id="image-upload"
                className="hidden"
                onChange={handleImageUpload}
              />
              <label htmlFor="image-upload">
                <div className="absolute right-0 bottom-0 bg-[#555555] text-white text-medium lg:text-base px-4 py-2 lg:px-6 lg:py-3 rounded-lg cursor-pointer text-center">
                  이미지 업로드
                </div>
              </label>
            </div>
          </div>

          {/* 오른쪽 입력 영역 */}
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <input
                type="text"
                placeholder="제목"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border-b border-gray-400 focus:outline-none focus:border-black mb-5 pb-1.5 sm:text-3xl placeholder:text-gray-400"
              />
              <input
                type="text"
                placeholder="부제목"
                value={subTitle}
                onChange={(e) => setSubTitle(e.target.value)}
                className="w-full border-b border-gray-300 focus:outline-none focus:border-black mb-5 pb-1.5 sm:text-xl placeholder:text-gray-400"
              />
              <div className="place-self-end text-gray-500 flex flex-row w-[35%] gap-2 mb-6">
                <CustomDropdown
                  label={category}
                  options={["Beauty", "Fashion", "Food", "Lifestyle", "Tech"]}
                  onSelect={setCategory}
                  buttonClassName="rounded-lg"
                />
              </div>

              <textarea
                placeholder="콘텐츠 내용 작성"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full aspect-[4/3] border rounded-lg border-gray-300 p-4 resize-none mb-2"
              />
            </div>

            {/* 하단 버튼 */}
            <div className="text-medium lg:text-base flex gap-4 mt-5 justify-between">
              <button
                onClick={handleSaveDraft}
                disabled={isSavingDraft}
                className="border hover:bg-gray-100 active:shadow-md transition border-gray-300 px-4 py-2 lg:px-6 lg:py-3 rounded-lg cursor-pointer"
              >
                {isSavingDraft ? "저장 중..." : "임시 저장"}
              </button>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowBookingPopup(true)}
                  disabled={isScheduling}
                  className="bg-[#555555] text-white px-4 py-2 lg:px-6 lg:py-3 rounded-lg cursor-pointer"
                >
                  {isScheduling ? "예약 중..." : "예약 업로드"}
                </button>
                <button
                  onClick={handleUpload}
                  disabled={isUploading}
                  className="bg-[#FF4545] text-white px-4 py-2 lg:px-6 lg:py-3 rounded-lg font-medium cursor-pointer"
                >
                  {isUploading ? "업로드 중..." : "업로드"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 이미지 확대 모달: blob URL은 next/image 미지원 → <img> 사용 */}
        {showImageModal && (
          <div
            className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-xs flex justify-center items-center"
            onClick={() => setShowImageModal(false)}
          >
            <img
              src={modalImageUrl}
              alt="미리보기"
              className="max-w-[70%] max-h-[70%] rounded shadow-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        )}

        {/* 팝업 */}
        {showBookingPopup && (
          <BookingUploadPopup
            onConfirm={(time) => handleScheduleUpload(time)}
            onClose={() => setShowBookingPopup(false)}
          />
        )}
        {showStatusModal && (
          <StatusSelectModal
            defaultStatus={status}
            onClose={() => setShowStatusModal(false)}
            onSave={(selected) => {
              setStatus(selected);
              setShowStatusModal(false);
            }}
          />
        )}
      </main>
    </div>
  );
};

export default UploadPage;
