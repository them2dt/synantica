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

/**
 * Age range slider component with two draggable handles
 * Allows users to select a minimum and maximum age range
 */
export function AgeRangeSlider({
  value = [18, 65],
  onChange,
  min = 0,
  max = 99,
  step = 1,
  className,
  disabled = false
}: AgeRangeSliderProps) {
  const [localValue, setLocalValue] = React.useState<[number, number]>(value)

  React.useEffect(() => {
    setLocalValue(value)
  }, [value])

  const handleValueChange = (newValue: number[]) => {
    const [minAge, maxAge] = newValue as [number, number]
    const clampedValue: [number, number] = [
      Math.max(min, Math.min(max, minAge)),
      Math.max(min, Math.min(max, maxAge))
    ]
    
    setLocalValue(clampedValue)
    onChange?.(clampedValue)
  }

  return (
    <div className={cn("w-full space-y-4", className)}>
      {/* Value Display */}
      <div className="flex items-center justify-center text-sm font-medium text-foreground">
        {localValue[0]} - {localValue[1]} years
      </div>

      {/* Slider */}
      <div className="px-2">
        <Slider
          value={localValue}
          onValueChange={handleValueChange}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          className="w-full [&_[data-slot=slider-range]]:bg-accent [&_[data-slot=slider-thumb]]:border-accent"
        />
      </div>

      {/* Min/Max Labels */}
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{min} years</span>
        <span>{max} years</span>
      </div>
    </div>
  )
}

/**
 * Compact version of the age range slider for use in filter bars
 */
export function CompactAgeRangeSlider({
  value = [18, 65],
  onChange,
  min = 0,
  max = 99,
  step = 1,
  className,
  disabled = false
}: AgeRangeSliderProps) {
  const [localValue, setLocalValue] = React.useState<[number, number]>(value)

  React.useEffect(() => {
    setLocalValue(value)
  }, [value])

  const handleValueChange = (newValue: number[]) => {
    const [minAge, maxAge] = newValue as [number, number]
    const clampedValue: [number, number] = [
      Math.max(min, Math.min(max, minAge)),
      Math.max(min, Math.min(max, maxAge))
    ]
    
    setLocalValue(clampedValue)
    onChange?.(clampedValue)
  }

  return (
    <div className={cn("w-full space-y-2", className)}>
      {/* Compact Value Display */}
      <div className="text-center text-sm font-medium text-foreground">
        {localValue[0]} - {localValue[1]} years
      </div>

      {/* Compact Slider */}
      <div className="px-1">
        <Slider
          value={localValue}
          onValueChange={handleValueChange}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          className="w-full [&_[data-slot=slider-range]]:bg-accent [&_[data-slot=slider-thumb]]:border-accent"
        />
      </div>
    </div>
  )
}
