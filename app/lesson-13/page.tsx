"use client"

import type React from "react"

import { useState, useEffect, type KeyboardEvent, useRef } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Sidebar from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Settings } from "lucide-react"

// 꽃 데이터 정의
interface FlowerData {
  id: number
  name: string
  koreanName: string
  correctAnswer: string
  imagePath: string
  char: string
}

// 테스트 이미지 정의
interface TestImage {
  id: number
  name: string
  path: string
  result: string
}

export default function Lesson13Page() {
  const router = useRouter()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [currentStep, setCurrentStep] = useState(1)
  const [currentSummaryStep, setCurrentSummaryStep] = useState(1)
  const [isSelectionPhase, setIsSelectionPhase] = useState(false)
  const [currentFlowerIndex, setCurrentFlowerIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [isCorrect, setIsCorrect] = useState(false)
  const [showPopup, setShowPopup] = useState(false)
  const [isQuizCompleted, setIsQuizCompleted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [loadingComplete, setLoadingComplete] = useState(false)
  const [isTestPhase, setIsTestPhase] = useState(false)
  const [draggedImage, setDraggedImage] = useState<TestImage | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [showErrorPopup, setShowErrorPopup] = useState(false)
  const [isSummaryPhase, setIsSummaryPhase] = useState(false)
  const dropZoneRef = useRef<HTMLDivElement>(null)
  const totalSteps = 5
  const totalSummarySteps = 5

  // 꽃 데이터 배열 - 파일명에서 정보 추출
  const flowers: FlowerData[] = [
    {
      id: 1,
      name: "lotus",
      koreanName: "연꽃",
      correctAnswer: "수매화", // 파일명 연꽃_수매화_학습.jpg에서 추출
      imagePath: "/images/lotus.jpeg",
      char: "물로 꽃가루받이가 이루어지는 꽃으로 연꽃, 수련, 나사말 등이 있습니다.",
    },
    {
      id: 2,
      name: "forsythia",
      koreanName: "개나리",
      correctAnswer: "충매화", // 파일명 개나리01_충매화_학습.jpg에서 추출
      imagePath: "/images/forsythia.jpeg",
      char: "곤충을 유인하기 위해 꽃잎이 화려하고 냄새가 강한 것이 특징입니다.",
    },
    {
      id: 3,
      name: "camellia",
      koreanName: "동백꽃",
      correctAnswer: "조매화", // 파일명 동백꽃02_조매화_학습.jpg에서 추출
      imagePath: "/images/camellia.png",
      char: "새의 눈이 빨간색과 분홍색을 유난히 잘보기 때문에 빨간색과 분홍색 꽃이 많습니다.",
    },
  ]

  // 테스트 이미지 배열
  const testImages: TestImage[] = [
    {
      id: 1,
      name: "민들레01_수매화_테스트",
      path: "/images/dandelion.jpeg",
      result: "수매화",
    },
    {
      id: 2,
      name: "개나리01_충매화_테스트",
      path: "/images/forsythia-yellow.jpeg",
      result: "충매화",
    },
  ]

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  // Step content with line breaks
  const stepContents = [
    "이번 시간에는 식물이 씨를 퍼트리는 방법을\n인공지능에게 학습시켜 봅시다.",
    "인공지능을 학습시키려면 데이터에 이름을 정확히 붙여줘야 합니다.\n이것을 라벨링이라고 해요.",
    "꽃을 보고 해당 꽃이 씨를 어떻게 퍼트리는지\n알맞게 라벨링 해주세요.",
    "인공지능이 학습을 완료하고 나면 꽃 사진을 선택했을 때\n씨를 어떻게 퍼트리는지 인공지능이 알려줍니다.",
    "이제 꽃이 씨를 퍼트리는 방법을 분류해 주는\n인공지능을 만들어 봅시다.",
  ]

  // Summary content with line breaks
  const summaryContents = [
    "인공지능을 학습 시키기 위해서는\n학습 데이터와 데이터에 맞는 이름을 매칭시키는 라벨링이 필요해요.",
    "라벨링을 하고 나면\n인공지능이 학습을 할 수 있습니다.",
    "학습이 완료되고 나면 테스트를 통해\n인공지능이 얼마나 똑똑한지 확인할 수 있어요.",
    "그런데 인공지능은 배운 것만 말할 수 있어요. \n민들레는 풍매화지만 인공지능에게 풍매화는 학습 시키지 않았기 때문에\n배운 것 중에 하나를 말하게 됩니다.",
    "인공지능은 반드시 배운 것만 말해요.\n잘못 배우면 잘못된 답을 내놓게 됩니다.",
  ]

  // Handle next step
  const handleNextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    } else {
      // After the 5th step, move to selection phase
      setIsSelectionPhase(true)
    }
  }

  // Handle next summary step
  const handleNextSummaryStep = () => {
    if (currentSummaryStep < totalSummarySteps) {
      setCurrentSummaryStep(currentSummaryStep + 1)
    } else {
      // After the 5th summary step, return to main page
      router.push("/")
    }
  }

  // Handle completion confirmation
  const handleCompletionConfirm = () => {
    console.log("학습 완료 확인!")
    setIsTestPhase(true)
  }

  // Handle key press for Enter key
  const handleKeyPress = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      if (!isSelectionPhase) {
        // Introduction phase - next step
        handleNextStep()
      } else if (isQuizCompleted && loadingComplete && !isTestPhase) {
        // Completion phase - confirm completion
        handleCompletionConfirm()
      } else if (isQuizCompleted && isLoading) {
        // Loading phase - do nothing for now
        return
      } else if (isSummaryPhase) {
        // Summary phase - next step
        handleNextSummaryStep()
      } else if (showPopup) {
        // If popup is shown, close it
        handlePopupClose()
      } else if (showErrorPopup) {
        // If error popup is shown, continue
        handleContinue()
      } else if (!showPopup && selectedAnswer) {
        // If answer is selected but popup is not shown, validate the answer
        handleSelection(selectedAnswer)
      }
    }
  }

  // Add event listener for Enter key
  useEffect(() => {
    const handleGlobalKeyPress = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Enter") {
        if (!isSelectionPhase) {
          // Introduction phase - next step
          handleNextStep()
        } else if (isQuizCompleted && loadingComplete && !isTestPhase) {
          // Completion phase - confirm completion
          handleCompletionConfirm()
        } else if (isQuizCompleted && isLoading) {
          // Loading phase - do nothing for now
          return
        } else if (isSummaryPhase) {
          // Summary phase - next step
          handleNextSummaryStep()
        } else if (showPopup) {
          // If popup is shown, close it
          handlePopupClose()
        } else if (showErrorPopup) {
          // If error popup is shown, continue
          handleContinue()
        } else if (!showPopup && selectedAnswer) {
          // If answer is selected but popup is not shown, validate the answer
          handleSelection(selectedAnswer)
        }
      }
    }

    window.addEventListener("keydown", handleGlobalKeyPress)
    return () => {
      window.removeEventListener("keydown", handleGlobalKeyPress)
    }
  }, [
    currentStep,
    currentSummaryStep,
    isSelectionPhase,
    isQuizCompleted,
    isLoading,
    loadingComplete,
    showPopup,
    showErrorPopup,
    selectedAnswer,
    isTestPhase,
    isSummaryPhase,
  ])

  // Handle selection of seed dispersal method
  const handleSelection = (method: string) => {
    setSelectedAnswer(method)

    const currentFlower = flowers[currentFlowerIndex]
    const isAnswerCorrect = method === currentFlower.correctAnswer

    setIsCorrect(isAnswerCorrect)
    setShowPopup(true)
  }

  // Handle popup close
  const handlePopupClose = () => {
    setShowPopup(false)

    // If answer was correct, move to next flower
    if (isCorrect && currentFlowerIndex < flowers.length - 1) {
      setCurrentFlowerIndex(currentFlowerIndex + 1)
      setSelectedAnswer(null)
    } else if (isCorrect && currentFlowerIndex === flowers.length - 1) {
      // All flowers completed - show loading screen
      setIsQuizCompleted(true)
      setIsLoading(true)

      // After 4 seconds, show completion message
      setTimeout(() => {
        setIsLoading(false)
        setLoadingComplete(true)
      }, 4000)
    }
  }

  // Handle drag start
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, image: TestImage) => {
    setDraggedImage(image)
    e.dataTransfer.setData("text/plain", image.id.toString())
  }

  // Handle drag over
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    if (dropZoneRef.current) {
      dropZoneRef.current.classList.add("bg-white/20")
    }
  }

  // Handle drag leave
  const handleDragLeave = () => {
    if (dropZoneRef.current) {
      dropZoneRef.current.classList.remove("bg-white/20")
    }
  }

  // Handle drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    if (dropZoneRef.current) {
      dropZoneRef.current.classList.remove("bg-white/20")
    }

    if (draggedImage) {
      setShowResult(true)

      // If the dandelion image is dropped, show error popup after 1 second
      if (draggedImage.name.includes("민들레")) {
        setTimeout(() => {
          setShowErrorPopup(true)
        }, 1000)
      }
    }
  }

  // Handle continue button in error popup
  const handleContinue = () => {
    setShowErrorPopup(false)
    setShowResult(false)
    setDraggedImage(null)
  }

  // Handle next button in error popup
  const handleNext = () => {
    setShowErrorPopup(false)
    setIsSummaryPhase(true)
  }

  // Get current flower
  const currentFlower = flowers[currentFlowerIndex]

  return (
    <main className="flex min-h-screen">
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        selectedLesson={6} // 변경: 이전 13차시가 이제 6차시
        setSelectedLesson={(lesson) => {
          // 다른 차시로 이동
          if (lesson !== 6) {
            // 변경: 이전 13차시가 이제 6차시
            if (lesson === 2) {
              router.push("/yut-game")
            } else {
              router.push("/")
            }
          }
        }}
      />

      <div className="flex-1 relative overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image src="/images/lesson-13-bg.png" alt="배운 것만 말해요 배경" fill className="object-cover" priority />
        </div>

        {/* Semi-transparent container with blur effect - moved down by 60px */}
        <div className="relative z-10 flex items-center justify-center min-h-screen pt-[60px]">
          <div
            className="w-[600px] h-[300px] bg-white/30 backdrop-blur-sm rounded-lg border border-white/50 shadow-lg p-6 flex flex-col relative"
            tabIndex={0}
            onKeyDown={handleKeyPress}
          >
            {!isSelectionPhase ? (
              // Introduction phase (Steps 1-5)
              <>
                {/* Progress indicator */}
                <div className="absolute top-4 right-6 text-white font-medium">
                  {currentStep}/{totalSteps}
                </div>

                {/* Title - always at the top */}
                <h1 className="text-[#5DFDCB] text-3xl font-bold mb-6 text-center drop-shadow-md">시작하기</h1>

                {/* Content - flexible height */}
                <div className="flex-grow flex items-center justify-center">
                  <p className="text-white text-center text-lg whitespace-pre-line drop-shadow-md">
                    {stepContents[currentStep - 1]}
                  </p>
                </div>

                {/* Button - always at the bottom */}
                <div className="mt-6 flex justify-center">
                  <Button
                    onClick={handleNextStep}
                    className="bg-gradient-to-r from-[#5DFDCB] to-[#5DFDCB]/70 hover:from-[#5DFDCB]/90 hover:to-[#5DFDCB]/60 text-black px-8 py-2 rounded-full text-lg font-medium shadow-lg transition-all hover:scale-105"
                  >
                    {currentStep === totalSteps ? "완료" : "확인"}
                  </Button>
                </div>
              </>
            ) : isQuizCompleted ? (
              isTestPhase ? (
                isSummaryPhase ? (
                  // Summary phase (Steps 1-5)
                  <>
                    {/* Progress indicator */}
                    <div className="absolute top-4 right-6 text-white font-medium">
                      {currentSummaryStep}/{totalSummarySteps}
                    </div>

                    {/* Title - always at the top */}
                    <h1 className="text-[#5DFDCB] text-3xl font-bold mb-6 text-center drop-shadow-md">정리하기</h1>

                    {/* Content - flexible height */}
                    <div className="flex-grow flex items-center justify-center">
                      <p className="text-white text-center text-lg whitespace-pre-line drop-shadow-md">
                        {summaryContents[currentSummaryStep - 1]}
                      </p>
                    </div>

                    {/* Button - always at the bottom */}
                    <div className="mt-6 flex justify-center">
                      <Button
                        onClick={handleNextSummaryStep}
                        className="bg-gradient-to-r from-[#5DFDCB] to-[#5DFDCB]/70 hover:from-[#5DFDCB]/90 hover:to-[#5DFDCB]/60 text-black px-8 py-2 rounded-full text-lg font-medium shadow-lg transition-all hover:scale-105"
                      >
                        {currentSummaryStep === totalSummarySteps ? "완료" : "확인"}
                      </Button>
                    </div>
                  </>
                ) : (
                  // Test phase - 1:2 ratio container with drag and drop
                  <div className="flex flex-col h-full">
                    {/* Top section (1/3) - Instructions */}
                    <div
                      ref={dropZoneRef}
                      className="h-1/3 flex items-center justify-center border-b border-white/30 transition-colors"
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                    >
                      {showResult && draggedImage ? (
                        <div className="text-center">
                          <h2 className="text-[#5DFDCB] text-3xl font-bold mb-2 drop-shadow-md">
                            {draggedImage.result}
                          </h2>
                          <p className="text-white text-lg">이 꽃은 {draggedImage.result} 방식으로 씨를 퍼트립니다.</p>
                        </div>
                      ) : (
                        <p className="text-white/70 text-center text-lg whitespace-pre-line drop-shadow-md">
                          이미지를 끌고오면 인공지능이 해당 꽃이 씨를 퍼트리는 방법을 알려줍니다.
                        </p>
                      )}
                    </div>

                    {/* Bottom section (2/3) - Test images */}
                    <div className="h-2/3 flex items-center justify-center gap-4 p-4">
                      {[...testImages].reverse().map((image) => (
                        <div
                          key={image.id}
                          className="relative w-[230px] h-[150px] cursor-move hover:scale-105 transition-transform"
                          draggable
                          onDragStart={(e) => handleDragStart(e, image)}
                        >
                          <Image
                            src={image.path || "/placeholder.svg"}
                            alt="테스트 이미지"
                            fill
                            className="object-cover rounded-md border-2 border-white/50"
                          />
                        </div>
                      ))}
                    </div>

                    {/* Error popup for dandelion */}
                    {showErrorPopup && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg z-30">
                        <div className="bg-white p-5 rounded-lg shadow-lg max-w-[80%] text-center">
                          <p className="text-xl font-bold mb-3 text-red-500">인공지능이 틀렸어요!</p>
                          <p className="text-lg mb-4">민들레는 풍매화예요. 인공지능은 왜 수매화라고 답했을까요?</p>
                          <div className="flex justify-center space-x-4">
                            <Button
                              onClick={handleContinue}
                              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
                            >
                              계속하기
                            </Button>
                            <Button
                              onClick={handleNext}
                              className="bg-[#5DFDCB] hover:bg-[#5DFDCB]/80 text-black px-4 py-2 rounded-md"
                            >
                              다음으로
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )
              ) : (
                // Quiz completion phase
                <div className="flex flex-col h-full items-center justify-center">
                  {isLoading ? (
                    // Loading animation
                    <>
                      <h1 className="text-white text-2xl font-bold mb-8 text-center drop-shadow-md">
                        이제 인공지능이 학습을 시작합니다.
                      </h1>
                      <div className="animate-spin">
                        <Settings size={64} className="text-[#5DFDCB]" />
                      </div>
                    </>
                  ) : (
                    // Completion message
                    <>
                      <h1 className="text-[#5DFDCB] text-3xl font-bold mb-6 text-center drop-shadow-md">
                        인공지능 학습완료!
                      </h1>
                      <p className="text-white text-center text-lg mb-8 whitespace-pre-line drop-shadow-md">
                        이제 꽃이 씨를 퍼트리는 방법을 인공지능이 알려줍니다.
                      </p>
                      <Button
                        onClick={handleCompletionConfirm}
                        className="bg-gradient-to-r from-[#5DFDCB] to-[#5DFDCB]/70 hover:from-[#5DFDCB]/90 hover:to-[#5DFDCB]/60 text-black px-8 py-2 rounded-full text-lg font-medium shadow-lg transition-all hover:scale-105"
                      >
                        확인
                      </Button>
                    </>
                  )}
                </div>
              )
            ) : (
              // Selection phase (quiz)
              <div className="flex flex-col h-full">
                {/* Top section (2/3 of height) - Flower Image */}
                <div className="flex-grow flex items-center justify-center">
                  <div className="relative w-[300px] h-[150px] -mt-[20px]">
                    <Image
                      src={currentFlower.imagePath || "/placeholder.svg"}
                      alt={currentFlower.koreanName}
                      fill
                      className="object-cover rounded-md"
                    />
                  </div>
                </div>

                {/* Bottom section (1/3 of height) */}
                <div
                  className="border-t border-white/30 pt-2 flex flex-col justify-between overflow-hidden"
                  style={{ maxHeight: "94px" }}
                >
                  {/* Instruction text */}
                  <p className="text-white text-center mb-2 drop-shadow-md text-sm">
                    이 꽃이 씨를 퍼트리는 방법을 선택하세요.
                  </p>

                  {/* Selection buttons */}
                  <div className="flex justify-center space-x-4 mb-2">
                    <Button
                      onClick={() => handleSelection("수매화")}
                      disabled={isCorrect && showPopup}
                      className={`bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-1 rounded-md shadow-md transition-all hover:scale-105 text-sm ${
                        selectedAnswer === "수매화" ? "ring-2 ring-white" : ""
                      }`}
                    >
                      수매화
                    </Button>
                    <Button
                      onClick={() => handleSelection("조매화")}
                      disabled={isCorrect && showPopup}
                      className={`bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-1 rounded-md shadow-md transition-all hover:scale-105 text-sm ${
                        selectedAnswer === "조매화" ? "ring-2 ring-white" : ""
                      }`}
                    >
                      조매화
                    </Button>
                    <Button
                      onClick={() => handleSelection("충매화")}
                      disabled={isCorrect && showPopup}
                      className={`bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white px-4 py-1 rounded-md shadow-md transition-all hover:scale-105 text-sm ${
                        selectedAnswer === "충매화" ? "ring-2 ring-white" : ""
                      }`}
                    >
                      충매화
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Popup for feedback */}
            {showPopup && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg z-20">
                <div className="bg-white p-4 rounded-lg shadow-lg max-w-[80%] text-center">
                  <p className="text-xl font-bold mb-2">{isCorrect ? "정답입니다!" : "다시 한 번 생각해 보세요."}</p>
                  <p className="text-xs mb-3">
                    {isCorrect ? currentFlower.char : "잘못된 라벨링은 인공지능이 잘못된 학습을 하게 됩니다."}
                  </p>
                  <Button
                    onClick={handlePopupClose}
                    className="bg-[#5DFDCB] hover:bg-[#5DFDCB]/80 text-black px-4 py-2 rounded-md"
                  >
                    {isCorrect ? "다음" : "확인"}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
