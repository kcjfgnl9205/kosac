"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/sidebar";
import ScheduleForm from "@/components/schedule-form";
import ScheduleVisualization from "@/components/schedule-visualization";
import ScheduleList from "@/components/schedule-list";
import type { ScheduleItem } from "@/types/schedule";

export default function SchedulePlannerPage() {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
  const [activeTab, setActiveTab] = useState<"form" | "list">("form");
  const [activeVisualizationTab, setActiveVisualizationTab] = useState<"clock" | "chart">("clock");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [count, setCount] = useState(1);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleAddSchedule = (schedule: ScheduleItem) => {
    // 겹치는 일정 확인
    const isOverlapping = schedules.some((existingSchedule) => {
      return (
        (schedule.startHour < existingSchedule.endHour &&
          schedule.endHour > existingSchedule.startHour) ||
        (existingSchedule.startHour < schedule.endHour &&
          existingSchedule.endHour > schedule.startHour)
      );
    });

    if (isOverlapping) {
      alert("이미 해당 시간에 일정이 있습니다.");
      return;
    }

    setSchedules([...schedules, schedule]);
    // 일정 추가 후 목록 탭으로 전환
    setActiveTab("list");
  };

  const handleDeleteSchedule = (id: string) => {
    setSchedules(schedules.filter((schedule) => schedule.id !== id));
  };

  // 분석 함수 추가
  const analyzeSchedule = useCallback(() => {
    setIsAnalyzing(true);

    // 분석 시뮬레이션 (실제로는 AI 호출 등이 들어갈 수 있음)
    setTimeout(() => {
      // 스케줄 분석 로직
      let result = "";

      if (schedules.length === 0) {
        result = "아직 등록된 일정이 없습니다. 일정을 추가해 보세요!";
      } else {
        // 카테고리별 시간 계산
        const categoryTimes: Record<string, number> = {
          study: 0,
          leisure: 0,
          daily: 0,
          etc: 0,
        };

        schedules.forEach((schedule) => {
          // 시작 시간과 종료 시간을 분 단위로 변환
          const startTotalMinutes = schedule.startHour * 60 + (schedule.startMinute || 0);
          const endTotalMinutes = schedule.endHour * 60 + (schedule.endMinute || 0);

          // 시간 차이 계산 (자정을 넘기는 경우 고려)
          let diffMinutes = endTotalMinutes - startTotalMinutes;
          if (diffMinutes < 0) {
            diffMinutes = 24 * 60 + diffMinutes;
          }

          // 해당 카테고리에 시간 추가
          categoryTimes[schedule.category] = (categoryTimes[schedule.category] || 0) + diffMinutes;
        });

        // 가장 많은 시간을 할애한 카테고리 찾기
        let maxCategory = "study";
        let maxTime = 0;

        Object.entries(categoryTimes).forEach(([category, time]) => {
          if (time > maxTime) {
            maxTime = time;
            maxCategory = category;
          }
        });

        // 카테고리 한글명 매핑
        const categoryNames: Record<string, string> = {
          study: "공부",
          leisure: "일상",
          daily: "취미",
          etc: "휴식",
        };

        // 결과 생성
        const hours = Math.floor(maxTime / 60);
        const minutes = maxTime % 60;
        const timeText =
          hours > 0 ? (minutes > 0 ? `${hours}시간 ${minutes}분` : `${hours}시간`) : `${minutes}분`;

        result = `오늘 가장 많은 시간을 할애한 활동은 "${categoryNames[maxCategory]}"입니다. (${timeText})\n`;

        // 추가 분석 및 조언
        if (maxCategory === "study" && maxTime > 240) {
          result += "공부에 많은 시간을 투자하고 있네요! 적절한 휴식도 중요합니다.";
        } else if (maxCategory === "leisure" && maxTime > 240) {
          result += "여가 활동을 충분히 즐기고 계시네요. 균형 잡힌 일정 관리가 중요합니다.";
        } else if (categoryTimes.study < 60 && schedules.length > 3) {
          result += "공부 시간이 부족한 것 같습니다. 학습 시간을 조금 더 확보해 보세요.";
        } else {
          result += "전반적으로 균형 잡힌 일정을 보내고 있습니다!";
        }
      }

      setAnalysisResult(result);
      setIsAnalyzing(false);
    }, 1500); // 1.5초 후 분석 결과 표시
  }, [schedules]);

  const calcCount = () => {
    setCount((prev) => prev + 1);
  };
  return (
    <main className="flex min-h-screen">
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        selectedLesson={7}
        setSelectedLesson={(lesson) => {
          if (lesson !== 7) {
            if (lesson === 2) {
              router.push("/yut-game");
            } else if (lesson === 6) {
              router.push("/lesson-13");
            } else {
              router.push("/");
            }
          }
        }}
      />

      <div className="flex-1 p-6 bg-gray-50 flex flex-col">
        <h1 className="text-3xl font-bold mb-6 text-center">하루를 읽어주는 AI</h1>

        {/* 상단 영역: 일과 추가 + 일과표 보기 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[430px]">
          {/* 왼쪽 상단: 일과 추가 컨테이너 - 내용 위쪽 배치 */}
          <div className="bg-white rounded-lg shadow-md px-4 pb-4 pt-2 max-h-[430px] overflow-auto">
            <div className="mt-[15px]">
              {/* 탭 버튼 */}
              <div className="flex border-b mb-4">
                <button
                  className={`px-4 py-2 font-medium ${
                    activeTab === "form"
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                  onClick={() => setActiveTab("form")}
                >
                  일과 추가하기
                </button>
                <button
                  className={`px-4 py-2 font-medium ${
                    activeTab === "list"
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                  onClick={() => setActiveTab("list")}
                >
                  일과 목록 보기
                </button>
              </div>

              {/* 탭 내용 */}
              {activeTab === "form" ? (
                <ScheduleForm onAddSchedule={handleAddSchedule} calcCount={calcCount} />
              ) : (
                <ScheduleList schedules={schedules} onDeleteSchedule={handleDeleteSchedule} />
              )}
            </div>
          </div>

          {/* 오른쪽 상단: 생활계획표 보기 컨테이너 */}
          <div className="bg-white rounded-lg shadow-md px-4 pb-4 pt-2 max-h-[430px] overflow-auto">
            <div className="mt-5">
              {/* 탭 버튼 */}
              <div className="flex border-b mb-4">
                <button
                  className={`px-4 py-2 font-medium ${
                    activeVisualizationTab === "clock"
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                  onClick={() => setActiveVisualizationTab("clock")}
                >
                  시계로 보기
                </button>
                <button
                  className={`px-4 py-2 font-medium ${
                    activeVisualizationTab === "chart"
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                  onClick={() => setActiveVisualizationTab("chart")}
                >
                  막대그래프로 보기
                </button>
              </div>

              {/* 탭 내용 */}
              {activeVisualizationTab === "clock" ? (
                <ScheduleVisualization count={count} />
              ) : (
                <div className="p-4">
                  <h3 className="text-lg font-medium mb-4">항목별 시간 분포</h3>

                  {schedules.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">추가된 일정이 없습니다.</p>
                  ) : (
                    <div className="space-y-4">
                      {/* 카테고리별 시간 계산 및 막대 그래프 표시 */}
                      {(() => {
                        // 카테고리별 시간 계산
                        const categoryTimes: Record<string, number> = {
                          study: 0,
                          leisure: 0,
                          daily: 0,
                          etc: 0,
                        };

                        schedules.forEach((schedule) => {
                          const startTotalMinutes =
                            schedule.startHour * 60 + (schedule.startMinute || 0);
                          const endTotalMinutes = schedule.endHour * 60 + (schedule.endMinute || 0);

                          let diffMinutes = endTotalMinutes - startTotalMinutes;
                          if (diffMinutes < 0) {
                            diffMinutes = 24 * 60 + diffMinutes;
                          }

                          categoryTimes[schedule.category] =
                            (categoryTimes[schedule.category] || 0) + diffMinutes;
                        });

                        // 카테고리 한글명 매핑
                        const categoryNames: Record<string, string> = {
                          study: "공부",
                          leisure: "일상",
                          daily: "취미",
                          etc: "휴식",
                        };

                        // 카테고리 색상 매핑
                        const categoryColors: Record<string, string> = {
                          study: "bg-blue-500",
                          leisure: "bg-green-500",
                          daily: "bg-yellow-500",
                          etc: "bg-purple-500",
                        };

                        return Object.entries(categoryTimes).map(([category, time]) => {
                          // 시간을 시간:분 형식으로 변환
                          const hours = Math.floor(time / 60);
                          const minutes = time % 60;
                          const timeText =
                            hours > 0
                              ? minutes > 0
                                ? `${hours}시간 ${minutes}분`
                                : `${hours}시간`
                              : `${minutes}분`;

                          // 24시간 대비 비율 계산 (%)
                          const percentOfDay = ((time / 1440) * 100).toFixed(1);

                          // 막대 너비 계산 (최대 100%)
                          const barWidth = (time / 1440) * 100; // 1440분 = 24시간

                          return (
                            <div key={category} className="space-y-1">
                              <div className="flex justify-between items-center">
                                <span className="font-medium">{categoryNames[category]}</span>
                                <span className="text-sm text-gray-600">
                                  {timeText} ({percentOfDay}%)
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-4">
                                <div
                                  className={`${categoryColors[category]} h-4 rounded-full`}
                                  style={{ width: `${barWidth}%` }}
                                ></div>
                              </div>
                            </div>
                          );
                        });
                      })()}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 하단 영역: AI 분석 */}
        <div className="mt-4 bg-white rounded-lg shadow-md p-6">
          <div className="flex flex-col items-center">
            {/* 텍스트 상자를 상단으로 이동하고 항상 표시 */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg w-full mb-4">
              <h3 className="font-bold text-lg mb-2">AI 분석 결과</h3>
              <p className="whitespace-pre-line">
                {analysisResult || "분석 버튼을 클릭하면 AI가 일정을 분석하여 결과를 보여줍니다."}
              </p>
            </div>

            {/* 버튼을 하단으로 이동 */}
            <button
              onClick={() => analyzeSchedule()}
              className="bg-blue-500 hover:bg-blue-600 text-white py-3 px-8 rounded-lg font-medium transition-colors"
            >
              {isAnalyzing ? (
                <div className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  분석 중...
                </div>
              ) : (
                "하루를 읽어주는 AI"
              )}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
