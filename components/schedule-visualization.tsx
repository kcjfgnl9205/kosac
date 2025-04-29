"use client"

import { useState, useEffect, useCallback } from "react"
import type { ScheduleItem } from "@/types/schedule"

interface ScheduleVisualizationProps {
  schedules: ScheduleItem[]
}

// 카테고리별 색상 정의
const categoryColors: Record<string, string> = {
  study: "bg-blue-500",
  leisure: "bg-green-500",
  daily: "bg-yellow-500",
  etc: "bg-purple-500",
}

export default function ScheduleVisualization({ schedules }: ScheduleVisualizationProps) {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<string | null>(null)

  // 현재 시간 업데이트
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000) // 1분마다 업데이트

    return () => clearInterval(timer)
  }, [])

  // 분석 함수 추가 (ScheduleVisualization 함수 내부에)
  const analyzeSchedule = useCallback(() => {
    setIsAnalyzing(true)

    // 분석 시뮬레이션 (실제로는 AI 호출 등이 들어갈 수 있음)
    setTimeout(() => {
      // 스케줄 분석 로직
      let result = ""

      if (schedules.length === 0) {
        result = "아직 등록된 일정이 없습니다. 일정을 추가해 보세요!"
      } else {
        // 카테고리별 시간 계산
        const categoryTimes: Record<string, number> = {
          study: 0,
          leisure: 0,
          daily: 0,
          etc: 0,
        }

        schedules.forEach((schedule) => {
          // 시작 시간과 종료 시간을 분 단위로 변환
          const startTotalMinutes = schedule.startHour * 60 + (schedule.startMinute || 0)
          const endTotalMinutes = schedule.endHour * 60 + (schedule.endMinute || 0)

          // 시간 차이 계산 (자정을 넘기는 경우 고려)
          let diffMinutes = endTotalMinutes - startTotalMinutes
          if (diffMinutes < 0) {
            diffMinutes = 24 * 60 + diffMinutes
          }

          // 해당 카테고리에 시간 추가
          categoryTimes[schedule.category] = (categoryTimes[schedule.category] || 0) + diffMinutes
        })

        // 가장 많은 시간을 할애한 카테고리 찾기
        let maxCategory = "study"
        let maxTime = 0

        Object.entries(categoryTimes).forEach(([category, time]) => {
          if (time > maxTime) {
            maxTime = time
            maxCategory = category
          }
        })

        // 카테고리 한글명 매핑
        const categoryNames: Record<string, string> = {
          study: "공부",
          leisure: "여가",
          daily: "일상",
          etc: "기타",
        }

        // 결과 생성
        const hours = Math.floor(maxTime / 60)
        const minutes = maxTime % 60
        const timeText = hours > 0 ? (minutes > 0 ? `${hours}시간 ${minutes}분` : `${hours}시간`) : `${minutes}분`

        result = `오늘 가장 많은 시간을 할애한 활동은 "${categoryNames[maxCategory]}"입니다. (${timeText})\n`

        // 추가 분석 및 조언
        if (maxCategory === "study" && maxTime > 240) {
          result += "공부에 많은 시간을 투자하고 있네요! 적절한 휴식도 중요합니다."
        } else if (maxCategory === "leisure" && maxTime > 240) {
          result += "여가 활동을 충분히 즐기고 계시네요. 균형 잡힌 일정 관리가 중요합니다."
        } else if (categoryTimes.study < 60 && schedules.length > 3) {
          result += "공부 시간이 부족한 것 같습니다. 학습 시간을 조금 더 확보해 보세요."
        } else {
          result += "전반적으로 균형 잡힌 일정을 보내고 있습니다!"
        }
      }

      setAnalysisResult(result)
      setIsAnalyzing(false)
    }, 1500) // 1.5초 후 분석 결과 표시
  }, [schedules])

  // 현재 시간 표시 (시침 각도 계산)
  const currentHour = currentTime.getHours()
  const currentMinute = currentTime.getMinutes()
  const hourDegree = (currentHour % 12) * 30 + currentMinute * 0.5
  const minuteDegree = currentMinute * 6

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center">
        {/* 시계 표시 */}
        <div className="relative w-64 h-64 mb-8">
          <div className="absolute inset-0 rounded-full border-4 border-gray-300 bg-white shadow-md"></div>

          {/* 시계 눈금 */}
          {Array.from({ length: 24 }).map((_, i) => (
            <div
              key={`tick-${i}`}
              className={`absolute bg-gray-700 ${i % 6 === 0 ? "w-1.5 h-4" : "w-1 h-2"}`}
              style={{
                top: "50%",
                left: "50%",
                transformOrigin: "bottom center",
                transform: `translate(-50%, -100%) rotate(${i * 15}deg)`,
              }}
            ></div>
          ))}

          {/* 시계 숫자 */}
          {[0, 3, 6, 9, 12, 15, 18, 21].map((hour) => (
            <div
              key={`hour-${hour}`}
              className="absolute text-sm font-bold"
              style={{
                top: hour === 0 ? "15%" : hour === 12 ? "85%" : "50%",
                left: hour === 6 ? "85%" : hour === 18 ? "15%" : "50%",
                transform:
                  hour === 3
                    ? "translate(0%, -50%)"
                    : hour === 9
                      ? "translate(-100%, -50%)"
                      : hour === 0
                        ? "translate(-50%, 0%)"
                        : hour === 12
                          ? "translate(-50%, 0%)"
                          : "translate(-50%, -50%)",
              }}
            >
              {hour}
            </div>
          ))}

          {/* 시계 바늘 */}
          <div
            className="absolute w-1 h-24 bg-black rounded-full"
            style={{
              top: "50%",
              left: "50%",
              transformOrigin: "bottom center",
              transform: `translate(-50%, -100%) rotate(${hourDegree}deg)`,
            }}
          ></div>

          {/* 분침 추가 */}
          <div
            className="absolute w-0.5 h-28 bg-black rounded-full"
            style={{
              top: "50%",
              left: "50%",
              transformOrigin: "bottom center",
              transform: `translate(-50%, -100%) rotate(${minuteDegree}deg)`,
            }}
          ></div>

          {/* 시계 중앙 */}
          <div
            className="absolute w-4 h-4 bg-blue-500 rounded-full"
            style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}
          ></div>
        </div>

        {/* 일정 타임라인 - 복원 */}

        {/* 범례 */}
        <div className="mt-4 flex flex-wrap gap-4 justify-center">
          {Object.entries(categoryColors).map(([category, color]) => {
            const categoryName = {
              study: "공부",
              leisure: "일상",
              daily: "취미",
              etc: "휴식",
            }[category]

            return (
              <div key={category} className="flex items-center">
                <div className={`w-4 h-4 ${color} rounded-sm mr-1`}></div>
                <span className="text-sm">{categoryName}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
