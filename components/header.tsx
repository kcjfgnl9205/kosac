"use client";

import Image from "next/image";
import { useState } from "react";

export default function Header() {
  const [selectedLevel, setSelectedLevel] = useState("초등");
  const levels = ["초등", "중등", "고등", "전연령"];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="container  px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Image
                src="/images/logo.png"
                alt="한국과학창의재단"
                width={150}
                height={40}
                priority
              />
              <Image
                src="/images/logo_header.png"
                alt="KOSAC AI교육"
                width={150}
                height={40}
                priority
                className="ml-2"
              />
            </div>
          </div>

          <div className="flex items-center justify-center space-x-1">
            {levels.map((level) => (
              <button
                key={level}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedLevel === level
                    ? "bg-blue-500 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
                onClick={() => setSelectedLevel(level)}
              >
                {level}
              </button>
            ))}
          </div>

          <div className="w-[150px]">{/* 오른쪽 영역은 비워둠 */}</div>
        </div>
      </div>
    </header>
  );
}
