import type { DateRange } from "react-day-picker"

export type PickerMode = "single" | "multiple" | "range"

export type SinglePickerProps = {
  mode?: "single"
  selected?: Date
  onSelect?: (selected: Date | undefined) => void
}

export type MultiplePickerProps = {
  mode: "multiple"
  selected?: Date[]
  onSelect?: (selected: Date[] | undefined) => void
}

export type RangePickerProps = {
  mode: "range"
  selected?: DateRange
  onSelect?: (selected: DateRange | undefined) => void
}

export type ReusablePickerSelectionProps =
  | SinglePickerProps
  | MultiplePickerProps
  | RangePickerProps
