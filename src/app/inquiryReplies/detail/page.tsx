"use client";

import { useState } from "react";
import AdminHeader from "@/components/adminHeader";
import React from "react";
import { FiPaperclip } from "react-icons/fi";
import Breadcrumb from "@/components/breadCrumb";

const InquiryDetailPage: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [answer, setAnswer] = useState(
    `안녕하세요, 먼저 저희 마케팅 인사이트 콘텐츠를 자주 참고해주시고, 소중한 의견 보내주셔서 진심으로 감사드립니다. 현재 일부 콘텐츠는 플랫폼 업로드 시 자동 압축 또는 리사이징 처리로 인해 원본 대비 해상도가 낮아질 수 있으며, 이로 인해 글자가 뭉개지거나 이미지 일부가 잘리는 경우가 있을 수 있습니다. 해당 문제는 현재 처리 완료했으며 앞으로도 더 쾌적하고 읽기 쉬운 콘텐츠를 제공드릴 수 있도록 지속적으로 확인하고 반영해 나가겠습니다. 불편을 드려 죄송하며, 앞으로도 많은 관심과 피드백 부탁드립니다. 감사합니다.`
  );
  const [tempAnswer, setTempAnswer] = useState(answer);

  const handleSave = () => {
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
          { label: "문의 답변 관리", href: "/inquiryReplies" },
          { label: "문의" }, // 현재 페이지는 링크 없이 표시
        ]}
      />
      <main className="w-full flex justify-center px-4">
        <div className="w-full px-[5%] lg:px-[22.5%] mt-10">
          {/* 문의 카테고리 */}
          <p className="text-lg font-bold mb-2">[ 기술적 문제 ]</p>
          {/* 유저 정보 */}
          <div className="flex items-center gap-3 mb-1 border-gray-600 border-y-1 py-2">
            <div className="w-8 h-8 rounded-full bg-gray-300" />
            <span className="text-sm font-medium">마케터</span>
            <span className="text-sm text-[#8E8E8E]">a123456789@gmail.com</span>
            <span className="ml-auto text-sm">2025-05-02</span>
            <span className="text-sm ">[접수됨]</span>
          </div>
          <div className="py-8">
            {/* 제목 */}
            <p className="text-base font-bold mb-6">
              카드뉴스 이미지 깨짐 현상 문의드립니다.
            </p>

            {/* 본문 내용 */}
            <p className=" whitespace-pre-line text-sm leading-relaxed text-[#1D1D1D]">
              안녕하세요, 마케팅 인사이트 콘텐츠를 자주 참고하고 있는
              사용자입니다. 최근 업로드된 카드뉴스 중 일부 콘텐츠에서 이미지
              해상도가 낮게 표시되거나, 글자가 흐릿하게 보여 읽기가 어려운
              경우가 있어 문의드립니다. 특히 모바일에서 확인할 때 품질 저하가 더
              두드러지는 것 같으며, 일부 카드에서는 이미지가 잘려서 보이기도
              합니다. 혹시 콘텐츠 업로드 시 자동으로 이미지가 압축되거나, 표시
              방식에 문제가 있는 것인지 궁금합니다. 콘텐츠를 보다 쾌적하게
              열람할 수 있도록 확인 부탁드리며, 개선 가능 여부도 함께
              안내해주시면 감사하겠습니다. 좋은 콘텐츠 항상 감사드립니다.
            </p>

            {/* 첨부 파일 */}
            <div className="flex items-center gap-1 text-sm text-[#000000] mt-10">
              <span>첨부파일 1개</span>
              <FiPaperclip className="text-gray-500" />
              <span className="text-[#8E8E8E] underline underline-offset-2 cursor-pointer">
                screenshot.jpg
              </span>
            </div>
          </div>
          <div className="w-full h-[1px] bg-[#4a5565] mb-3" />
          {/* 답변 작성 */}
          <div className="flex flex-1 flex-row mt-7 mb-15 gap-2">
            <p className="w-1/9 py-3 text-base font-bold flex-nowrap text-left">
              답변
            </p>
            <div className="w-full leading-relaxed">
              {isEditing ? (
                <textarea
                  value={tempAnswer}
                  onChange={(e) => setTempAnswer(e.target.value)}
                  className="min-h-[200px] w-full p-3 border border-gray-300 rounded-lg text-sm resize-none"
                />
              ) : (
                <div className="w-full p-3 border-0 border-gray-300 rounded-lg text-sm whitespace-pre-line ">
                  {answer}
                </div>
              )}
              <p className="mt-3 text-xs text-gray-600">2025.05.12</p>
            </div>
          </div>
        </div>
      </main>

      {/* 버튼 */}
      <div className="flex justify-between  w-full px-[5%] lg:px-[22.5%] pt-[3%] pb-[8%]">
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
                onClick={() => setIsEditing(true)}
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
};

export default InquiryDetailPage;
