"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import type { ScheduleItem } from "@/types/schedule";

interface ScheduleFormProps {
  onAddSchedule: (schedule: ScheduleItem) => void;
  calcCount: () => void;
}

// 카테고리 및 세부 항목 정의
const categories = [
  {
    id: "study",
    name: "공부",
    items: ["숙제하기", "예습 및 복습", "학교생활", "학원가기"],
  },
  {
    id: "leisure",
    name: "일상",
    items: ["식사", "씻기", "집안일"],
  },
  {
    id: "daily",
    name: "취미",
    items: ["TV시청", "게임", "독서", "운동", "자전거타기"],
  },
  {
    id: "etc",
    name: "휴식",
    items: ["가족과 함께", "수면", "산책", "친구와 함께"],
  },
];

export default function ScheduleForm({ onAddSchedule, calcCount }: ScheduleFormProps) {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedItem, setSelectedItem] = useState("");

  // 시간 입력 상태
  const [startHour, setStartHour] = useState("");
  const [startAmPm, setStartAmPm] = useState<"AM" | "PM">("AM");
  const [endHour, setEndHour] = useState("");
  const [endAmPm, setEndAmPm] = useState<"AM" | "PM">("AM");

  // 선택된 카테고리에 따른 세부 항목 필터링
  const filteredItems = selectedCategory
    ? categories.find((cat) => cat.id === selectedCategory)?.items || []
    : [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    calcCount();
    // 기본값 설정
    const category = selectedCategory || "etc";
    const item = selectedItem || "기타";
    const categoryName = categories.find((cat) => cat.id === category)?.name || "기타";

    // 시간 처리 - 문자열에서 시간과 분 추출
    let startHourNum = 0;
    let startMinuteNum = 0;
    let endHourNum = 0;
    let endMinuteNum = 0;

    // 시작 시간 처리
    if (startHour) {
      // 콜론이 있는 경우 (HH:MM 형식)
      if (startHour.includes(":")) {
        const parts = startHour.split(":");
        startHourNum = Number.parseInt(parts[0], 10) || 0;
        startMinuteNum = Number.parseInt(parts[1], 10) || 0;
      } else {
        // 숫자만 있는 경우
        startHourNum = Number.parseInt(startHour, 10) || 0;
      }
    }

    // 종료 시간 처리
    if (endHour) {
      // 콜론이 있는 경우 (HH:MM 형식)
      if (endHour.includes(":")) {
        const parts = endHour.split(":");
        endHourNum = Number.parseInt(parts[0], 10) || 0;
        endMinuteNum = Number.parseInt(parts[1], 10) || 0;
      } else {
        // 숫자만 있는 경우
        endHourNum = Number.parseInt(endHour, 10) || 0;
      }
    }

    // 범위 확인 및 조정
    startHourNum = Math.min(Math.max(startHourNum, 0), 23);
    endHourNum = Math.min(Math.max(endHourNum, 0), 23);
    startMinuteNum = Math.min(Math.max(startMinuteNum, 0), 59);
    endMinuteNum = Math.min(Math.max(endMinuteNum, 0), 59);

    // 24시간제로 변환
    let start24Hour = startHourNum;
    if (startAmPm === "PM" && startHourNum < 12) start24Hour += 12;
    if (startAmPm === "AM" && startHourNum === 12) start24Hour = 0;

    let end24Hour = endHourNum;
    if (endAmPm === "PM" && endHourNum < 12) end24Hour += 12;
    if (endAmPm === "AM" && endHourNum === 12) end24Hour = 0;

    // 시간 형식 변환
    const formattedStartHour = (start24Hour % 12 || 12).toString();
    const formattedEndHour = (end24Hour % 12 || 12).toString();
    const startAmPmText = start24Hour >= 12 ? "PM" : "AM";
    const endAmPmText = end24Hour >= 12 ? "PM" : "AM";

    const startTime = `${formattedStartHour}:${startMinuteNum
      .toString()
      .padStart(2, "0")} ${startAmPmText}`;
    const endTime = `${formattedEndHour}:${endMinuteNum
      .toString()
      .padStart(2, "0")} ${endAmPmText}`;

    // 일정 추가
    onAddSchedule({
      id: Date.now().toString(),
      category,
      categoryName,
      item,
      startTime,
      endTime,
      startHour: start24Hour,
      endHour: end24Hour,
      startMinute: startMinuteNum,
      endMinute: endMinuteNum,
    });

    // 폼 초기화
    setSelectedItem("");
    setStartHour("");
    setEndHour("");
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-6 px-6 pb-6 pt-[19px] -mt-[5px]">
        <div className="space-y-4">
          {/* 카테고리와 세부 항목을 가로로 배치 */}
          <div className="flex space-x-4">
            <div className="flex-1">
              <Label htmlFor="category" className="block text-sm font-medium mb-1">
                항목
              </Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger id="category" className="w-full">
                  <SelectValue placeholder="항목 선택" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1">
              <Label htmlFor="item" className="block text-sm font-medium mb-1">
                세부 항목
              </Label>
              <Select
                value={selectedItem}
                onValueChange={setSelectedItem}
                disabled={!selectedCategory}
              >
                <SelectTrigger id="item" className="w-full">
                  <SelectValue placeholder="세부 항목 선택" />
                </SelectTrigger>
                <SelectContent>
                  {filteredItems.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="startTime" className="block text-sm font-medium mb-1">
              시작 시간
            </Label>
            <div className="flex items-center space-x-2">
              {/* 오전/오후 선택 버튼을 맨 앞으로 이동 */}
              <div className="flex rounded-md overflow-hidden">
                <Button
                  type="button"
                  className={`px-3 py-2 hover:bg-blue-100 ${
                    startAmPm === "AM" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
                  }`}
                  onClick={() => setStartAmPm("AM")}
                >
                  오전
                </Button>
                <Button
                  type="button"
                  className={`px-3 py-2 hover:bg-blue-100 ${
                    startAmPm === "PM" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
                  }`}
                  onClick={() => setStartAmPm("PM")}
                >
                  오후
                </Button>
              </div>

              {/* 시간 입력 컴포넌트 */}
              <div className="flex-1">
                <Input
                  variant="time"
                  onTimeConfirm={(hours, minutes) => {
                    // Convert to 24-hour format if PM
                    const hour24 = startAmPm === "PM" && hours < 12 ? hours + 12 : hours;
                    const formattedHour = hour24.toString().padStart(2, "0");
                    const formattedMinutes = minutes.toString().padStart(2, "0");
                    setStartHour(`${formattedHour}:${formattedMinutes}`);
                  }}
                />
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="endTime" className="block text-sm font-medium mb-1">
              종료 시간
            </Label>
            <div className="flex items-center space-x-2">
              {/* 오전/오후 선택 버튼을 맨 앞으로 이동 */}
              <div className="flex rounded-md overflow-hidden">
                <Button
                  type="button"
                  className={`px-3 py-2 hover:bg-blue-100 ${
                    endAmPm === "AM" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
                  }`}
                  onClick={() => setEndAmPm("AM")}
                >
                  오전
                </Button>
                <Button
                  type="button"
                  className={`px-3 py-2 hover:bg-blue-100 ${
                    endAmPm === "PM" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
                  }`}
                  onClick={() => setEndAmPm("PM")}
                >
                  오후
                </Button>
              </div>

              {/* 시간 입력 컴포넌트 */}
              <div className="flex-1">
                <Input
                  variant="time"
                  onTimeConfirm={(hours, minutes) => {
                    // Convert to 24-hour format if PM
                    const hour24 = endAmPm === "PM" && hours < 12 ? hours + 12 : hours;
                    const formattedHour = hour24.toString().padStart(2, "0");
                    const formattedMinutes = minutes.toString().padStart(2, "0");
                    setEndHour(`${formattedHour}:${formattedMinutes}`);
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full bg-black hover:bg-gray-800 text-white py-3 rounded-md"
        >
          일과 추가하기
        </Button>
      </form>
    </div>
  );
}
