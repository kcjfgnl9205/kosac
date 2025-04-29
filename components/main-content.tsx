"use client"

import { Button } from "@/components/ui/button"

interface MainContentProps {
  selectedLesson: number
}

export default function MainContent({ selectedLesson }: MainContentProps) {
  // 모든 차시 정보
  const lessons = [
    { number: 1, title: "고을에 도둑이 들었소", originalNumber: 1 },
    { number: 2, title: "4비트 윷놀이", originalNumber: 2 },
    { number: 3, title: "Who are U?", originalNumber: 3 },
    { number: 4, title: "북극곰을 도와줘!", originalNumber: 10 },
    { number: 5, title: "시그널 원해", originalNumber: 12 },
    { number: 6, title: "배운 것만 말해요", originalNumber: 13 },
    { number: 7, title: "하루를 읽어주는 AI", originalNumber: 15 },
  ]

  // 현재 구현된 차시 (2, 6, 7차시)
  const availableLessons = [2, 6, 7]
  const isAvailable = availableLessons.includes(selectedLesson)

  // 현재 선택된 차시 찾기
  const currentLesson = lessons.find((lesson) => lesson.number === selectedLesson) || lessons[0]

  // 시작하기 버튼 클릭 핸들러 수정
  const handleStartLesson = () => {
    if (selectedLesson === 2) {
      // 2차시: 이진수 윷놀이 시작
      window.location.href = "/yut-game"
    } else if (selectedLesson === 6) {
      // 6차시(이전 13차시): 배운 것만 말해요 시작
      window.location.href = "/lesson-13"
    } else if (selectedLesson === 7) {
      // 7차시: 하루를 읽어주는 AI 시작
      window.location.href = "/schedule-planner"
    } else {
      // 기타 차시
      console.log(`${selectedLesson}차시 시작`)
    }
  }

  return (
    <div className="flex-1 flex items-center justify-center bg-white">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">
          {currentLesson.number}차시. {currentLesson.title}
        </h1>

        {isAvailable ? (
          <>
            <p className="text-lg text-gray-600 mb-8">
              {selectedLesson === 2 && "윷놀이를 통해 이진수를 배워봅시다."}
              {selectedLesson === 3 && "나를 표현하는 다양한 방법에 대해 알아봅시다."}
              {selectedLesson === 4 && "기후변화로 위험에 처한 북극곰을 도와주는 방법을 배워봅시다."}
              {selectedLesson === 5 && "신호와 통신의 원리를 배워봅시다."}
              {selectedLesson === 6 && "인공지능이 학습하는 방법과 학습 데이터의 중요성을 배워봅시다."}
              {selectedLesson === 7 && "AI가 하루 일과를 분석하고 효율적인 시간 관리를 도와줍니다."}
            </p>
            <Button
              onClick={handleStartLesson}
              className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-6 rounded-md text-lg"
            >
              학습 시작하기
            </Button>
          </>
        ) : (
          <>
            <Button disabled className="bg-gray-400 text-white px-8 py-6 rounded-md text-lg cursor-not-allowed">
              준비 중입니다
            </Button>
          </>
        )}
      </div>
    </div>
  )
}
