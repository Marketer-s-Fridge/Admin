"use client";

import React, { useState } from "react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "@/styles/bookingUploadPopup.css"; // ← 이걸로 모듈 말고 글로벌로!

interface BookingUploadPopupProps {
  onClose: () => void;
  onConfirm: (date: Date, time: string) => void;
}

export const BookingUploadPopup: React.FC<BookingUploadPopupProps> = ({
  onClose,
  onConfirm,
}) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>("오후 8:20");

  const handleConfirm = () => {
    onConfirm(selectedDate, selectedTime);
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
      <div className="bg-white w-[720px] rounded-xl p-10 flex gap-5">
        {/* 왼쪽: 달력 */}
        <div className="flex flex-col">
          <h2 className="text-2xl font-bold mb-8">날짜 및 시간 선택</h2>
          <div className="flex flex-row gap-10">
            <div className="w-1/2">
              <Calendar
                onChange={(value) => {
                  if (value instanceof Date) {
                    setSelectedDate(value);
                  }
                }}
                value={selectedDate}
                locale="ko"
                calendarType="gregory"
                next2Label={null}
                prev2Label={null}
                formatDay={(locale, date) => String(date.getDate())}
                formatShortWeekday={(_, date) =>
                  ["일", "월", "화", "수", "목", "금", "토"][date.getDay()]
                }
                tileClassName={({ date, view }) => {
                  if (
                    view === "month" &&
                    date.getTime() < new Date().setHours(0, 0, 0, 0)
                  ) {
                    return "past-date";
                  }
                  return "";
                }}
              />
            </div>

            {/* 오른쪽: 날짜/시간 확인 및 버튼 */}
            <div className="flex-1 flex flex-col justify-between">
              <div className="flex flex-col gap-4 text-gray-500">
                <input
                  type="text"
                  readOnly
                  value={format(selectedDate, "yyyy.MM.dd", { locale: ko })}
                  className=" border-gray-300 border-1 rounded-lg px-3 py-2.5"
                />
                <input
                  type="text"
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="border-gray-300 border-1 rounded-lg px-3 py-2.5"
                />
              </div>

              <div className="flex gap-4 h-10 text-nowrap justify-end mt-10">
                <button
                  onClick={onClose}
                  className="border border-gray-300 px-6 py-2 rounded text-gray-800 cursor-pointer"
                >
                  취소
                </button>
                <button
                  onClick={handleConfirm}
                  className="bg-[#FF4545] px-6 py-2 rounded text-white font-bold cursor-pointer"
                >
                  업로드 예약
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingUploadPopup;
