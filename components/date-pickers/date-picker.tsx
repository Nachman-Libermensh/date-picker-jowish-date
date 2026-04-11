"use client"

import * as React from "react"

import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

import type { ReusablePickerSelectionProps } from "@/components/date-pickers/types"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

type DatePickerProps = ReusablePickerSelectionProps &
  Omit<
    React.ComponentProps<typeof Calendar>,
    "mode" | "selected" | "onSelect"
  > & {
    placeholder?: string
    triggerClassName?: string
    contentClassName?: string
    closeOnSelect?: boolean
    open?: boolean
    onOpenChange?: (open: boolean) => void
    align?: React.ComponentProps<typeof PopoverContent>["align"]
  }

function buildTriggerLabel(
  props: ReusablePickerSelectionProps,
  placeholder: string
) {
  if (props.mode === "multiple") {
    const selected = props.selected

    if (!selected || selected.length === 0) {
      return placeholder
    }

    if (selected.length === 1) {
      return format(selected[0], "dd/MM/yyyy")
    }

    return `${selected.length} dates selected`
  }

  if (props.mode === "range") {
    const selected = props.selected

    if (!selected?.from) {
      return placeholder
    }

    if (!selected.to) {
      return format(selected.from, "dd/MM/yyyy")
    }

    return `${format(selected.from, "dd/MM/yyyy")} - ${format(
      selected.to,
      "dd/MM/yyyy"
    )}`
  }

  if (!props.selected) {
    return placeholder
  }

  return format(props.selected, "dd/MM/yyyy")
}

function DatePicker({
  placeholder = "Select date",
  triggerClassName,
  contentClassName,
  closeOnSelect,
  open: openProp,
  onOpenChange,
  align = "start",
  ...props
}: DatePickerProps) {
  const [internalOpen, setInternalOpen] = React.useState(false)

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

  const triggerLabel = buildTriggerLabel(props, placeholder)
  const isEmpty = triggerLabel === placeholder
  const shouldAutoClose = closeOnSelect ?? props.mode !== "multiple"

  const trigger = (
    <Button
      type="button"
      variant="outline"
      className={cn(
        "w-full justify-between gap-2 text-left font-normal",
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
        className={cn("w-auto p-0", contentClassName)}
        align={align}
      >
        {calendarNode}
      </PopoverContent>
    </Popover>
  )

  if (props.mode === "multiple") {
    const { mode, selected, onSelect, ...calendarProps } = props

    return renderWithPopover(
      <Calendar
        {...calendarProps}
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

  if (props.mode === "range") {
    const { mode, selected, onSelect, ...calendarProps } = props

    return renderWithPopover(
      <Calendar
        {...calendarProps}
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

  const { selected, onSelect, ...calendarProps } = props

  return renderWithPopover(
    <Calendar
      {...calendarProps}
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

export { DatePicker }
