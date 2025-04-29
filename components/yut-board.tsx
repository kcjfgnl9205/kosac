"use client"

import type React from "react"

import { useMemo, useState } from "react"
import { PartyPopper, Skull } from "lucide-react"
import type { Player } from "@/components/game-setup-modal"
import TooltipPopup from "./tooltip-popup"

// YutBoardProps 인터페이스에 onRestartGame 콜백 추가
interface YutBoardProps {
  players: Player[]
  onRestartGame: () => void
}

// YutBoard 함수의 매개변수에 onRestartGame 추가
export default function YutBoard({ players, onRestartGame }: YutBoardProps) {
  // 팝업 상태
  const [tooltipInfo, setTooltipInfo] = useState<{
    type: "benefit" | "penalty"
    message: string
    position: { top: number; left: number }
    cellPosition: number
  } | null>(null)

  // 게임판 구성 (5x10 그리드)
  const boardSize = 50 // Start부터 End까지

  // 소수 목록 (1-50 사이의 소수)
  const primeNumbers = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47]

  // 특별 효과가 있는 칸
  const specialEffectCells = {
    19: { type: "benefit" as const, message: "혜택! 앞으로 3칸 이동하기" },
    23: { type: "penalty" as const, message: "벌칙! 처음으로 가시오." },
  }

  // 게임판 생성
  const boardCells = useMemo(() => {
    const cells = []

    // 시작 셀
    cells.push({ id: "start", label: "Start", position: 0 })

    // 1-48 셀
    for (let i = 1; i <= 48; i++) {
      cells.push({
        id: i.toString(),
        label: i.toString(),
        position: i,
        isPrime: primeNumbers.includes(i),
        specialEffect: specialEffectCells[i as keyof typeof specialEffectCells],
      })
    }

    // 종료 셀
    cells.push({ id: "end", label: "End", position: 49 })

    return cells
  }, [])

  // 특별 칸 클릭 핸들러
  const handleCellClick = (cell: any, event: React.MouseEvent) => {
    // 특별 효과가 있는 칸만 처리
    if (cell.specialEffect) {
      const rect = (event.target as HTMLElement).getBoundingClientRect()

      setTooltipInfo({
        type: cell.specialEffect.type,
        message: cell.specialEffect.message,
        position: {
          top: rect.top - 80, // 말풍선이 칸 위에 나타나도록
          left: rect.left + rect.width / 2, // 칸의 중앙에 위치
        },
        cellPosition: cell.position,
      })
    }
  }

  return (
    <div className="w-full h-full p-4 flex flex-col">
      <h2 className="text-xl font-bold mb-2">이진수 윷놀이 판</h2>

      <div className="grid grid-rows-5 gap-1 bg-white p-2 rounded-lg max-h-[calc(100vh-200px)]">
        {[0, 1, 2, 3, 4].map((row) => (
          <div key={`row-${row}`} className="grid grid-cols-10 gap-1">
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((col) => {
              // 현재 위치에 해당하는 셀 찾기
              const cellPosition =
                row === 0 ? col : row === 1 ? 19 - col : row === 2 ? 20 + col : row === 3 ? 39 - col : 40 + col

              const cell = boardCells.find((c) => c.position === cellPosition)

              if (!cell) return <div key={`empty-${row}-${col}`} className="h-0 aspect-square"></div>

              const playersHere = players.filter((p) => p.position === cellPosition)
              const isPrime = cell.isPrime
              const specialEffect = cell.specialEffect
              const isSpecialCell = cell.position === 19 || cell.position === 23 || cell.position === 32

              return (
                <div
                  key={`cell-${row}-${col}`}
                  className={`relative border aspect-square flex items-center justify-center text-xs sm:text-sm
                    ${isPrime ? "bg-yellow-100 border-yellow-300" : "bg-blue-50 border-blue-200"}
                    ${specialEffect && !isSpecialCell ? (specialEffect.type === "benefit" ? "ring-2 ring-green-500" : "ring-2 ring-red-500") : ""}
                    ${specialEffect ? "cursor-pointer hover:opacity-80" : ""}`}
                  onClick={(e) => handleCellClick(cell, e)}
                >
                  {/* 셀 번호 */}
                  <div className="font-medium">{cell.label}</div>

                  {/* 플레이어 말 */}
                  {playersHere.length > 0 && (
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-wrap gap-0.5 max-w-full">
                      {playersHere.map((player) => (
                        <div
                          key={`player-${player.id}-${cellPosition}`}
                          className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${player.color}`}
                          title={player.name}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        ))}
      </div>

      {/* 특별 칸 범례와 게임 다시 시작하기 버튼을 포함하는 하단 영역 */}
      <div className="mt-2 flex justify-between items-center">
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
  )
}
