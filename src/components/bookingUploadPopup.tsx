"use client";

import React, { useState } from "react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "@/styles/bookingUploadPopup.css";
import TimeDropdown from "./timeDropdown";

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
    <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50 px-4">
      <div className="bg-white w-full sm:max-w-[600px] lg:max-w-[720px] rounded-xl p-6 sm:p-8 lg:p-10">
        <h2 className="text-lg sm:text-xl lg:text-2xl font-bold mb-6 sm:mb-8">
          날짜 및 시간 선택
        </h2>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">
          {/* 왼쪽: 캘린더 */}
          <div className="w-full lg:w-1/2">
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

          {/* 오른쪽: 날짜/시간/버튼 */}
          <div className="flex-1 flex flex-col justify-between">
            <div className="flex flex-col gap-4 text-gray-500">
              <input
                type="text"
                readOnly
                value={format(selectedDate, "yyyy.MM.dd", { locale: ko })}
                className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm sm:text-base"
              />
              <TimeDropdown value={selectedTime} onSelect={setSelectedTime} />
            </div>

            <div className="flex gap-4 justify-end mt-8 sm:mt-10 text-sm sm:text-base">
              <button
                onClick={onClose}
                className="cursor-pointer hover:bg-gray-100 border border-gray-300 px-4 sm:px-6 py-2 rounded-md text-gray-800"
              >
                취소
              </button>
              <button
                onClick={handleConfirm}
                className="cursor-pointer bg-[#FF4545] px-4 sm:px-6 py-2 rounded-md text-white font-bold"
              >
                업로드 예약
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingUploadPopup;
