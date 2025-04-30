"use client";

import { useEffect, useRef } from "react";
import { PartyPopper, Skull, X } from "lucide-react";

interface TooltipPopupProps {
  type: "benefit" | "penalty";
  message: string;
  position: { top: number; left: number };
  onClose: () => void;
}

export default function TooltipPopup({ type, message, position, onClose }: TooltipPopupProps) {
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 팝업 외부 클릭 시 닫기
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    // 5초 후 자동으로 닫기
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      clearTimeout(timer);
    };
  }, [onClose]);

  return (
    <div
      ref={popupRef}
      className="absolute z-50 bg-white rounded-lg shadow-lg p-3 max-w-[200px] animate-fadeIn"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
      }}
    >
      <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-white" />

      <button
        onClick={onClose}
        className="absolute top-1 right-1 text-gray-400 hover:text-gray-600"
      >
        <X size={14} />
      </button>

      <div className="flex items-center mb-1">
        {type === "benefit" ? (
          <PartyPopper className="mr-1 text-yellow-500" size={16} />
        ) : (
          <Skull className="mr-1 text-red-500" size={16} />
        )}
        <span className={`font-bold ${type === "benefit" ? "text-green-600" : "text-red-600"}`}>
          {type === "benefit" ? "혜택!" : "벌칙!"}
        </span>
      </div>

      <div className="text-sm">{message}</div>
    </div>
  );
}
