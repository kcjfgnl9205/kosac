"use client";

import type React from "react";
import Image from "next/image";
import { useMemo, useState } from "react";
import { PartyPopper, Skull } from "lucide-react";
import type { Player } from "@/components/game-setup-modal";
import TooltipPopup from "./tooltip-popup";

// YutBoardProps 인터페이스에 onRestartGame 콜백 추가
interface YutBoardProps {
  players: Player[];
  onRestartGame: () => void;
}

// YutBoard 함수의 매개변수에 onRestartGame 추가
export default function YutBoard({ players, onRestartGame }: YutBoardProps) {
  const [count, setCount] = useState(0);

  // 팝업 상태
  const [tooltipInfo, setTooltipInfo] = useState<{
    type: "benefit" | "penalty";
    message: string;
    position: { top: number; left: number };
    cellPosition: number;
  } | null>(null);

  // 특별 칸 클릭 핸들러
  const handleCellClick = (event: any) => {
    // 특별 효과가 있는 칸만 처리
    console.log("Z");
    if (count === 0) {
      setCount((prev) => prev + 1);
      setTooltipInfo({
        type: "benefit",
        message: "혜택! 앞으로 3칸 이동하기",
        position: {
          left: 1060, // 칸의 중앙에 위치
          top: 330, // 말풍선이 칸 위에 나타나도록
        },
        cellPosition: 100,
      });
    } else {
      setCount(0);
      setTooltipInfo({
        type: "penalty",
        message: "벌칙! 처음으로 가시오.",
        position: {
          left: 1230, // 칸의 중앙에 위치
          top: 490, // 말풍선이 칸 위에 나타나도록
        },
        cellPosition: 100,
      });
    }
  };

  return (
    <div className="w-full h-full p-4 flex flex-col">
      <h2 className="text-xl font-bold mb-2">이진수 윷놀이 판</h2>

      <div className="flex relative">
        <Image
          id="item1"
          width="48"
          height="48"
          src="/images/animals/item1.svg"
          alt="테스트 이미지"
          className="absolute top-3 left-4 transition-transform duration-1000"
        />
        <Image
          id="item2"
          width="48"
          height="48"
          src="/images/animals/item2.svg"
          alt="테스트 이미지"
          className="absolute top-3 left-16 transition-transform duration-1000"
        />
        <Image
          src="/images/yut.png"
          alt="말판"
          width={800}
          height={500}
          onClick={handleCellClick}
        />
      </div>

      {/* 특별 칸 범례와 게임 다시 시작하기 버튼을 포함하는 하단 영역 */}
      <div className="mt-10 flex justify-between items-center">
        {/* 특별 칸 범례 */}
        <div className="flex flex-wrap gap-4 text-xs">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-yellow-100 border border-yellow-300 mr-1"></div>
            <span>소수</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 ring-2 ring-green-500 mr-1"></div>
            <PartyPopper size={12} className="text-yellow-500 mr-1" />
            <span>혜택</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 ring-2 ring-red-500 mr-1"></div>
            <Skull size={12} className="text-red-500 mr-1" />
            <span>벌칙</span>
          </div>
        </div>

        {/* 게임 다시 시작하기 버튼 */}
        <button
          onClick={onRestartGame}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
        >
          게임 다시 시작하기
        </button>
      </div>

      {/* 말풍선 팝업 */}
      {tooltipInfo && (
        <TooltipPopup
          type={tooltipInfo.type}
          message={tooltipInfo.message}
          position={tooltipInfo.position}
          onClose={() => setTooltipInfo(null)}
        />
      )}
    </div>
  );
}
