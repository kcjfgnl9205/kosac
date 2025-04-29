"use client";

import { useState } from "react";
import Sidebar from "@/components/sidebar";
import MainContent from "@/components/main-content";

export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedLesson, setSelectedLesson] = useState(2); // 기본값으로 2차시 선택

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <main className="flex flex-1">
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        selectedLesson={selectedLesson}
        setSelectedLesson={setSelectedLesson}
      />
      <MainContent selectedLesson={selectedLesson} />
    </main>
  );
}
