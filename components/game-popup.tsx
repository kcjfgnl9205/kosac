"use client"
import { X, PartyPopper, Skull } from "lucide-react"
import { Button } from "@/components/ui/button"

interface GamePopupProps {
  isOpen: boolean
  onClose: () => void
  type: "benefit" | "penalty"
  message: string
}

export default function GamePopup({ isOpen, onClose, type, message }: GamePopupProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg animate-fadeIn">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold flex items-center">
            {type === "benefit" ? (
              <>
                <PartyPopper className="mr-2 text-yellow-500" size={24} />
                <span className="text-green-600">혜택!</span>
              </>
            ) : (
              <>
                <Skull className="mr-2 text-red-500" size={24} />
                <span className="text-red-600">벌칙!</span>
              </>
            )}
          </h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200">
            <X size={20} />
          </button>
        </div>

        <div className="text-center py-6 text-lg font-medium">{message}</div>

        <Button
          onClick={onClose}
          className={`w-full ${
            type === "benefit" ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"
          } text-white py-2 rounded`}
        >
          확인
        </Button>
      </div>
    </div>
  )
}
