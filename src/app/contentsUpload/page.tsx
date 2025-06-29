"use client";

import AdminHeader from "@/components/adminHeader";
import React, { useState, useEffect } from "react";
import AdminCategoryBar from "../../components/adminCategoryBar";
import CustomDropdown from "@/components/customDropdown";
import BookingUploadPopup from "@/components/bookingUploadPopup";
import StatusSelectModal from "@/components/statusSelectModal";

const UploadPage: React.FC = () => {
  const [category, setCategory] = useState("카테고리 선택");
  const [type, setType] = useState("유형 선택");
  const [showBookingPopup, setShowBookingPopup] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [status, setStatus] = useState("");
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const [showImageModal, setShowImageModal] = useState(false);
  const [modalImageUrl, setModalImageUrl] = useState("");

  const [contextMenu, setContextMenu] = useState<{
    visible: boolean;
    x: number;
    y: number;
    index: number | null;
  }>({ visible: false, x: 0, y: 0, index: null });

  const handleDeleteImage = () => {
    if (contextMenu.index !== null) {
      const newImages = [...selectedImages];
      newImages.splice(contextMenu.index, 1);
      setSelectedImages(newImages);
      setContextMenu({ visible: false, x: 0, y: 0, index: null });
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const urls = Array.from(files).map((file) => URL.createObjectURL(file));
      setSelectedImages((prev) => [...prev, ...urls]);
    }
  };

  useEffect(() => {
    const handleClick = () => {
      if (contextMenu.visible) {
        setContextMenu({ visible: false, x: 0, y: 0, index: null });
      }
    };
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, [contextMenu.visible]);

  return (
    <div className="bg-white min-h-screen">
      <AdminHeader />
      <AdminCategoryBar />

      <main className="mx-auto px-[10%] sm:px-[15%] py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* 왼쪽 이미지 영역 */}
          <div className="flex w-[400px] flex-col justify-between">
            <div>
              {/* 대표 이미지 */}
              <div className="relative w-full flex justify-center mb-4">
                {selectedImages.length > 0 ? (
                  <>
                    <img
                      src={selectedImages[0]}
                      className="w-full aspect-[3/4] rounded object-cover"
                      alt="대표 이미지"
                    />
                    <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full">
                      1 / {selectedImages.length}
                    </div>
                  </>
                ) : (
                  <div className="w-full aspect-[3/4] bg-gray-100 rounded flex items-center justify-center text-gray-400">
                    대표 이미지 미리보기
                  </div>
                )}
              </div>

              {/* 썸네일 (대표 이미지 포함) */}
              <div className="w-full flex gap-1 mb-4 relative">
                {selectedImages.map((url, i) => (
                  <img
                    key={i}
                    src={url}
                    onClick={() => {
                      setSelectedIndex(i);
                      setModalImageUrl(url);
                      setShowImageModal(true);
                    }}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      setSelectedIndex(i);

                      const rect = e.currentTarget.getBoundingClientRect();
                      const x = rect.right + window.scrollX - 10;
                      const y = rect.bottom + window.scrollY - 10;

                      setContextMenu({
                        visible: true,
                        x,
                        y,
                        index: i,
                      });
                    }}
                    className={`w-[16%] aspect-[3/4] rounded object-cover cursor-pointer ${
                      selectedIndex === i ? "ring-2 ring-red-500" : ""
                    }`}
                  />
                ))}
              </div>

              {/* 삭제 버튼 */}
              {contextMenu.visible && (
                <div
                  className="cursor-pointer absolute z-50 bg-white shadow-md rounded-lg flex items-center px-3 py-2 text-xs"
                  style={{
                    top: `${contextMenu.y}px`,
                    left: `${contextMenu.x}px`,
                  }}
                  onClick={handleDeleteImage}
                  onContextMenu={(e) => e.preventDefault()}
                >
                  <img
                    src="/icons/trash-2.png"
                    alt="삭제"
                    className="w-4 h-4 mr-2"
                  />
                  <span className="text-gray-700 font-semibold">삭제</span>
                  <span className="ml-5 text-gray-700">Delete</span>
                </div>
              )}
            </div>

            {/* 이미지 업로드 버튼 */}
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
                <div className="absolute right-0 bottom-0 bg-[#555555] text-white px-6 py-3 rounded-lg cursor-pointer text-center">
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
                className="w-full border-b border-gray-400 focus:outline-none focus:border-black mb-6 pb-1.5 sm:text-2xl placeholder:text-gray-400"
              />
              <input
                type="text"
                placeholder="부제목"
                className="w-full border-b border-gray-300 focus:outline-none focus:border-black mb-6 pb-1.5 sm:text-xl placeholder:text-gray-400"
              />

              <div className="place-self-end text-gray-500 flex flex-row w-[60%] gap-2 mb-6">
                <CustomDropdown
                  label={category}
                  options={[
                    "카테고리 선택",
                    "Beauty",
                    "Fashion",
                    "Food",
                    "Lifestyle",
                    "Tech",
                  ]}
                  onSelect={setCategory}
                  buttonClassName="rounded-lg"
                />
                <CustomDropdown
                  label={type}
                  options={[
                    "유형 선택",
                    "마케팅 트렌드",
                    "브랜드 사례",
                    "Food",
                    "Lifestyle",
                  ]}
                  onSelect={setType}
                  buttonClassName="rounded-lg"
                />
              </div>

              <div className="relative">
                <textarea
                  placeholder="콘텐츠 내용 작성"
                  className="w-full aspect-[4/3] border rounded-lg border-gray-300 p-4 resize-none mb-2"
                />
                <div className="absolute right-3 bottom-5 text-right text-sm text-gray-500">
                  0 / 1000
                </div>
              </div>
            </div>

            {/* 하단 버튼 */}
            <div className="flex gap-4 mt-5 justify-between">
              <button
                onClick={() => setShowStatusModal(true)}
                className="border hover:bg-gray-100 active:shadow-md transition border-gray-300 px-6 py-3 rounded-lg cursor-pointer"
              >
                임시 저장
              </button>
              <div className="flex gap-3">
                <button
                  className="bg-[#555555] text-white px-6 py-3 rounded-lg cursor-pointer"
                  onClick={() => setShowBookingPopup(true)}
                >
                  업로드 예약
                </button>
                <button className="bg-[#FF4545] text-white px-6 py-3 rounded-lg font-bold cursor-pointer">
                  업로드
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 이미지 확대 모달 */}
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

        {/* 팝업 및 모달 */}
        {showBookingPopup && (
          <BookingUploadPopup
            onConfirm={() => {
              console.log("예약 업로드 확인됨");
              setShowBookingPopup(false);
            }}
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
              console.log("✅ 선택된 상태:", selected);
            }}
          />
        )}
      </main>
    </div>
  );
};

export default UploadPage;
