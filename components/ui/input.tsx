"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ChevronUp, ChevronDown } from "lucide-react"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: "default" | "time"
  onTimeConfirm?: (hours: number, minutes: number) => void
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, variant = "default", onTimeConfirm, ...props }, ref) => {
    // For time input variant
    const [hours, setHours] = React.useState<number>(0)
    const [minutes, setMinutes] = React.useState<number>(0)

    const incrementHours = () => {
      const newHours = hours >= 11 ? 0 : hours + 1
      setHours(newHours)
      if (onTimeConfirm) {
        onTimeConfirm(newHours, minutes)
      }
    }

    const decrementHours = () => {
      const newHours = hours <= 0 ? 11 : hours - 1
      setHours(newHours)
      if (onTimeConfirm) {
        onTimeConfirm(newHours, minutes)
      }
    }

    const incrementMinutes = () => {
      const newMinutes = minutes >= 50 ? 0 : minutes + 10
      setMinutes(newMinutes)
      if (onTimeConfirm) {
        onTimeConfirm(hours, newMinutes)
      }
    }

    const decrementMinutes = () => {
      const newMinutes = minutes <= 0 ? 50 : minutes - 10
      setMinutes(newMinutes)
      if (onTimeConfirm) {
        onTimeConfirm(hours, newMinutes)
      }
    }

    const handleHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = Number.parseInt(e.target.value)
      if (!isNaN(value) && value >= 0 && value <= 11) {
        setHours(value)
        if (onTimeConfirm) {
          onTimeConfirm(value, minutes)
        }
      } else if (e.target.value === "") {
        setHours(0)
      }
    }

    const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = Number.parseInt(e.target.value)
      // Only allow multiples of 10 for minutes
      if (!isNaN(value) && value >= 0 && value <= 50 && value % 10 === 0) {
        setMinutes(value)
        if (onTimeConfirm) {
          onTimeConfirm(hours, value)
        }
      } else if (e.target.value === "") {
        setMinutes(0)
      }
    }

    const handleConfirm = () => {
      if (onTimeConfirm) {
        onTimeConfirm(hours, minutes)
      }
    }

    if (variant === "time") {
      return (
        <div className="flex items-center space-x-2">
          {/* Hours input with buttons beside it */}
          <div className="flex items-center">
            <input
              type="text"
              value={hours.toString().padStart(2, "0")}
              onChange={handleHoursChange}
              className="h-10 w-12 rounded-l-md border border-input bg-background px-2 py-2 text-sm text-center"
              maxLength={2}
            />
            <div className="flex flex-col">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-5 w-6 p-0 rounded-none rounded-tr-md border-l-0"
                onClick={incrementHours}
              >
                <ChevronUp className="h-3 w-3" />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-5 w-6 p-0 rounded-none rounded-br-md border-l-0 border-t-0"
                onClick={decrementHours}
              >
                <ChevronDown className="h-3 w-3" />
              </Button>
            </div>
          </div>

          <span className="text-xl font-bold">:</span>

          {/* Minutes input with buttons beside it */}
          <div className="flex items-center">
            <input
              type="text"
              value={minutes.toString().padStart(2, "0")}
              onChange={handleMinutesChange}
              className="h-10 w-12 rounded-l-md border border-input bg-background px-2 py-2 text-sm text-center"
              maxLength={2}
            />
            <div className="flex flex-col">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-5 w-6 p-0 rounded-none rounded-tr-md border-l-0"
                onClick={incrementMinutes}
              >
                <ChevronUp className="h-3 w-3" />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-5 w-6 p-0 rounded-none rounded-br-md border-l-0 border-t-0"
                onClick={decrementMinutes}
              >
                <ChevronDown className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      )
    }

    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        ref={ref}
        {...props}
      />
    )
  },
)
Input.displayName = "Input"

export { Input }
