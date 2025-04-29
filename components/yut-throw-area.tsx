"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import type { Player } from "@/components/game-setup-modal";
import Image from "next/image";
interface YutThrowAreaProps {
  onYutThrow: (result: number[]) => void;
  yutResult: number[];
  currentPlayer: Player;
  throwCount: number;
}

export default function YutThrowArea({
  onYutThrow,
  yutResult,
  currentPlayer,
  throwCount,
}: YutThrowAreaProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationStage, setAnimationStage] = useState(0);

  // 애니메이션 효과를 위한 함수
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isAnimating) {
      interval = setInterval(() => {
        setAnimationStage((prev) => (prev + 1) % 4);
      }, 150);

      // 애니메이션 종료 후 결과 표시
      const timeout = setTimeout(() => {
        clearInterval(interval);
        setIsAnimating(false);

        // 시나리오에 따른 고정 결과
        let result: number[];
        if (throwCount === 0) {
          // 첫 번째 던지기: 0101 (5)
          result = [0, 1, 0, 1];
        } else if (throwCount === 1) {
          // 두 번째 던지기: 1001 (9)
          result = [1, 0, 0, 1];
        } else {
          // 그 이후는 랜덤
          result = Array(4)
            .fill(0)
            .map(() => Math.round(Math.random()));
        }

        onYutThrow(result);
      }, 1500);

      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }
  }, [isAnimating, onYutThrow, throwCount]);

  const throwYut = () => {
    if (isAnimating) return;
    setIsAnimating(true);
  };

  return (
    <div className="p-4 flex flex-col">
      <div className="mb-2 flex justify-between items-center">
        <h2 className="text-xl font-bold">이진수 윷 던지기</h2>
        <div className="flex items-center">
          {currentPlayer.id === 1 ? (
            <Image width="28" height="28" src="/images/animals/item1.svg" alt="테스트 이미지" />
          ) : (
            <Image width="28" height="28" src="/images/animals/item2.svg" alt="테스트 이미지" />
          )}
          <span>{currentPlayer?.name || "플레이어"} 차례</span>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center py-4">
        <div className="mb-4 flex space-x-4 justify-center">
          {isAnimating
            ? // 애니메이션 중인 윷
              Array(4)
                .fill(0)
                .map((_, index) => (
                  <div
                    key={`anim-${index}`}
                    className={`w-8 h-28 sm:w-10 sm:h-32 rounded-full bg-gray-200 transform transition-all duration-150 ${
                      animationStage === index ? "scale-95 bg-gray-300" : ""
                    }`}
                  ></div>
                ))
            : yutResult.length > 0
            ? // 결과가 있는 경우
              yutResult.map((value, index) => (
                <div
                  key={`result-${index}`}
                  className={`w-8 h-28 sm:w-10 sm:h-32 rounded-full ${
                    value === 1 ? "bg-blue-900" : "bg-gray-300"
                  } flex items-center justify-center text-white font-bold`}
                >
                  {value}
                </div>
              ))
            : // 초기 상태
              Array(4)
                .fill(0)
                .map((_, index) => (
                  <div
                    key={`init-${index}`}
                    className="w-8 h-28 sm:w-10 sm:h-32 rounded-full bg-gray-200"
                  ></div>
                ))}
        </div>

        <Button
          onClick={throwYut}
          disabled={isAnimating}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md text-lg w-40"
        >
          {isAnimating ? "던지는 중..." : "윷 던지기"}
        </Button>

        {yutResult.length > 0 && !isAnimating && (
          <div className="mt-2 text-center">
            <p className="text-lg">
              이진수 결과: <span className="font-bold">{yutResult.join("")}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
