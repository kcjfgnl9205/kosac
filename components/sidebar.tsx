"use client"
import { useRouter } from "next/navigation"
import { ChevronLeft, ChevronRight } from "lucide-react"

// 차시 아이콘 컴포넌트 (실제로는 각 차시에 맞는 아이콘을 사용해야 함)
const LessonIcon = ({ lessonNumber }: { lessonNumber: number }) => {
  // 간단한 아이콘 매핑
  const getIcon = () => {
    switch (lessonNumber) {
      case 1:
        return "🏠" // 고을에 도둑이 들었소
      case 2:
        return "🎲" // 4비트 윷놀이
      case 3:
        return "❓" // Who are U?
      case 4:
        return "🐻‍❄️" // 북극곰을 도와줘!
      case 5:
        return "📱" // 시그널 원해 (이전 12차시)
      case 6:
        return "🗣️" // 배운 것만 말해요 (이전 13차시)
      case 7:
        return "⏰" // 하루를 읽어주는 AI (이전: 나의 일과 확인하기)
      default:
        return "📚"
    }
  }

  return <div className="text-2xl mr-2">{getIcon()}</div>
}

interface SidebarProps {
  isOpen: boolean
  toggleSidebar: () => void
  selectedLesson: number
  setSelectedLesson: (lesson: number) => void
}

export default function Sidebar({ isOpen, toggleSidebar, selectedLesson, setSelectedLesson }: SidebarProps) {
  const router = useRouter()

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

  const handleLessonClick = (lessonNumber: number) => {
    setSelectedLesson(lessonNumber)

    // 구현된 차시에 따라 해당 페이지로 이동
    if (lessonNumber === 2) {
      router.push("/yut-game")
    } else if (lessonNumber === 6) {
      router.push("/lesson-13") // 기존 URL 유지
    } else if (lessonNumber === 7) {
      router.push("/schedule-planner") // 새로운 일과 확인 페이지
    } else {
      // 아직 구현되지 않은 차시는 메인 페이지로 이동
      router.push("/")
    }
  }

  return (
    <div className={`h-screen bg-gray-100 transition-all duration-300 flex flex-col ${isOpen ? "w-64" : "w-16"}`}>
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-blue-50">
        {isOpen && <h2 className="font-bold text-lg">정보탐정, 제트</h2>}
        <button onClick={toggleSidebar} className="p-1 rounded-full hover:bg-gray-200 transition-colors">
          {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {lessons.map((lesson) => (
          <div
            key={lesson.number}
            className={`flex items-center p-3 cursor-pointer transition-colors ${
              selectedLesson === lesson.number ? "bg-blue-100 border-l-4 border-blue-500" : "hover:bg-gray-200"
            }`}
            onClick={() => handleLessonClick(lesson.number)}
          >
            <LessonIcon lessonNumber={lesson.number} />
            {isOpen && (
              <div>
                <div className="text-sm text-gray-500">{lesson.number}차시.</div>
                <div className="font-medium">{lesson.title}</div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
