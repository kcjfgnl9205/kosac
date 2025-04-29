"use client"

import { useState } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

// 사용 가능한 색상 목록
const COLORS = [
  { name: "빨강", value: "bg-red-500" },
  { name: "파랑", value: "bg-blue-500" },
  { name: "초록", value: "bg-green-500" },
  { name: "노랑", value: "bg-yellow-500" },
  { name: "보라", value: "bg-purple-500" },
  { name: "주황", value: "bg-orange-500" },
]

export interface Player {
  id: number
  name: string
  color: string
  position: number
}

interface GameSetupModalProps {
  isOpen: boolean
  onClose: () => void
  onStartGame: (players: Player[]) => void
}

export default function GameSetupModal({ isOpen, onClose, onStartGame }: GameSetupModalProps) {
  const [playerCount, setPlayerCount] = useState(2)
  const [players, setPlayers] = useState<Player[]>([
    { id: 1, name: "플레이어 1", color: COLORS[0].value, position: 0 },
    { id: 2, name: "플레이어 2", color: COLORS[1].value, position: 0 },
    { id: 3, name: "플레이어 3", color: COLORS[2].value, position: 0 },
    { id: 4, name: "플레이어 4", color: COLORS[3].value, position: 0 },
  ])

  const handlePlayerCountChange = (count: number) => {
    setPlayerCount(count)
  }

  const handleNameChange = (id: number, name: string) => {
    setPlayers(players.map((player) => (player.id === id ? { ...player, name } : player)))
  }

  const handleColorChange = (id: number, color: string) => {
    setPlayers(players.map((player) => (player.id === id ? { ...player, color } : player)))
  }

  const handleStartGame = () => {
    // 선택된 플레이어 수만큼만 전달
    onStartGame(players.slice(0, playerCount))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">이진수 윷놀이 게임 설정</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200">
            <X size={20} />
          </button>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">플레이어 수</label>
          <div className="flex space-x-2">
            {[2, 3, 4].map((count) => (
              <button
                key={count}
                className={`px-4 py-2 rounded ${playerCount === count ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                onClick={() => handlePlayerCountChange(count)}
              >
                {count}명
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4 mb-6">
          {players.slice(0, playerCount).map((player) => (
            <div key={player.id} className="flex items-center space-x-2">
              <input
                type="text"
                value={player.name}
                onChange={(e) => handleNameChange(player.id, e.target.value)}
                className="flex-1 px-3 py-2 border rounded"
                placeholder={`플레이어 ${player.id} 이름`}
              />
              <div className="flex space-x-1">
                {COLORS.map((color) => (
                  <button
                    key={color.value}
                    className={`w-6 h-6 rounded-full ${color.value} ${
                      player.color === color.value ? "ring-2 ring-black" : ""
                    }`}
                    onClick={() => handleColorChange(player.id, color.value)}
                    title={color.name}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        <Button onClick={handleStartGame} className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded">
          게임 시작하기
        </Button>
      </div>
    </div>
  )
}
