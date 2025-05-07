"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/sidebar";
import GameSetupModal, { type Player } from "@/components/game-setup-modal";
import GamePopup from "@/components/game-popup";
import YutBoard from "@/components/yut-board";
import YutThrowArea from "@/components/yut-throw-area";
import BinaryConverter from "@/components/binary-converter";

export default function YutGamePage() {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [gameStarted, setGameStarted] = useState(false);
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [yutResult, setYutResult] = useState<number[]>([]);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [throwCount, setThrowCount] = useState(0);

  // 팝업 상태
  const [popupOpen, setPopupOpen] = useState(false);
  const [popupType, setPopupType] = useState<"benefit" | "penalty">("benefit");
  const [popupMessage, setPopupMessage] = useState("");
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleStartGame = (selectedPlayers: Player[]) => {
    setPlayers(selectedPlayers);
    setGameStarted(true);
    setIsModalOpen(false);
  };

  // 게임 다시 시작하기 함수
  const handleRestartGame = () => {
    // 게임 설정 모달 다시 열기
    setIsModalOpen(true);

    // 게임 상태 초기화
    setGameStarted(false);
    setPlayers([]);
    setCurrentPlayerIndex(0);
    setYutResult([]);
    setIsCorrect(null);
    setThrowCount(0);
    setPopupOpen(false);
    setPendingAction(null);
  };

  const handleYutThrow = (result: number[]) => {
    setYutResult(result);
    setIsCorrect(null);
  };

  const showPopup = (type: "benefit" | "penalty", message: string, action?: () => void) => {
    setPopupType(type);
    setPopupMessage(message);
    if (action) {
      setPendingAction(() => action);
    } else {
      setPendingAction(null);
    }
    setPopupOpen(true);
  };

  const handlePopupClose = () => {
    setPopupOpen(false);
    if (pendingAction) {
      pendingAction();
      setPendingAction(null);
    }
  };

  // 특별 칸 효과를 적용하는 함수 (팝업 없이)
  const applySpecialCellEffect = (position: number, player: Player) => {
    const updatedPlayers = [...players];
    const playerIndex = players.indexOf(player);

    if (position === 19) {
      // 소수 19에 도착: 앞으로 3칸 이동 (팝업 없이)
      updatedPlayers[playerIndex].position += 3;
      setPlayers([...updatedPlayers]);
    } else if (position === 23) {
      // 소수 23에 도착: 처음으로 돌아가기 (팝업 없이)
      updatedPlayers[playerIndex].position = 0;
      setPlayers([...updatedPlayers]);
    }

    // 다음 플레이어로 턴 넘기기
    setCurrentPlayerIndex((currentPlayerIndex + 1) % players.length);
    setThrowCount(throwCount + 1);
  };

  const handleDecimalSubmit = (value: number) => {
    // 이진수 배열을 십진수로 변환
    const correctDecimal = Number.parseInt(yutResult.join(""), 2);

    const isAnswerCorrect = value === correctDecimal;
    setIsCorrect(isAnswerCorrect);

    if (isAnswerCorrect) {
      // 정답이면 말 이동
      const updatedPlayers = [...players];
      const currentPlayer = updatedPlayers[currentPlayerIndex];
      currentPlayer.position += correctDecimal;

      // 게임판 범위를 벗어나면 End 위치로 조정
      if (currentPlayer.position >= 49) {
        currentPlayer.position = 49;
      }

      setPlayers(updatedPlayers);

      // 특별 칸 효과 처리
      if (throwCount === 0) {
        // 다음 플레이어로 턴 넘기기
        const item1 = document.getElementById("item1");
        if (item1) {
          // 애니메이션을 위한 transition 설정
          item1.style.transition = "transform 1s ease";

          // transitionend 이벤트 핸들러 등록
          const onTransitionEnd = () => {
            // 이벤트 한 번만 실행되도록 제거
            item1.removeEventListener("transitionend", onTransitionEnd);

            // 이동이 끝난 후 모달 표시
            showPopup("benefit", "혜택! 옆사람이 노래하기", () => {
              setCurrentPlayerIndex((currentPlayerIndex + 1) % players.length);
              setThrowCount(throwCount + 1);
            });
          };

          item1.addEventListener("transitionend", onTransitionEnd);

          // 이동 시작
          item1.style.transform = "translateX(481px)";
        }
      } else if (throwCount === 1) {
        const item2 = document.getElementById("item2");
        if (item2) {
          // 1단계: x축으로 이동
          item2.style.transform = "translate(675px, 0)";

          // 1단계 끝난 후 → 2단계로 y축 이동 추가
          setTimeout(() => {
            item2.style.transform = "translate(675px, 83px)";
          }, 1000); // 1단계 transition 시간(0.5s = 500ms) 후 실행
        }

        // 두 번째 던지기 후 다음 플레이어로 턴 넘기기 (팝업 없음)
        setCurrentPlayerIndex((currentPlayerIndex + 1) % players.length);
        setThrowCount(throwCount + 1);
      } else {
        // 특별 칸 효과 처리 (19번과 23번은 팝업 없이 효과만 적용)
        if (currentPlayer.position === 19 || currentPlayer.position === 23) {
          applySpecialCellEffect(currentPlayer.position, currentPlayer);
        } else {
          // 일반 칸: 다음 플레이어로 턴 넘기기
          setCurrentPlayerIndex((currentPlayerIndex + 1) % players.length);
          setThrowCount(throwCount + 1);
        }
      }
    }
  };

  return (
    <main className="flex min-h-screen">
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        selectedLesson={2}
        setSelectedLesson={(lesson) => {
          // 다른 차시로 이동하려면 현재 게임을 종료하고 이동
          if (lesson !== 2) {
            router.push("/");
          }
        }}
      />

      <GameSetupModal
        isOpen={isModalOpen}
        onClose={() => router.push("/")}
        onStartGame={handleStartGame}
      />

      <GamePopup
        isOpen={popupOpen}
        onClose={handlePopupClose}
        type={popupType}
        message={popupMessage}
      />

      {gameStarted && (
        <div className="flex flex-1 flex-col md:flex-row h-[calc(100vh-64px)] overflow-hidden">
          <div className="w-full md:w-1/2 flex flex-col border-r border-gray-200 h-full">
            <YutThrowArea
              onYutThrow={handleYutThrow}
              yutResult={yutResult}
              currentPlayer={players[currentPlayerIndex]}
              throwCount={throwCount}
            />
            <BinaryConverter
              binaryValue={yutResult}
              onSubmit={handleDecimalSubmit}
              isCorrect={isCorrect}
            />
          </div>
          <div className="w-full md:w-1/2 h-full overflow-hidden">
            <YutBoard players={players} onRestartGame={handleRestartGame} />
          </div>
        </div>
      )}
    </main>
  );
}
