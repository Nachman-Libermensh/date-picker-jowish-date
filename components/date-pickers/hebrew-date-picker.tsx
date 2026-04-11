"use client"

import * as React from "react"

import { CalendarIcon } from "lucide-react"
import { formatJewishDateInHebrew, toJewishDate } from "jewish-date"

import { Button } from "@/components/ui/button"
import { HebrewCalendar } from "@/components/ui/hebrew-calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { ReusablePickerSelectionProps } from "./types"

type HebrewDatePickerProps = ReusablePickerSelectionProps &
  Omit<
    React.ComponentProps<typeof HebrewCalendar>,
    "mode" | "selected" | "onSelect"
  > & {
    placeholder?: string
    triggerClassName?: string
    contentClassName?: string
    closeOnSelect?: boolean
    open?: boolean
    onOpenChange?: (open: boolean) => void
    align?: React.ComponentProps<typeof PopoverContent>["align"]
    showTodayButton?: boolean
    todayLabel?: string
  }

function formatGregorianDateInHebrew(date: Date) {
  return formatJewishDateInHebrew(toJewishDate(date))
}

function getInitialMonthFromSelection(props: ReusablePickerSelectionProps) {
  if (props.mode === "multiple") {
    return props.selected?.[0]
  }

  if (props.mode === "range") {
    return props.selected?.from ?? props.selected?.to
  }

  return props.selected
}

function buildTriggerLabel(
  props: ReusablePickerSelectionProps,
  placeholder: string
) {
  if (props.mode === "multiple") {
    const selected = props.selected
    console.log("selected: ", selected)

    if (!selected || selected.length === 0) {
      return placeholder
    }

    if (selected.length === 1) {
      return formatGregorianDateInHebrew(selected[0])
    }

    return `${selected.length} תאריכים נבחרו`
  }

  if (props.mode === "range") {
    const selected = props.selected

    if (!selected?.from) {
      return placeholder
    }

    if (!selected.to) {
      return formatGregorianDateInHebrew(selected.from)
    }

    return `${formatGregorianDateInHebrew(selected.from)} - ${formatGregorianDateInHebrew(selected.to)}`
  }

  if (!props.selected) {
    return placeholder
  }

  return formatGregorianDateInHebrew(props.selected)
}

function HebrewDatePicker({
  placeholder = "בחר/י תאריך עברי",
  triggerClassName,
  contentClassName,
  closeOnSelect,
  open: openProp,
  onOpenChange,
  align = "start",
  showTodayButton = true,
  todayLabel = "היום",
  ...props
}: HebrewDatePickerProps) {
  const [internalOpen, setInternalOpen] = React.useState(false)
  const {
    month: monthProp,
    onMonthChange: onMonthChangeProp,
    defaultMonth,
    ...selectionProps
  } = props

  const [internalMonth, setInternalMonth] = React.useState<Date>(() => {
    return (
      monthProp ??
      defaultMonth ??
      getInitialMonthFromSelection(selectionProps) ??
      new Date()
    )
  })
  const monthFromSelection = React.useMemo(() => {
    if (selectionProps.mode === "multiple") {
      return selectionProps.selected?.[0]
    }

    if (selectionProps.mode === "range") {
      return selectionProps.selected?.from ?? selectionProps.selected?.to
    }

    return selectionProps.selected
  }, [selectionProps.mode, selectionProps.selected])

  const open = openProp ?? internalOpen
  const setOpen = React.useCallback(
    (nextOpen: boolean) => {
      if (openProp === undefined) {
        setInternalOpen(nextOpen)
      }

      onOpenChange?.(nextOpen)
    },
    [openProp, onOpenChange]
  )

  React.useEffect(() => {
    if (monthProp !== undefined) {
      return
    }

    if (monthFromSelection) {
      setInternalMonth(monthFromSelection)
    }
  }, [monthFromSelection, monthProp])

  const visibleMonth = monthProp ?? internalMonth
  const setVisibleMonth = React.useCallback(
    (nextMonth: Date) => {
      if (monthProp === undefined) {
        setInternalMonth(nextMonth)
      }

      onMonthChangeProp?.(nextMonth)
    },
    [monthProp, onMonthChangeProp]
  )

  const goToToday = React.useCallback(() => {
    setVisibleMonth(new Date())
  }, [setVisibleMonth])

  const triggerLabel = buildTriggerLabel(selectionProps, placeholder)
  const isEmpty = triggerLabel === placeholder
  const shouldAutoClose = closeOnSelect ?? selectionProps.mode !== "multiple"

  const trigger = (
    <Button
      type="button"
      variant="outline"
      dir="rtl"
      className={cn(
        "w-full justify-between gap-2 text-right font-normal",
        isEmpty && "text-muted-foreground",
        triggerClassName
      )}
    >
      <span className="truncate">{triggerLabel}</span>
      <CalendarIcon className="size-4 opacity-70" />
    </Button>
  )

  const renderWithPopover = (calendarNode: React.ReactNode) => (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>

      <PopoverContent
        dir="rtl"
        className={cn("w-auto p-0", contentClassName)}
        align={align}
      >
        <div className="flex flex-col gap-0">
          {calendarNode}

          {showTodayButton && (
            <div className="border-t p-2">
              <Button
                type="button"
                variant="secondary"
                size="xs"
                className="w-full"
                onClick={goToToday}
              >
                {todayLabel}
              </Button>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )

  if (selectionProps.mode === "multiple") {
    const { mode, selected, onSelect, ...calendarProps } = selectionProps

    return renderWithPopover(
      <HebrewCalendar
        {...calendarProps}
        captionLayout={calendarProps.captionLayout ?? "dropdown"}
        month={visibleMonth}
        onMonthChange={setVisibleMonth}
        mode={mode}
        selected={selected}
        onSelect={(next) => {
          onSelect?.(next as Date[] | undefined)

          if (shouldAutoClose && next && next.length > 0) {
            setOpen(false)
          }
        }}
      />
    )
  }

  if (selectionProps.mode === "range") {
    const { mode, selected, onSelect, ...calendarProps } = selectionProps

    return renderWithPopover(
      <HebrewCalendar
        {...calendarProps}
        captionLayout={calendarProps.captionLayout ?? "dropdown"}
        month={visibleMonth}
        onMonthChange={setVisibleMonth}
        mode={mode}
        selected={selected}
        onSelect={(next) => {
          onSelect?.(next)

          if (shouldAutoClose && next?.from && next.to) {
            setOpen(false)
          }
        }}
      />
    )
  }

  const { selected, onSelect, ...calendarProps } = selectionProps

  return renderWithPopover(
    <HebrewCalendar
      {...calendarProps}
      captionLayout={calendarProps.captionLayout ?? "dropdown"}
      month={visibleMonth}
      onMonthChange={setVisibleMonth}
      mode="single"
      selected={selected}
      onSelect={(next) => {
        onSelect?.(next as Date | undefined)

        if (shouldAutoClose && next) {
          setOpen(false)
        }
      }}
    />
  )
}

export { HebrewDatePicker }
