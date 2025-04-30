"use client";

import Image from "next/image";

// 카테고리별 색상 정의
const categoryColors: Record<string, string> = {
  study: "bg-blue-500",
  leisure: "bg-green-500",
  daily: "bg-yellow-500",
  etc: "bg-purple-500",
};

interface Props {
  count: number;
}

export default function ScheduleVisualization({ count }: Props) {
  const src =
    count === 1 ? "/images/time1.png" : count === 2 ? "/images/time2.png" : "/images/time3.png";
  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center">
        {/* 시계 표시 */}
        <Image src={src} alt="배운 것만 말해요 배경" width={250} height={250} />

        {/* 범례 */}
        <div className="mt-4 flex flex-wrap gap-4 justify-center">
          {Object.entries(categoryColors).map(([category, color]) => {
            const categoryName = {
              study: "공부",
              leisure: "일상",
              daily: "취미",
              etc: "휴식",
            }[category];

            return (
              <div key={category} className="flex items-center">
                <div className={`w-4 h-4 ${color} rounded-sm mr-1`}></div>
                <span className="text-sm">{categoryName}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
