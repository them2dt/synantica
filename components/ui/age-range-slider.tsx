"use client"

import * as React from "react"
import { Slider } from "@/components/ui/slider"
import { cn } from "@/lib/utils"

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
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{min}</span>
        <span>{max}</span>
      </div>
      <Slider
        min={min}
        max={max}
        step={step}
        value={localValue}
        onValueChange={handleValueChange}
        disabled={disabled}
      />
      <div className="flex items-center justify-between text-sm text-foreground">
        <span>{localValue[0]} years</span>
        <span>{localValue[1]} years</span>
      </div>
    </div>
  )
}
