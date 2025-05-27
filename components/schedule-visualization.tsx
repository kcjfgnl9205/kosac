"use client";

import Time from "@/components/time";
import { useEffect } from "react";

// 카테고리별 색상 정의
const categoryColors: Record<string, string> = {
  study: "bg-blue-500",
  leisure: "bg-green-500",
  daily: "bg-yellow-500",
  etc: "bg-purple-500",
};

interface Props {
  count: number;
}

export default function ScheduleVisualization({ count }: Props) {
  function polarToCartesian(cx, cy, r, angle) {
    const rad = ((angle - 90) * Math.PI) / 180;
    return {
      x: cx + r * Math.cos(rad),
      y: cy + r * Math.sin(rad),
    };
  }

  function describeArc(cx, cy, r, startAngle, endAngle) {
    const start = polarToCartesian(cx, cy, r, endAngle);
    const end = polarToCartesian(cx, cy, r, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

    return [
      `M ${cx} ${cy}`,
      `L ${start.x} ${start.y}`,
      `A ${r} ${r} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`,
      "Z",
    ].join(" ");
  }

  function animateWedge(dom, startAngle, endAngle, duration = 1000) {
    const cx = 128;
    const cy = 128;
    const r = 115;

    let start = null;

    function step(timestamp) {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const currentAngle = startAngle + (endAngle - startAngle) * progress;

      const d = describeArc(cx, cy, r, startAngle, currentAngle);
      dom.setAttribute("d", d);

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }

    requestAnimationFrame(step);
  }

  useEffect(() => {
    const line1 = document.getElementById("line1")!;
    const line2 = document.getElementById("line2")!;
    const wedge1 = document.getElementById("wedge1")!;
    const wedge2 = document.getElementById("wedge2")!;

    if (count === 2) {
      line2.classList.remove("animate");
      line2.setAttribute("transform", "rotate(-30, 128, 128)");
      line1.classList.remove("animate");
      line1.setAttribute("transform", "rotate(-30, 128, 128)");
      wedge1.setAttribute("d", ""); // 초기화

      setTimeout(() => {
        line2.classList.add("animate");
        line2.setAttribute("transform", "rotate(105, 128, 128)");
        animateWedge(wedge1, -30, 105, 1000);
      }, 20);
    } else if (count === 3) {
      line2.classList.remove("animate");
      line2.setAttribute("transform", "rotate(135, 128, 128)");
      line1.classList.remove("animate");
      line1.setAttribute("transform", "rotate(135, 128, 128)");

      setTimeout(() => {
        line2.classList.add("animate");
        line2.setAttribute("transform", "rotate(225, 128, 128)");
        animateWedge(wedge2, 135, 225, 1000);
      }, 20);
    }
  }, [count]);

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center">
        {/* 시계 표시 */}
        <Time />
        {/* 범례 */}
        <div className="mt-4 flex flex-wrap gap-4 justify-center">
          {Object.entries(categoryColors).map(([category, color]) => {
            const categoryName = {
              study: "공부",
              leisure: "일상",
              daily: "취미",
              etc: "휴식",
            }[category];

            return (
              <div key={category} className="flex items-center">
                <div className={`w-4 h-4 ${color} rounded-sm mr-1`}></div>
                <span className="text-sm">{categoryName}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
