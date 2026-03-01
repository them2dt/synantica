"use client"

import * as React from "react"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { DateRange } from "react-day-picker"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface DateRangePickerProps {
  value?: DateRange
  onChange?: (range: DateRange | undefined) => void
  placeholder?: string
  className?: string
  disabled?: boolean
}

export function DateRangePicker({
  value,
  onChange,
  placeholder = "Pick a date range",
  className,
  disabled = false,
}: DateRangePickerProps) {
  const [open, setOpen] = React.useState(false)
  const [startDate, setStartDate] = React.useState<Date | undefined>(value?.from)
  const [endDate, setEndDate] = React.useState<Date | undefined>(value?.to)

  React.useEffect(() => {
    setStartDate(value?.from)
    setEndDate(value?.to)
  }, [value])

  React.useEffect(() => {
    if (open) {
      setStartDate(value?.from)
      setEndDate(value?.to)
    }
  }, [open, value])

  const handleStartDateSelect = (date: Date | undefined) => {
    setStartDate(date)
    if (date && endDate && endDate < date) {
      setEndDate(undefined)
    }
  }

  const handleEndDateSelect = (date: Date | undefined) => {
    setEndDate(date)
  }

  const handleApply = () => {
    if (startDate && endDate) {
      onChange?.({ from: startDate, to: endDate })
    } else if (startDate) {
      onChange?.({ from: startDate, to: startDate })
    } else {
      onChange?.(undefined)
    }
    setOpen(false)
  }

  const handleClear = () => {
    setStartDate(undefined)
    setEndDate(undefined)
    onChange?.(undefined)
    setOpen(false)
  }

  const formatDateRange = (range: DateRange | undefined) => {
    if (!range?.from) return placeholder
    if (range.from && range.to) {
      return `${format(range.from, "dd.MM.yy")} - ${format(range.to, "dd.MM.yy")}`
    }
    return format(range.from, "dd.MM.yy")
  }

  const isStartDateDisabled = (date: Date) => {
    return date < new Date(new Date().setHours(0, 0, 0, 0))
  }

  const isEndDateDisabled = (date: Date) => {
    const today = new Date(new Date().setHours(0, 0, 0, 0))
    if (date < today) return true
    if (startDate && date < startDate) return true
    return false
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id="date"
          variant="outline"
          className={cn("w-full justify-start text-left min-w-0", !value && "text-muted-foreground", className)}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4 flex-none" />
          <span className="truncate min-w-0">{formatDateRange(value)}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-auto p-0 border border-border bg-popover"
        align="start"
        side="bottom"
        sideOffset={4}
        avoidCollisions={false}
        alignOffset={0}
      >
        <div className="flex">
          <div className="p-3 border-r border-border">
            <div className="text-sm text-center mb-2">Start Date</div>
            <Calendar
              mode="single"
              selected={startDate}
              onSelect={handleStartDateSelect}
              disabled={isStartDateDisabled}
              showOutsideDays={false}
              fixedWeeks={false}
            />
          </div>
          <div className="p-3">
            <div className="text-sm text-center mb-2">End Date</div>
            <Calendar
              mode="single"
              selected={endDate}
              onSelect={handleEndDateSelect}
              disabled={isEndDateDisabled}
              showOutsideDays={false}
              fixedWeeks={false}
            />
          </div>
        </div>
        <div className="flex items-center justify-between p-3 border-t border-border gap-2">
          <Button variant="outline" size="sm" onClick={handleClear} className="text-xs">
            Clear
          </Button>
          <div className="flex items-center gap-2">
            {startDate && !endDate && (
              <span className="text-xs text-muted-foreground">Select end date</span>
            )}
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setOpen(false)} className="text-xs">
                Cancel
              </Button>
              <Button variant="default" size="sm" onClick={handleApply} className="text-xs" disabled={!startDate}>
                Apply
              </Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
