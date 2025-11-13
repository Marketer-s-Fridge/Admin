"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import AdminHeader from "@/components/adminHeader";
import Breadcrumb from "@/components/breadCrumb";
import { FiPaperclip } from "react-icons/fi";
import { useEnquiry } from "@/features/enquiries/hooks/useEnquiry";

// 댓글 훅들 (새 스펙 기준)
import {
  useComments,
  useCreateDraftComment,
  useUpdateDraftComment,
  useCreatePublishComment,
  useUpdatePublishComment,
  useDeleteComment,
  useMarkEnquiryAsJunk,
} from "@/features/comments/hooks/useComments";

export default function InquiryDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const enquiryId = Number(id);

  if (Number.isNaN(enquiryId)) {
    if (typeof window !== "undefined") router.replace("/admin/inquiryReplies");
    return null;
  }

  // 문의 본문
  const { data, isLoading, isError } = useEnquiry(enquiryId);

  // 댓글 목록
  const { data: comments, isLoading: cLoading } = useComments(enquiryId);
  const latest = useMemo(() => {
    if (!comments?.length) return undefined;
    // updatedAt desc 정렬 가정
    return [...comments].sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    )[0];
  }, [comments]);

  // 댓글 관련 mutation 훅
  const { mutate: createDraft, isPending: creatingDraft } =
    useCreateDraftComment();
  const { mutate: updateDraft, isPending: updatingDraft } =
    useUpdateDraftComment();
  const { mutate: createPublish, isPending: creatingPublish } =
    useCreatePublishComment();
  const { mutate: updatePublish, isPending: updatingPublish } =
    useUpdatePublishComment();
  const { mutate: removeCmt, isPending: deleting } = useDeleteComment();
  const { mutate: markJunk, isPending: junking } = useMarkEnquiryAsJunk();

  const savingDraft = creatingDraft || updatingDraft;
  const savingPublish = creatingPublish || updatingPublish;

  // 편집 상태
  const [isEditing, setIsEditing] = useState(false);
  const [answer, setAnswer] = useState(""); // 화면 표시용(최신 댓글)
  const [tempAnswer, setTempAnswer] = useState("");

  // 최신 댓글을 화면 상태에 반영
  useEffect(() => {
    if (latest?.content) setAnswer(latest.content);
  }, [latest]);

  // 로딩/에러
  if (isLoading) {
    return (
      <div className="flex flex-col bg-white">
        <AdminHeader />
        <div className="px-4 lg:px-[22.5%] py-10 text-sm text-gray-500">
          불러오는 중…
        </div>
      </div>
    );
  }
  if (isError || !data) {
    return (
      <div className="flex flex-col bg-white">
        <AdminHeader />
        <div className="px-4 lg:px-[22.5%] py-10 text-sm text-red-500">
          문의를 불러오지 못했습니다.
        </div>
      </div>
    );
  }

  // ✅ 임시 저장 (Draft)
  const handleSaveDraft = () => {
    const content = tempAnswer.trim();
    if (!content) {
      alert("내용을 입력하세요.");
      return;
    }

    // 최신 댓글이 있고, 상태가 DRAFT면 초안 수정
    if (latest && latest.status === "DRAFT") {
      updateDraft(
        { id: latest.id, dto: { enquiryId, content } },
        {
          onSuccess: (res) => {
            setAnswer(res.content);
            setIsEditing(false);
          },
        }
      );
    } else {
      // 없거나, DRAFT가 아니면 새 초안 생성
      createDraft(
        { enquiryId, content },
        {
          onSuccess: (res) => {
            setAnswer(res.content);
            setIsEditing(false);
          },
        }
      );
    }
  };

  // ✅ 답변 완료 (Publish)
  const handleSavePublish = () => {
    const content = tempAnswer.trim();
    if (!content) {
      alert("내용을 입력하세요.");
      return;
    }

    if (latest?.id) {
      // 최신 댓글이 있으면 /publish/{commentId} 로 갱신 (Draft든 Published든 서버가 처리)
      updatePublish(
        { id: latest.id, dto: { enquiryId, content } },
        {
          onSuccess: (res) => {
            setAnswer(res.content);
            setIsEditing(false);
          },
        }
      );
    } else {
      // 아무 댓글도 없으면 /publish 로 새로 생성
      createPublish(
        { enquiryId, content },
        {
          onSuccess: (res) => {
            setAnswer(res.content);
            setIsEditing(false);
          },
        }
      );
    }
  };

  // ✅ 문의 정크 처리 (댓글 상태가 아니라 enquiry 기준)
  const handleMarkJunk = () => {
    if (!confirm("해당 문의를 스팸/무효 처리할까요?")) return;
    markJunk(
      { enquiryId },
      {
        onSuccess: () => {
          // 필요 시 추가 UI 업데이트
          alert("스팸/무효 처리되었습니다.");
        },
      }
    );
  };

  // ✅ 댓글 삭제
  const handleDelete = (commentId: number) => {
    if (!confirm("댓글을 삭제할까요?")) return;
    removeCmt(
      { id: commentId, enquiryId },
      {
        onSuccess: () => {
          if (latest?.id === commentId) {
            setAnswer("");
            setTempAnswer("");
            setIsEditing(false);
          }
        },
      }
    );
  };

  return (
    <div className="flex flex-col bg-white text-[#1D1D1D]">
      <AdminHeader />
      <Breadcrumb
        items={[
          { label: "문의 답변 관리", href: "/admin/inquiryReplies" },
          { label: `문의 #${data.id}` },
        ]}
      />

      <main className="w-full flex justify-center ">
        <div className="w-full px-4 sm:px-10 lg:px-[22.5%] mt-10">
          {/* 문의 카테고리 */}
          <p className="text-lg font-bold mb-2">[ {data.category ?? "기타"} ]</p>

          {/* 유저 정보 */}
          <div className="flex items-center gap-3 mb-1 border-gray-600 border-y-1 py-2">
            <div className="w-8 h-8 rounded-full bg-gray-300" />
            <span className="text-sm font-medium">마케터</span>
            <span className="text-sm text-[#8E8E8E]">
              {data.writerEmail ?? "-"}
            </span>
            <span className="ml-auto text-sm">
              {(data.updatedAt || data.createdAt).slice(0, 10)}
            </span>
            <span className="text-sm ">[{data.status ?? "접수됨"}]</span>
          </div>

          <div className="py-8">
            {/* 제목 */}
            <p className="text-base font-bold mb-6">{data.title}</p>

            {/* 본문 내용 */}
            <p className="whitespace-pre-line text-sm leading-relaxed text-[#1D1D1D]">
              {data.content}
            </p>

            {/* 첨부 파일 */}
            {data.imageURL ? (
              <div className="flex items-center gap-1 text-sm text-[#000000] mt-10">
                <span>첨부파일 1개</span>
                <FiPaperclip className="text-gray-500" />
                <a
                  href={data.imageURL}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#8E8E8E] underline underline-offset-2 cursor-pointer"
                >
                  {data.imageURL.split("/").pop()}
                </a>
              </div>
            ) : null}
          </div>

          <div className="w-full h-[1px] bg-[#4a5565] mb-3" />

          {/* 답변 작성(최신 댓글 기반) */}
          <div className="flex flex-1 flex-row mt-7 mb-15 gap-2">
            <p className="w-1/10 py-3 text-base font-bold flex-nowrap text-left">
              답변
            </p>
            <div className="w-full leading-relaxed">
              {isEditing ? (
                <textarea
                  value={tempAnswer}
                  onChange={(e) => setTempAnswer(e.target.value)}
                  className="min-h-[200px] w-full p-3 border border-gray-300 rounded-lg text-sm resize-none"
                  placeholder="답변을 입력하세요"
                />
              ) : (
                <div className="w-full p-3 border-0 border-gray-300 rounded-lg text-sm whitespace-pre-line ">
                  {cLoading
                    ? "댓글 불러오는 중…"
                    : answer || "아직 등록된 답변이 없습니다."}
                </div>
              )}
              <p className="text-right mt-3 text-xs text-gray-600">
                {(
                  latest?.updatedAt ||
                  latest?.createdAt ||
                  data.updatedAt ||
                  data.createdAt
                ).slice(0, 10)}
              </p>
            </div>
          </div>

          {/* 댓글 리스트 간단 표시 및 조작 */}
          {comments?.length ? (
            <div className="mt-6">
              <p className="text-sm font-semibold mb-2">기존 답변</p>
              <ul className="space-y-2">
                {comments.map((c) => (
                  <li key={c.id} className="border rounded p-3 text-sm">
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-500">
                        #{c.id} · {c.status}
                      </span>
                      <span className="text-gray-400">
                        {(c.updatedAt || c.createdAt)
                          .slice(0, 16)
                          .replace("T", " ")}
                      </span>
                    </div>
                    <pre className="whitespace-pre-wrap">{c.content}</pre>
                    <div className="flex gap-2 mt-2">
                      <button
                        className="px-3 py-1 rounded bg-gray-200 text-xs"
                        onClick={() => {
                          setTempAnswer(c.content);
                          setIsEditing(true);
                        }}
                      >
                        편집
                      </button>
                      <button
                        className="px-3 py-1 rounded bg-gray-200 text-xs"
                        disabled={deleting}
                        onClick={() => handleDelete(c.id)}
                      >
                        삭제
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </main>

      {/* 하단 버튼 */}
      <div className="flex justify-between w-full px-[5%] lg:px-[22.5%] pt-[3%] pb-[8%]">
        <button
          className="bg-[#878787] text-white px-6 py-3 rounded-lg text-sm font-medium cursor-pointer"
          onClick={handleMarkJunk}
          disabled={junking}
        >
          스팸/무효
        </button>
        <div className="flex gap-2 ">
          {isEditing ? (
            <>
              <button
                onClick={handleSaveDraft}
                className="bg-gray-400 text-white px-6 py-3 rounded-lg text-sm font-medium cursor-pointer"
                disabled={savingDraft}
              >
                임시 저장
              </button>
              <button
                onClick={handleSavePublish}
                className="bg-[#FF4545] text-white px-6 py-3 rounded-lg text-sm font-medium cursor-pointer"
                disabled={savingPublish}
              >
                답변 완료
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => {
                  setTempAnswer(answer);
                  setIsEditing(true);
                }}
                className="bg-[#3f3f3f] text-white px-6 py-3 rounded-lg text-sm font-medium cursor-pointer"
              >
                답변 수정
              </button>
              <button
                onClick={() => {
                  setTempAnswer(answer);
                  setIsEditing(true);
                }}
                className="bg-[#FF4545] text-white px-6 py-3 rounded-lg text-sm font-medium cursor-pointer"
              >
                답변 완료
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
