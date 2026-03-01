"use client"

import * as React from "react"
import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { AgeRangeSlider } from "@/components/ui/age-range-slider"
import { cn } from "@/lib/utils"

interface AgeFilterDropdownProps {
  value?: [number, number]
  onChange?: (value: [number, number]) => void
  min?: number
  max?: number
  step?: number
  className?: string
  disabled?: boolean
  placeholder?: string
}

/**
 * Age filter dropdown that contains a slider for range selection
 */
export function AgeFilterDropdown({
  value = [18, 65],
  onChange,
  min = 0,
  max = 99,
  step = 1,
  className,
  disabled = false,
  placeholder = "Age Range"
}: AgeFilterDropdownProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [localValue, setLocalValue] = React.useState<[number, number]>(value)

  React.useEffect(() => {
    setLocalValue(value)
  }, [value])

  const handleValueChange = (newValue: [number, number]) => {
    setLocalValue(newValue)
  }

  const handleApply = () => {
    onChange?.(localValue)
    setIsOpen(false)
  }

  const formatDisplayValue = (val: [number, number]) => {
    if (val[0] === min && val[1] === max) {
      return placeholder
    }
    return `Age: ${val[0]} - ${val[1]} years`
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "flex w-full items-center justify-between whitespace-nowrap rounded-none border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-black disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
            localValue[0] === min && localValue[1] === max && "text-slate-500",
            className
          )}
          disabled={disabled}
        >
          <span className="line-clamp-1">{formatDisplayValue(localValue)}</span>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-80 p-4"
        align="start"
        side="bottom"
      >
        <div className="space-y-4">
          {/* Slider Component */}
          <div className="px-2">
            <AgeRangeSlider
              value={localValue}
              onChange={handleValueChange}
              min={min}
              max={max}
              step={step}
              disabled={disabled}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleApply}
              className="text-xs"
            >
              Apply
            </Button>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

/**
 * Compact version for use in filter bars
 */
export function CompactAgeFilterDropdown({
  value = [18, 65],
  onChange,
  min = 0,
  max = 99,
  step = 1,
  className,
  disabled = false,
  placeholder = "Age"
}: AgeFilterDropdownProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [localValue, setLocalValue] = React.useState<[number, number]>(value)

  React.useEffect(() => {
    setLocalValue(value)
  }, [value])

  const handleValueChange = (newValue: [number, number]) => {
    setLocalValue(newValue)
  }

  const handleApply = () => {
    onChange?.(localValue)
    setIsOpen(false)
  }

  const formatDisplayValue = (val: [number, number]) => {
    if (val[0] === min && val[1] === max) {
      return placeholder
    }
    return `Age: ${val[0]}-${val[1]}`
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "flex w-full items-center justify-between whitespace-nowrap rounded-none border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-black disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
            localValue[0] === min && localValue[1] === max && "text-slate-500",
            className
          )}
          disabled={disabled}
        >
          <span className="line-clamp-1">{formatDisplayValue(localValue)}</span>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-72 p-3"
        align="start"
        side="bottom"
      >
        <div className="space-y-3">
          {/* Compact Slider */}
          <div className="px-1">
            <AgeRangeSlider
              value={localValue}
              onChange={handleValueChange}
              min={min}
              max={max}
              step={step}
              disabled={disabled}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2 pt-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="text-xs h-7 px-2"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleApply}
              className="text-xs h-7 px-2"
            >
              Apply
            </Button>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
