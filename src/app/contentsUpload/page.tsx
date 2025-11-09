// src/app/admin/upload/page.tsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import AdminHeader from "@/components/adminHeader";
import AdminCategoryBar from "@/components/adminCategoryBar";
import CustomDropdown from "@/components/customDropdown";
import BookingUploadPopup from "@/components/bookingUploadPopup";
import StatusSelectModal from "@/components/statusSelectModal";
import MobileMenu from "@/components/mobileMenu";
import { PostRequestDto } from "@/features/posts/types";
import { useCreatePost } from "@/features/posts/hooks/admin/useCreatePost";
import { useSchedulePost } from "@/features/posts/hooks/admin/useSchedulePost";
import { useUpdateDraft } from "@/features/posts/hooks/admin/useUpdateDraft";

const UploadPage: React.FC = () => {
  const [category, setCategory] = useState("카테고리 선택");
  const [title, setTitle] = useState("");
  const [subTitle, setSubTitle] = useState("");
  const [type, setType] = useState<"ARTICLE" | "VIDEO" | string>("ARTICLE");
  const [content, setContent] = useState("");
  const [images, setImages] = useState<string[]>([]); // S3 URL 배열
  const [editorPick, setEditorPick] = useState(false);
  const [workflowStatus, setWorkflowStatus] = useState("");

  const [menuOpen, setMenuOpen] = useState(false);
  const [showBookingPopup, setShowBookingPopup] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [modalImageUrl, setModalImageUrl] = useState("");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const { mutate: publishMutate, isPending: isPublishing } = useCreatePost();
  const { mutate: scheduleMutate, isPending: isScheduling } = useSchedulePost();
  const { mutate: draftMutate, isPending: isSavingDraft } = useUpdateDraft();

  // URL 추가용 입력
  const [imageUrlInput, setImageUrlInput] = useState("");

  const addImageUrl = () => {
    const v = imageUrlInput.trim();
    if (!v) return;
    setImages((prev) => [...prev, v]);
    setImageUrlInput("");
    if (selectedIndex === null) setSelectedIndex(0);
  };

  const deleteImageAt = (idx: number) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
    setSelectedIndex((prev) => {
      if (prev === null) return null;
      if (prev === idx) return 0;
      if (prev > idx) return prev - 1;
      return prev;
    });
  };

  const mainIdx = useMemo(() => selectedIndex ?? 0, [selectedIndex]);

  // 검증 규칙: 명세 기준
  const validateForPublishOrSchedule = () => {
    if (!title.trim()) return alert("제목을 입력하세요."), false;
    if (!category || category === "카테고리 선택") return alert("카테고리를 선택하세요."), false;
    if (!type || !String(type).trim()) return alert("타입을 입력하세요."), false;
    if (!content.trim()) return alert("내용을 입력하세요."), false;
    return true;
  };
  const validateForDraft = () => {
    if (!title.trim()) return alert("제목을 입력하세요."), false;
    if (!category || category === "카테고리 선택") return alert("카테고리를 선택하세요."), false;
    return true;
  };

  const buildDto = (overrides?: Partial<PostRequestDto>): PostRequestDto => ({
    title,
    subTitle,
    category,
    type,
    content,
    images,
    editorPick,
    workflowStatus,
    ...overrides,
  });

  const resetForm = () => {
    setTitle("");
    setSubTitle("");
    setCategory("카테고리 선택");
    setType("ARTICLE");
    setContent("");
    setImages([]);
    setEditorPick(false);
    setWorkflowStatus("");
    setSelectedIndex(null);
  };

  // 임시 저장
  const handleSaveDraft = () => {
    if (!validateForDraft()) return;
    const dto = buildDto({ postStatus: "DRAFT" });
    draftMutate(
      { dto }, // 신규 초안 생성. 기존 초안 수정 시 {id, dto}
      {
        onSuccess: () => alert("임시 저장 완료"),
        onError: () => alert("임시 저장 중 오류"),
      }
    );
  };

  // 즉시 발행
  const handlePublish = () => {
    if (!validateForPublishOrSchedule()) return;
    const dto = buildDto({ postStatus: "PUBLISHED" });
    publishMutate(dto, {
      onSuccess: () => {
        alert("게시 완료");
        resetForm();
      },
      onError: () => alert("게시 중 오류"),
    });
  };

  // 예약 발행
  const handleScheduleUpload = (time: string | Date) => {
    if (!validateForPublishOrSchedule()) return;
    if (!time) return alert("예약 시간을 선택하세요.");
    const iso =
      time instanceof Date ? time.toISOString() : new Date(time).toISOString();
    const dto = buildDto({ postStatus: "SCHEDULED", scheduledTime: iso });
    scheduleMutate(dto, {
      onSuccess: () => {
        alert("예약 완료");
        setShowBookingPopup(false);
        resetForm();
      },
      onError: () => alert("예약 중 오류"),
    });
  };

  useEffect(() => {
    if (!showImageModal) setModalImageUrl("");
  }, [showImageModal]);

  return (
    <div className="bg-white min-h-screen">
      <AdminHeader onMenuClick={() => setMenuOpen((p) => !p)} />
      <AdminCategoryBar />
      <MobileMenu menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      <main className="mx-auto px-[5%] sm:px-[10%] lg:px-[15%] py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* 왼쪽: 이미지 미리보기 */}
          <div className="flex flex-col w-full lg:w-[40%] justify-between">
            <div className="relative w-full flex justify-center mb-4">
              {images.length ? (
                <>
                  <img
                    src={images[mainIdx]}
                    className="w-full aspect-[3/4] rounded object-cover"
                    alt="대표 이미지"
                    onClick={() => {
                      setModalImageUrl(images[mainIdx]);
                      setShowImageModal(true);
                    }}
                  />
                  <div className="absolute top-3 right-3 bg-white/60 text-gray text-xs px-3 py-0.5 rounded-full">
                    {mainIdx + 1} / {images.length}
                  </div>
                </>
              ) : (
                <div className="w-full aspect-[3/4] bg-gray-100 rounded flex items-center justify-center text-gray-400">
                  대표 이미지 미리보기
                </div>
              )}
            </div>

            {/* 썸네일 */}
            <div className="w-full flex gap-1 mb-4 overflow-x-auto">
              {images.map((url, i) => (
                <div key={i} className="relative">
                  <img
                    src={url}
                    onClick={() => setSelectedIndex(i)}
                    className={`w-[16%] aspect-[3/4] rounded object-cover cursor-pointer ${
                      (selectedIndex ?? 0) === i ? "ring-2 ring-red-500" : ""
                    }`}
                    alt={`이미지-${i + 1}`}
                  />
                  <button
                    onClick={() => deleteImageAt(i)}
                    className="absolute -top-2 -right-2 bg-white rounded-full shadow px-2 py-1 text-xs"
                    aria-label="삭제"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            {/* URL 추가 */}
            <div className="flex gap-2">
              <input
                type="url"
                placeholder="이미지 URL 붙여넣기"
                value={imageUrlInput}
                onChange={(e) => setImageUrlInput(e.target.value)}
                className="flex-1 border rounded-lg border-gray-300 p-3"
              />
              <button
                onClick={addImageUrl}
                className="bg-[#555555] text-white px-4 rounded-lg"
              >
                추가
              </button>
            </div>
          </div>

          {/* 오른쪽: 입력 */}
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
              <div className="grid grid-cols-2 gap-3 mb-6">
                <CustomDropdown
                  label={category}
                  options={["Beauty", "Fashion", "Food", "Lifestyle", "Tech"]}
                  onSelect={setCategory}
                  buttonClassName="rounded-lg"
                />
                <CustomDropdown
                  label={type}
                  options={["ARTICLE", "VIDEO"]}
                  onSelect={(v) => setType(v)}
                  buttonClassName="rounded-lg"
                />
              </div>

              <textarea
                placeholder="콘텐츠 내용 작성"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full aspect-[4/3] border rounded-lg border-gray-300 p-4 resize-none mb-3"
              />

              <div className="flex items-center gap-3 mb-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={editorPick}
                    onChange={(e) => setEditorPick(e.target.checked)}
                  />
                  <span>에디터 픽</span>
                </label>

                <button
                  onClick={() => setShowStatusModal(true)}
                  className="border px-3 py-2 rounded-lg"
                >
                  작업상태 설정
                </button>
                {workflowStatus && (
                  <span className="text-sm text-gray-600">현재: {workflowStatus}</span>
                )}
              </div>
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
                  onClick={handlePublish}
                  disabled={isPublishing}
                  className="bg-[#FF4545] text-white px-4 py-2 lg:px-6 lg:py-3 rounded-lg font-medium cursor-pointer"
                >
                  {isPublishing ? "업로드 중..." : "업로드"}
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

        {/* 팝업들 */}
        {showBookingPopup && (
          <BookingUploadPopup
            onConfirm={(t) => handleScheduleUpload(t)}
            onClose={() => setShowBookingPopup(false)}
          />
        )}
        {showStatusModal && (
          <StatusSelectModal
            defaultStatus={workflowStatus}
            onClose={() => setShowStatusModal(false)}
            onSave={(sel) => {
              setWorkflowStatus(sel);
              setShowStatusModal(false);
            }}
          />
        )}
      </main>
    </div>
  );
};

export default UploadPage;
