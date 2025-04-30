"use client";

import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import type { Player } from "@/components/game-setup-modal";
import NextImage from "next/image";

interface YutThrowAreaProps {
  onYutThrow: (result: number[]) => void;
  yutResult: number[];
  currentPlayer: Player;
  throwCount: number;
}

export default function YutThrowArea({
  currentPlayer,
  onYutThrow,
  throwCount,
  yutResult,
}: YutThrowAreaProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const isAnimatingRef = useRef(false);

  const binaryResult = yutResult.join("");
  const frontCount = yutResult.filter((r) => r === 1).length;
  const backCount = yutResult.filter((r) => r === 0).length;

  const yuts = useRef(
    Array.from({ length: 4 }, (_, i) => ({
      x: 0,
      y: 0,
      vy: 0,
      isJumping: false,
      angle: 0,
      rotationSpeed: 0,
      faceUp: true,
      fixedFaceUp: true,
    }))
  );

  const gravity = 0.8;
  const bounceDamping = 0.4;
  let groundY = 0;

  const frontImage = new Image();
  const backImage = new Image();
  frontImage.src = "/images/front.png"; // public 폴더 기준
  backImage.src = "/images/back.png";

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 500;
    canvas.height = 350;
    groundY = canvas.height - 100;

    // 초기 위치 설정
    yuts.current.forEach((yut, i) => {
      yut.x = canvas.width / 2 - 100 + i * 70;
      yut.y = groundY;
    });

    const drawYut = (yut: any) => {
      ctx.save();
      ctx.translate(yut.x, yut.y);
      ctx.rotate(yut.angle);

      const width = 40;
      const height = 160;
      const img = yut.faceUp ? frontImage : backImage;

      if (img.complete) {
        ctx.drawImage(img, 0, 0, img.width, img.height, -width / 2, -height / 2, width, height);
      } else {
        ctx.fillStyle = "#ccc";
        ctx.fillRect(-width / 2, -height / 2, width, height);
      }

      ctx.restore();
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let yut of yuts.current) {
        if (yut.isJumping) {
          yut.vy += gravity;
          yut.y += yut.vy;
          yut.angle += yut.rotationSpeed;

          if (yut.y >= groundY) {
            yut.y = groundY;
            yut.vy *= -bounceDamping;
            if (Math.abs(yut.vy) < 2) {
              yut.isJumping = false;
              yut.vy = 0;
              yut.rotationSpeed = 0;
              yut.angle = 0;
              yut.faceUp = yut.fixedFaceUp; // 고정 결과 적용
            }
          }
        }
        drawYut(yut);
      }

      // ✨ 여기 추가 (모든 윷이 멈췄는지 체크)
      if (isAnimatingRef.current && yuts.current.every((y) => !y.isJumping)) {
        setIsAnimating(false);
        isAnimatingRef.current = false;
        const result = yuts.current.map((yut) => (yut.fixedFaceUp ? 1 : 0));
        onYutThrow(result);
      }

      requestAnimationFrame(animate);
    };

    animate();
  }, []);

  const throwYuts = () => {
    setIsAnimating(true);
    isAnimatingRef.current = true;

    let fixedResult: boolean[] = [];

    if (throwCount === 0) {
      fixedResult = [false, true, false, true]; // 0 1 0 1
    } else if (throwCount === 1) {
      fixedResult = [true, false, false, true]; // 1 0 0 1
    } else {
      // 기본
      fixedResult = [true, true, false, false];
    }

    yuts.current.forEach((yut, i) => {
      yut.isJumping = true;
      yut.vy = -(15 + Math.random() * 5);
      yut.rotationSpeed = (Math.random() - 0.4) * 0.5;
      yut.fixedFaceUp = fixedResult[i];
    });
  };

  return (
    <div className="p-4 flex flex-col">
      <div className="mb-2 flex justify-between items-center">
        <h2 className="text-xl font-bold">이진수 윷 던지기</h2>
        <div className="flex items-center">
          {currentPlayer.id === 1 ? (
            <NextImage width="28" height="28" src="/images/animals/item1.svg" alt="테스트 이미지" />
          ) : (
            <NextImage width="28" height="28" src="/images/animals/item2.svg" alt="테스트 이미지" />
          )}
          <span>{currentPlayer?.name || "플레이어"} 차례</span>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center py-4">
        <div className=" flex space-x-4 justify-center">
          <div className="relative flex flex-col items-center">
            <canvas ref={canvasRef} style={{ display: "block", width: "100%", height: "100%" }} />
            <Button
              onClick={throwYuts}
              disabled={isAnimating}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md text-lg w-40"
            >
              {isAnimating ? "던지는 중..." : "윷 던지기"}
            </Button>

            {binaryResult && !isAnimating && (
              <div className="mt-2 text-center">
                <p className="text-lg">
                  이진수 결과:
                  <span className="font-bold">{binaryResult}</span>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
