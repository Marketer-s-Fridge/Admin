"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import AdminHeader from "@/components/adminHeader";
import Breadcrumb from "@/components/breadCrumb";
import { FiPaperclip } from "react-icons/fi";
import { useEnquiry } from "@/features/enquiries/hooks/useEnquiry";

export default function InquiryDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const enquiryId = Number(id);

  // id 가 숫자가 아니면 목록으로 돌려보냄
  if (Number.isNaN(enquiryId)) {
    if (typeof window !== "undefined") router.replace("/admin/inquiryReplies");
    return null;
  }

  const { data, isLoading, isError } = useEnquiry(enquiryId);

  const [isEditing, setIsEditing] = useState(false);
  const [answer, setAnswer] = useState("");        // TODO: 서버 답변값 있으면 초기화
  const [tempAnswer, setTempAnswer] = useState("");

  // 로딩/에러 처리
  if (isLoading) {
    return (
      <div className="flex flex-col bg-white">
        <AdminHeader />
        <div className="px-4 lg:px-[22.5%] py-10 text-sm text-gray-500">불러오는 중…</div>
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

  const handleSave = () => {
    // TODO: 답변 저장 API 호출 후 setAnswer(tempAnswer)
    setAnswer(tempAnswer);
    setIsEditing(false);
  };
  const handleCancel = () => {
    setTempAnswer(answer);
    setIsEditing(false);
  };

  return (
    <div className="flex flex-col bg-white text-[#1D1D1D]">
      <AdminHeader />
      <Breadcrumb
        items={[
          { label: "문의 답변 관리", href: "/admin/inquiryReplies" }, // ✅ 경로 수정
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
            <span className="text-sm font-medium">{/* 닉네임 없으면 이메일로 대체 */}마케터</span>
            <span className="text-sm text-[#8E8E8E]">{data.writerEmail ?? "-"}</span>
            <span className="ml-auto text-sm">{(data.updatedAt || data.createdAt).slice(0,10)}</span>
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

          {/* 답변 작성 */}
          <div className="flex flex-1 flex-row mt-7 mb-15 gap-2">
            <p className="w-1/10 py-3 text-base font-bold flex-nowrap text-left">답변</p>
            <div className="w-full leading-relaxed">
              {isEditing ? (
                <textarea
                  value={tempAnswer}
                  onChange={(e) => setTempAnswer(e.target.value)}
                  className="min-h-[200px] w-full p-3 border border-gray-300 rounded-lg text-sm resize-none"
                />
              ) : (
                <div className="w-full p-3 border-0 border-gray-300 rounded-lg text-sm whitespace-pre-line ">
                  {answer || "아직 등록된 답변이 없습니다."}
                </div>
              )}
              <p className="text-right mt-3 text-xs text-gray-600">
                {(data.updatedAt || data.createdAt).slice(0,10)}
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* 버튼 */}
      <div className="flex justify-between w-full px-[5%] lg:px-[22.5%] pt-[3%] pb-[8%]">
        <button className="bg-[#878787] text-white px-6 py-3 rounded-lg text-sm font-medium cursor-pointer">
          스팸/무효
        </button>
        <div className="flex gap-2 ">
          {isEditing ? (
            <>
              <button
                onClick={handleCancel}
                className="bg-gray-400 text-white px-6 py-3 rounded-lg text-sm font-medium cursor-pointer"
              >
                임시 저장
              </button>
              <button
                onClick={handleSave}
                className="bg-[#FF4545] text-white px-6 py-3 rounded-lg text-sm font-medium cursor-pointer"
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
              <button className="bg-[#FF4545] text-white px-6 py-3 rounded-lg text-sm font-medium cursor-pointer">
                답변 완료
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
