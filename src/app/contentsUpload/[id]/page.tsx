// src/app/admin/contentsUpload/[[...id]]/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import AdminHeader from "@/components/adminHeader";
import AdminCategoryBar from "@/components/adminCategoryBar";
import CustomDropdown from "@/components/customDropdown";
import BookingUploadPopup from "@/components/bookingUploadPopup";
import StatusSelectModal from "@/components/statusSelectModal";
import MobileMenu from "@/components/mobileMenu";
import { PostRequestDto } from "@/features/posts/types";
import { usePost } from "@/features/posts/hooks/usePost";
import { X } from "lucide-react";

// React Query 훅
import { useCreatePost } from "@/features/posts/hooks/admin/useCreatePost";
import { useSchedulePost } from "@/features/posts/hooks/admin/useSchedulePost";
import { useUpdateDraft } from "@/features/posts/hooks/admin/useUpdateDraft";
import { useSetEditorPick } from "@/features/posts/hooks/useSetEditorPick";

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
  // ✅ URL 파라미터에서 id 읽기 ([id] 라우트)
  const params = useParams<{ id: string }>();
  const rawId = params.id; // 예: "21"
  const postId = Number(rawId);
  const isEdit = true; // 이 페이지는 항상 수정

  // 업로드 훅 (단건 / 다건)
  const { mutateAsync: uploadSingle } = useImageUpload();
  const { mutateAsync: uploadMulti } = useMultiImageUpload();

  // ✅ 기존 게시글 조회
  const {
    data: post,
    isLoading: isPostLoading,
    error: postError,
  } = usePost(postId);

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
  const [showImageModal, setShowImageModal] = useState(false);
  const [modalImageUrl, setModalImageUrl] = useState("");
  const [modalMediaType, setModalMediaType] = useState<MediaType>("image");

  // ✅ 에디터 픽 상태
  const [editorPick, setEditorPick] = useState(false);

  // React Query 훅들
  const { mutate: uploadPost, isPending: isUploading } = useCreatePost();
  const { mutate: schedulePost, isPending: isScheduling } = useSchedulePost();
  const { mutate: saveDraft, isPending: isSavingDraft } = useUpdateDraft();
  const { mutate: setEditorPickMutate, isPending: isSettingEditorPick } =
    useSetEditorPick();

  // ✅ 수정 모드일 때, 기존 게시글 데이터를 폼에 세팅
  useEffect(() => {
    if (!isEdit || !post) return;

    setTitle(post.title || "");
    setSubTitle(post.subTitle || "");
    setCategory(post.category || "카테고리 선택");
    setContent(post.content || "");

    if (post.images && post.images.length > 0) {
      const initialMedia: MediaItem[] = post.images.map((url: string) => ({
        url,
        type: "image",
      }));
      setMediaItems(initialMedia);
      setSelectedIndex(0);
      setFiles([]);
    }

    setEditorPick(!!post.editorPick);
  }, [isEdit, post]);

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

  // 임시 저장
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

    saveDraft(
      { id: postId, dto },
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

  // 에디터 픽 토글
  const handleToggleEditorPick = () => {
    if (!postId) return;

    setEditorPickMutate(
      { postId, editorPick: !editorPick },
      {
        onSuccess: (res) => {
          setEditorPick(!!res.editorPick);
          alert(
            res.editorPick
              ? "에디터 픽으로 설정되었습니다."
              : "에디터 픽이 해제되었습니다."
          );
        },
        onError: (err) => {
          console.error("에디터 픽 설정 실패:", err);
          alert("에디터 픽 설정 중 오류가 발생했습니다.");
        },
      }
    );
  };

  // 즉시 업로드(수정)
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
      {
        dto,
        postId: isEdit ? postId : undefined, // 🔥 여기서 postId → Query
        // etag: 필요하면 여기 추가
      },
      {
        onSuccess: (res) => {
          alert(
            isEdit ? "게시물이 수정되었습니다!" : "게시물이 업로드되었습니다!"
          );
          console.log("업로드 성공:", res);
          if (!isEdit) resetForm();
        },
        onError: (err) => {
          console.error("업로드 실패:", err);
          alert("게시물 업로드 중 오류가 발생했습니다.");
        },
      }
    );
  };

  // 예약 업로드(수정)
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

    // 🔥 여기 수정: dto 하나만 넘기지 말고 객체로 넘기기
    schedulePost(
      {
        dto,
        postId: isEdit ? postId : undefined,
        // etag: 필요하면 여기 추가
      },
      {
        onSuccess: (res) => {
          alert(
            isEdit ? "예약 정보가 수정되었습니다!" : "게시물이 예약되었습니다!"
          );
          console.log("✅ 예약 업로드 성공:", res);
          setShowBookingPopup(false);
          if (!isEdit) resetForm();
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

  // 수정 모드에서 로딩/에러 처리
  if (isEdit && isPostLoading) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        불러오는 중...
      </div>
    );
  }

  if (isEdit && postError) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        게시글 정보를 불러오지 못했습니다.
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <AdminHeader onMenuClick={() => setMenuOpen(!menuOpen)} />
      <AdminCategoryBar />
      <MobileMenu menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      <main className="mx-auto px-[5%] sm:px-[10%] lg:px-[15%] py-12">
        <h1 className="text-2xl font-bold mb-6">
          {isEdit ? `콘텐츠 수정 (#${postId})` : "새 콘텐츠 업로드"}
        </h1>

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
                          setModalImageUrl(mainItem.url);
                          setModalMediaType("video");
                          setShowImageModal(true);
                        }}
                      />
                    ) : (
                      <img
                        src={mainItem.url}
                        className="w-full aspect-[3/4] rounded object-cover"
                        alt="대표 미디어"
                        onClick={() => {
                          setModalImageUrl(mainItem.url);
                          setModalMediaType("image");
                          setShowImageModal(true);
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
                    className={`relative w-[16%] aspect-[3/4] rounded overflow-hidden cursor-pointer ${
                      selectedIndex === i ? "ring-2 ring-red-500" : ""
                    }`}
                    onClick={() => {
                      setSelectedIndex(i);
                      setModalImageUrl(item.url);
                      setModalMediaType(item.type);
                      setShowImageModal(true);
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
                className="w-full aspect-[4/3] border rounded-lg border-gray-300 p-4 resize-none mb-2"
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

                {isEdit && (
                  <button
                    onClick={handleToggleEditorPick}
                    disabled={isSettingEditorPick}
                    className={`border px-4 py-2 lg:px-6 lg:py-3 rounded-lg cursor-pointer transition ${
                      editorPick
                        ? "border-[#FF4545] text-[#FF4545] hover:bg-red-50"
                        : "border-gray-300 text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {isSettingEditorPick
                      ? "처리 중..."
                      : editorPick
                      ? "에디터 픽 해제"
                      : "에디터 픽 지정"}
                  </button>
                )}
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
                  {isUploading
                    ? isEdit
                      ? "수정 중..."
                      : "업로드 중..."
                    : isEdit
                    ? "수정하기"
                    : "업로드"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 이미지/영상 확대 모달 */}
        {showImageModal && (
          <div
            className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-xs flex justify-center items-center"
            onClick={() => setShowImageModal(false)}
          >
            <div
              className="max-w-[90vw] max-h-[90vh] rounded shadow-lg bg-black flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              {modalMediaType === "video" ? (
                <video
                  src={modalImageUrl}
                  className="max-w-full max-h-[90vh]"
                  controls
                  autoPlay
                />
              ) : (
                <img
                  src={modalImageUrl}
                  alt="미리보기"
                  className="max-w-full max-h-[90vh] object-contain"
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
