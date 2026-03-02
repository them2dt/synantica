"use client"

import * as React from "react"
import { Slider } from "@/components/ui/slider"
import { cn } from "@/lib/utils"
import { ThemedText } from "@/components/ui/themed-text"

interface AgeRangeSliderProps {
  value?: [number, number]
  onChange?: (value: [number, number]) => void
  min?: number
  max?: number
  step?: number
  className?: string
  disabled?: boolean
}

export function AgeRangeSlider({
  value,
  onChange,
  min = 0,
  max = 99,
  step = 1,
  className,
  disabled = false,
}: AgeRangeSliderProps) {
  const [localValue, setLocalValue] = React.useState<[number, number]>(value ?? [min, max])

  React.useEffect(() => {
    if (value) setLocalValue(value)
  }, [value])

  const handleValueChange = (newValue: number[]) => {
    const nextValue: [number, number] = [newValue[0] ?? min, newValue[1] ?? max]
    setLocalValue(nextValue)
    onChange?.(nextValue)
  }

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between">
        <ThemedText variant="xs" color="muted">{min}</ThemedText>
        <ThemedText variant="xs" color="muted">{max}</ThemedText>
      </div>
      <div className="relative flex items-center h-4"> {/* Added a wrapper div for positioning */}
        <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 absolute top-1 rounded-none border border-slate-200 dark:border-slate-800" />
        <div
          className="h-2 bg-slate-950 dark:bg-slate-50 absolute top-1 rounded-none"
          style={{
            left: `${((localValue[0] - min) / (max - min)) * 100}%`,
            right: `${100 - ((localValue[1] - min) / (max - min)) * 100}%`
          }}
        />
        <Slider
          min={min}
          max={max}
          step={step}
          value={localValue}
          onValueChange={handleValueChange}
          disabled={disabled}
          className="relative z-10" // Ensure slider is above custom track/range
        />
      </div>
      <div className="flex items-center justify-between">
        <ThemedText variant="sm">{localValue[0]} years</ThemedText>
        <ThemedText variant="sm">{localValue[1]} years</ThemedText>
      </div>
    </div>
  )
}
