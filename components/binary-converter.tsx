"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"

interface BinaryConverterProps {
  binaryValue: number[]
  onSubmit: (decimalValue: number) => void
  isCorrect: boolean | null
}

export default function BinaryConverter({ binaryValue, onSubmit, isCorrect }: BinaryConverterProps) {
  const [inputValue, setInputValue] = useState("")
  const [message, setMessage] = useState("")

  useEffect(() => {
    // 새로운 이진수가 생성되면 입력값과 메시지 초기화
    if (binaryValue.length > 0) {
      setInputValue("")
      setMessage("")
    }
  }, [binaryValue])

  useEffect(() => {
    if (isCorrect === true) {
      setMessage("정답입니다! 말을 이동합니다.")
    } else if (isCorrect === false) {
      setMessage("틀렸습니다. 다시 시도해보세요.")
    }
  }, [isCorrect])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const decimal = Number.parseInt(inputValue, 10)
    if (isNaN(decimal)) {
      setMessage("유효한 숫자를 입력해주세요.")
      return
    }

    onSubmit(decimal)
  }

  return (
    <div className="p-4 border-t border-gray-200">
      <h2 className="text-xl font-bold mb-2">이진수를 십진수로 변환하기</h2>

      {binaryValue.length > 0 ? (
        <form onSubmit={handleSubmit} className="space-y-2">
          <div className="flex flex-col">
            <label htmlFor="decimal-input" className="mb-1 font-medium">
              이진수 <span className="font-bold">{binaryValue.join("")}</span>을 십진수로 변환하세요:
            </label>
            <div className="flex gap-2">
              <input
                id="decimal-input"
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="px-4 py-2 border rounded-md flex-1"
                placeholder="십진수 값 입력"
                min="0"
                max="15"
                required
              />
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">
                확인
              </Button>
            </div>
          </div>

          {message && (
            <div
              className={`mt-2 p-2 rounded ${isCorrect ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
            >
              {message}
            </div>
          )}
        </form>
      ) : (
        <p className="text-gray-500">윷을 먼저 던져주세요.</p>
      )}
    </div>
  )
}
