// src/app/admin/contentsUpload/page.tsx  (새 글 작성용)
"use client";

import React, { useState } from "react";
import AdminHeader from "@/components/adminHeader";
import AdminCategoryBar from "@/components/adminCategoryBar";
import CustomDropdown from "@/components/customDropdown";
import BookingUploadPopup from "@/components/bookingUploadPopup";
import StatusSelectModal from "@/components/statusSelectModal";
import MobileMenu from "@/components/mobileMenu";
import { PostRequestDto } from "@/features/posts/types";
import { X } from "lucide-react";

// React Query 훅
import { useCreatePost } from "@/features/posts/hooks/admin/useCreatePost";
import { useSchedulePost } from "@/features/posts/hooks/admin/useSchedulePost";
import { useCreateDraft } from "@/features/posts/hooks/admin/useCreateDraft";
// 업로드 유틸
import {
  useImageUpload,
  useMultiImageUpload,
} from "@/features/posts/hooks/useImageUpload";

type MediaType = "image" | "video";

interface MediaItem {
  url: string;
  type: MediaType;
}

const UploadPage: React.FC = () => {
  // const isEdit = false; // 새 글 작성 페이지

  // 업로드 훅 (단건 / 다건)
  const { mutateAsync: uploadSingle } = useImageUpload();
  const { mutateAsync: uploadMulti } = useMultiImageUpload();

  const [category, setCategory] = useState("카테고리 선택");
  const [title, setTitle] = useState("");
  const [subTitle, setSubTitle] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState("");

  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [files, setFiles] = useState<File[]>([]);

  const [menuOpen, setMenuOpen] = useState(false);
  const [showBookingPopup, setShowBookingPopup] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [modalMediaUrl, setModalMediaUrl] = useState("");
  const [modalMediaType, setModalMediaType] = useState<MediaType>("image");

  // React Query 훅들
  const { mutate: uploadPost, isPending: isUploading } = useCreatePost();
  const { mutate: schedulePost, isPending: isScheduling } = useSchedulePost();
  const { mutate: createDraftMutate, isPending: isSavingDraft } =
    useCreateDraft();

  // 이미지/영상 선택
  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files;
    if (!f || !f.length) return;

    const newFiles = Array.from(f);

    const newMediaItems: MediaItem[] = newFiles.map((file) => {
      const objectUrl = URL.createObjectURL(file);
      const type: MediaType = file.type.startsWith("video/")
        ? "video"
        : "image";
      return { url: objectUrl, type };
    });

    setMediaItems((prev) => {
      const next = [...prev, ...newMediaItems];
      if (next.length && selectedIndex === null) setSelectedIndex(0);
      return next;
    });

    setFiles((prev) => [...prev, ...newFiles]);
  };

  // 개별 미디어 삭제
  const handleDeleteMedia = (index: number, e?: React.MouseEvent) => {
    e?.stopPropagation();

    const idx = index;
    const removedItem = mediaItems[idx];

    const newItems = [...mediaItems];
    newItems.splice(idx, 1);
    setMediaItems(newItems);

    if (removedItem?.url?.startsWith("blob:")) {
      const blobBefore = mediaItems
        .slice(0, idx)
        .filter((m) => m.url.startsWith("blob:")).length;

      setFiles((prev) => {
        const copy = [...prev];
        copy.splice(blobBefore, 1);
        return copy;
      });
    }

    setSelectedIndex((prev) => {
      if (prev === null) return null;
      if (prev === idx) return newItems.length ? 0 : null;
      if (prev > idx) return prev - 1;
      return prev;
    });
  };

  // blob만 S3 업로드해서 http(s)로 치환
  async function ensureUploadedUrls(): Promise<string[]> {
    if (!mediaItems.length) return [];

    const blobIdxs: number[] = [];
    mediaItems.forEach((m, i) => {
      if (m.url.startsWith("blob:")) blobIdxs.push(i);
    });

    let uploaded: string[] = [];

    if (blobIdxs.length > 0) {
      if (blobIdxs.length === 1) {
        const file = files[0];
        const url = await uploadSingle(file);
        uploaded = [url];
      } else {
        uploaded = await uploadMulti(files);
      }
    }

    const updatedMedia: MediaItem[] = [];
    let cursor = 0;

    for (const item of mediaItems) {
      if (item.url.startsWith("blob:")) {
        updatedMedia.push({
          ...item,
          url: uploaded[cursor++],
        });
      } else {
        updatedMedia.push(item);
      }
    }

    setMediaItems(updatedMedia);
    setFiles([]);

    return updatedMedia.map((m) => m.url);
  }

  // 임시 저장 (새 글 → /api/posts/drafts POST)
  const handleSaveDraft = async () => {
    if (!title.trim() || !category || category === "카테고리 선택") {
      alert("제목과 카테고리를 입력해주세요.");
      return;
    }

    const mediaUrls = await ensureUploadedUrls();

    const dto: PostRequestDto = {
      title,
      subTitle,
      category,
      type: "ARTICLE",
      content,
      images: mediaUrls,
      postStatus: "DRAFT",
    };

    createDraftMutate(dto, {
      onSuccess: (res) => {
        alert("임시 저장 완료! 📝");
        console.log("✅ 임시 저장 성공:", res);
      },
      onError: (err) => {
        console.error("임시 저장 실패:", err);
        alert("임시 저장 중 오류가 발생했습니다.");
      },
    });
  };

  // 즉시 업로드 (신규 게시)
  const handleUpload = async () => {
    if (!title.trim() || !content.trim() || category === "카테고리 선택") {
      alert("제목, 카테고리, 내용을 입력해주세요!");
      return;
    }

    const mediaUrls = await ensureUploadedUrls();

    const dto: PostRequestDto = {
      title,
      subTitle,
      category,
      type: "ARTICLE",
      content,
      images: mediaUrls,
      postStatus: "PUBLISHED",
    };

    uploadPost(
      { dto }, // ✅ postId 없음 → 신규 게시
      {
        onSuccess: (res) => {
          alert("게시물이 업로드되었습니다!");
          console.log("✅ 업로드 성공:", res);
          resetForm();
        },
        onError: (err) => {
          console.error("게시물 업로드 실패:", err);
          alert("게시물 업로드 중 오류가 발생했습니다.");
        },
      }
    );
  };

  // 예약 업로드 (신규 예약)
  const handleScheduleUpload = async (scheduledTime: string | Date) => {
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

    const mediaUrls = await ensureUploadedUrls();

    const dto: PostRequestDto = {
      title,
      subTitle,
      category,
      type: "ARTICLE",
      content,
      images: mediaUrls,
      postStatus: "SCHEDULED",
      scheduledTime: formattedTime,
    };

    schedulePost(
      { dto }, // ✅ postId 없음 → 새 예약 게시물
      {
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
      }
    );
  };

  // 초기화
  const resetForm = () => {
    setTitle("");
    setSubTitle("");
    setCategory("카테고리 선택");
    setContent("");
    setMediaItems([]);
    setSelectedIndex(null);
    setFiles([]);
  };

  const mainIdx = selectedIndex ?? 0;
  const mainItem = mediaItems[mainIdx];

  return (
    <div className="bg-white min-h-screen">
      <AdminHeader onMenuClick={() => setMenuOpen(!menuOpen)} />
      <AdminCategoryBar />
      <MobileMenu menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      <main className="mx-auto px-[5%] sm:px-[10%] lg:px-[15%] py-12">
        <h1 className="text-2xl font-bold mb-6">새 콘텐츠 업로드</h1>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* 왼쪽 미디어 업로드 */}
          <div className="flex flex-col w-full lg:w-[40%] justify-between">
            <div>
              <div className="hidden lg:flex relative w-full justify-center mb-4">
                {mediaItems.length > 0 && mainItem ? (
                  <>
                    {mainItem.type === "video" ? (
                      <video
                        src={mainItem.url}
                        className="w-full aspect-[3/4] rounded object-cover"
                        controls
                        onClick={(e) => {
                          e.stopPropagation();
                          setModalMediaUrl(mainItem.url);
                          setModalMediaType("video");
                          setShowMediaModal(true);
                        }}
                      />
                    ) : (
                      <img
                        src={mainItem.url}
                        className="w-full aspect-[3/4] rounded object-cover"
                        alt="대표 미디어"
                        onClick={() => {
                          setModalMediaUrl(mainItem.url);
                          setModalMediaType("image");
                          setShowMediaModal(true);
                        }}
                      />
                    )}
                    <div className="absolute top-3 right-3 bg-white/60 text-gray text-xs px-3 py-0.5 rounded-full">
                      {mainIdx + 1} / {mediaItems.length}
                    </div>
                  </>
                ) : (
                  <div className="w-full aspect-[3/4] bg-gray-100 rounded flex items-center justify-center text-gray-400">
                    대표 미리보기
                  </div>
                )}
              </div>

              {/* 썸네일 리스트 */}
              <div className="w-full flex gap-1 mb-4 relative overflow-x-auto">
                {mediaItems.map((item, i) => (
                  <div
                    key={i}
                    className={`relative w/[16%] aspect-[3/4] rounded overflow-hidden cursor-pointer ${
                      selectedIndex === i ? "ring-2 ring-red-500" : ""
                    }`}
                    onClick={() => {
                      setSelectedIndex(i);
                      setModalMediaUrl(item.url);
                      setModalMediaType(item.type);
                      setShowMediaModal(true);
                    }}
                  >
                    {item.type === "video" ? (
                      <video
                        src={item.url}
                        className="w-full h-full object-cover"
                        muted
                      />
                    ) : (
                      <img
                        src={item.url}
                        className="w-full h-full object-cover"
                        alt={`썸네일-${i + 1}`}
                      />
                    )}
                    <button
                      className="cursor-pointer absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 text-white flex items-center justify-center"
                      onClick={(e) => handleDeleteMedia(i, e)}
                      type="button"
                      aria-label="미디어 삭제"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* 업로드 버튼 */}
            <div className="relative h-[48px] mt-6">
              <input
                type="file"
                accept="image/*,video/*"
                multiple
                id="media-upload"
                className="hidden"
                onChange={handleMediaUpload}
              />
              <label htmlFor="media-upload">
                <div className="absolute right-0 bottom-0 bg-[#555555] text-white text-medium lg:text-base px-4 py-2 lg:px-6 lg:py-3 rounded-lg cursor-pointer text-center">
                  이미지/영상 업로드
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
                className="w-full aspect/[4/3] border rounded-lg border-gray-300 p-4 resize-none mb-2"
              />
            </div>

            {/* 하단 버튼 */}
            <div className="text-medium lg:text-base flex gap-4 mt-5 justify-between">
              <div className="flex gap-3">
                <button
                  onClick={handleSaveDraft}
                  disabled={isSavingDraft}
                  className="border hover:bg-gray-100 active:shadow-md transition border-gray-300 px-4 py-2 lg:px-6 lg:py-3 rounded-lg cursor-pointer"
                >
                  {isSavingDraft ? "저장 중..." : "임시 저장"}
                </button>
              </div>

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

        {/* 이미지/영상 확대 모달 */}
        {showMediaModal && (
          <div
            className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-xs flex justify-center items-center"
            onClick={() => setShowMediaModal(false)}
          >
            <div
              className="max-w-[90vw] max-h-[90vh] rounded shadow-lg bg-black flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              {modalMediaType === "video" ? (
                <video
                  src={modalMediaUrl}
                  className="max-w-full max-h-[90vh]"
                  controls
                  autoPlay
                />
              ) : (
                <img
                  src={modalMediaUrl}
                  alt="미리보기"
                  className="max-w-full max-h/[90vh] object-contain"
                />
              )}
            </div>
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
