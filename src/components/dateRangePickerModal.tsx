"use client";

import React, { useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import {
  addDays,
  subDays,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
} from "date-fns";

interface Props {
  visible: boolean;
  onClose: () => void;
}

const quickRanges = [
  "어제",
  "최근 7일",
  "최근 14일",
  "최근 30일",
  "최근 90일",
  "이번 주",
  "이번 달",
  "올해",
  "지난주",
  "지난달",
];

const DateRangePickerModal = ({ visible, onClose }: Props) => {
  const [selectedQuick, setSelectedQuick] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [monthOffset, setMonthOffset] = useState<number>(0);

  if (!visible) return null;

  const handleQuickRange = (label: string) => {
    const today = new Date();
    let start: Date | null = null;
    let end: Date | null = null;

    switch (label) {
      case "어제":
        start = subDays(today, 1);
        end = subDays(today, 1);
        break;
      case "최근 7일":
        start = subDays(today, 6);
        end = today;
        break;
      case "최근 14일":
        start = subDays(today, 13);
        end = today;
        break;
      case "최근 30일":
        start = subDays(today, 29);
        end = today;
        break;
      case "최근 90일":
        start = subDays(today, 89);
        end = today;
        break;
      case "이번 주":
        start = startOfWeek(today, { weekStartsOn: 0 });
        end = endOfWeek(today, { weekStartsOn: 0 });
        break;
      case "이번 달":
        start = startOfMonth(today);
        end = endOfMonth(today);
        break;
      case "올해":
        start = startOfYear(today);
        end = endOfYear(today);
        break;
      case "지난주":
        const lastWeekStart = subDays(
          startOfWeek(today, { weekStartsOn: 0 }),
          7
        );
        start = lastWeekStart;
        end = addDays(lastWeekStart, 6);
        break;
      case "지난달":
        const lastMonth = new Date(
          today.getFullYear(),
          today.getMonth() - 1,
          1
        );
        start = startOfMonth(lastMonth);
        end = endOfMonth(lastMonth);
        break;
    }

    setSelectedQuick(label);
    setStartDate(start);
    setEndDate(end);
  };

  const handleDateClick = (date: Date) => {
    setSelectedQuick(null);
    if (!startDate || (startDate && endDate)) {
      setStartDate(date);
      setEndDate(null);
    } else if (startDate && !endDate) {
      if (date < startDate) {
        setStartDate(date);
      } else {
        setEndDate(date);
      }
    }
  };

  const renderCalendar = (offset: number) => {
    const baseDate = new Date();
    baseDate.setMonth(baseDate.getMonth() + offset);
    const year = baseDate.getFullYear();
    const month = baseDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startWeekday = firstDay.getDay();

    const days = [];
    for (let i = 0; i < startWeekday; i++) days.push(null);
    for (let day = 1; day <= lastDay.getDate(); day++) {
      days.push(new Date(year, month, day));
    }

    return (
      <div className="flex flex-col items-center w-full px-2">
        <div className="flex items-center justify-between w-full mb-2 pb-2 border-b border-gray-300">
          <button onClick={() => setMonthOffset((prev) => prev - 1)}>
            <FiChevronLeft />
          </button>
          <span className="text-gray-500 font-medium text-sm">{`${year}년 ${
            month + 1
          }월`}</span>
          <button onClick={() => setMonthOffset((prev) => prev + 1)}>
            <FiChevronRight />
          </button>
        </div>
        <div className="grid grid-cols-7 gap-1 text-[10.5px] text-gray-500 w-full mb-1">
          {["일", "월", "화", "수", "목", "금", "토"].map((d) => (
            <div key={d} className="text-center font-medium">
              {d}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1 text-sm text-gray-800 w-full">
          {days.map((date, idx) => {
            const isStart = date?.toDateString() === startDate?.toDateString();
            const isEnd = date?.toDateString() === endDate?.toDateString();
            const isBetween =
              !!date &&
              startDate &&
              endDate &&
              date > startDate &&
              date < endDate;

            <div
              key={idx}
              className={`h-8 flex items-center justify-center cursor-pointer
               ${isStart ? "bg-red-500 text-white rounded-l-full" : ""}
               ${isEnd ? "bg-red-500 text-white rounded-r-full" : ""}
               ${isBetween ? "bg-red-100 text-red-600" : ""}
               ${
                 !isStart && !isEnd && !isBetween
                   ? "hover:bg-gray-100 rounded-full"
                   : ""
               }
             `}
              onClick={() => date && handleDateClick(date)}
            >
              {date ? date.getDate() : ""}
            </div>;

            const isSelected =
              !!date &&
              (date.toDateString() === startDate?.toDateString() ||
                date.toDateString() === endDate?.toDateString());
            const isInRange =
              !!date &&
              startDate &&
              endDate &&
              date > startDate &&
              date < endDate;
            return (
              <div
                key={idx}
                className={`h-8 flex items-center justify-center rounded-full cursor-pointer
                  ${isSelected ? "bg-red-500 text-white" : ""}
                  ${
                    isInRange ? "bg-red-100 text-red-600" : "hover:bg-gray-100"
                  }`}
                onClick={() => date && handleDateClick(date)}
              >
                {date ? date.getDate() : ""}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/30 flex justify-center items-center">
      <div className="bg-white rounded-xl shadow-lg p-8 w-[90%] max-w-3xl">
        <div className="flex w-full gap-6">
          {/* 왼쪽 빠른 선택 */}
          <div className="flex flex-col gap-3">
            {quickRanges.map((label) => (
              <label key={label} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedQuick === label}
                  onChange={() => handleQuickRange(label)}
                />
                <span className="text-sm">{label}</span>
              </label>
            ))}
          </div>

          {/* 오른쪽 달력 */}
          <div className="flex flex-col gap-4 flex-1">
            <div className="flex gap-8 justify-center">
              {renderCalendar(monthOffset)}
              {renderCalendar(monthOffset + 1)}
            </div>

            {/* 하단 버튼 */}
            <div className="flex w-1/2 place-self-end gap-3 mt-6">
              <button
                onClick={onClose}
                className="w-1/2 px-6 py-3 border rounded-lg border-gray-300 text-gray-700 hover:bg-gray-100"
              >
                취소
              </button>
              <button
                onClick={onClose}
                className="w-1/2 px-6 py-3 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600"
              >
                선택 완료
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DateRangePickerModal;
