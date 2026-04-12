import Link from "next/link"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { CodeBlock } from "@/components/ui/code-block"
import { Separator } from "@/components/ui/separator"

type StepCardProps = {
  step: string
  title: string
  description: string
  isLast?: boolean
  children: React.ReactNode
}

const installCommand = String.raw`pnpm add react-day-picker jewish-date`

const basicUsageCode = String.raw`"use client"

import * as React from "react"
import { formatJewishDateInHebrew, toJewishDate } from "jewish-date"

import { HebrewDatePicker } from "@/components/date-pickers/hebrew-date-picker"

export default function BasicHebrewDatePickerUsage() {
  const [selectedDate, setSelectedDate] = React.useState<Date>()

  return (
    <div className="max-w-xs space-y-3">
      <HebrewDatePicker
        selected={selectedDate}
        onSelect={setSelectedDate}
        todayLabel="היום"
      />

      <p className="text-sm text-muted-foreground">
        נבחר: {selectedDate ? formatJewishDateInHebrew(toJewishDate(selectedDate)) : "לא נבחר"}
      </p>
    </div>
  )
}
`

const hebrewCalendarCode = String.raw`"use client"

import * as React from "react"
import { formatJewishDateInHebrew, toJewishDate } from "jewish-date"
import { DayPicker, he } from "react-day-picker/hebrew"
import { getDefaultClassNames } from "react-day-picker"
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"

const weekdayLabels = ["א", "ב", "ג", "ד", "ה", "ו", "ש"] as const

type HebrewCalendarProps = React.ComponentProps<typeof DayPicker>

export function HebrewCalendar({
  className,
  locale = he,
  dir = "rtl",
  formatters,
  classNames,
  components,
  ...props
}: HebrewCalendarProps) {
  const defaults = getDefaultClassNames()

  const localFormatters = React.useMemo(() => {
    return {
      formatCaption: (date: Date) =>
        formatJewishDateInHebrew(toJewishDate(date), "MMMM YYYY"),
      formatDay: (date: Date) =>
        formatJewishDateInHebrew(toJewishDate(date), "D"),
      formatWeekdayName: (date: Date) => weekdayLabels[date.getDay()],
      formatMonthDropdown: (date: Date) =>
        formatJewishDateInHebrew(toJewishDate(date), "MMMM"),
      formatYearDropdown: (date: Date) =>
        formatJewishDateInHebrew(toJewishDate(date), "YYYY"),
    }
  }, [])

  return (
    <DayPicker
      {...props}
      locale={locale}
      dir={dir}
      captionLayout={props.captionLayout ?? "dropdown"}
      formatters={{ ...localFormatters, ...formatters }}
      className={cn("rounded-xl border bg-background p-3", className)}
      classNames={{
        root: cn("w-fit", defaults.root),
        months: cn("flex flex-col gap-4 md:flex-row", defaults.months),
        month: cn("flex flex-col gap-4", defaults.month),
        nav: cn(
          "absolute inset-x-0 top-0 flex items-center justify-between",
          defaults.nav
        ),
        weekday: cn("text-xs text-muted-foreground", defaults.weekday),
        day: cn("text-sm", defaults.day),
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation, className: iconClassName, ...iconProps }) => {
          if (orientation === "left") {
            return (
              <ChevronLeftIcon
                className={cn("size-4 rtl:rotate-180", iconClassName)}
                {...iconProps}
              />
            )
          }

          if (orientation === "right") {
            return (
              <ChevronRightIcon
                className={cn("size-4 rtl:rotate-180", iconClassName)}
                {...iconProps}
              />
            )
          }

          return (
            <ChevronDownIcon className={cn("size-4", iconClassName)} {...iconProps} />
          )
        },
        ...components,
      }}
    />
  )
}
`

const hebrewDatePickerCode = String.raw`"use client"

import * as React from "react"
import { CalendarIcon } from "lucide-react"
import { formatJewishDateInHebrew, toJewishDate } from "jewish-date"
import type { DateRange } from "react-day-picker"

import { Button } from "@/components/ui/button"
import { HebrewCalendar } from "@/components/ui/hebrew-calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

type SinglePickerProps = {
  mode?: "single"
  selected?: Date
  onSelect?: (selected: Date | undefined) => void
}

type MultiplePickerProps = {
  mode: "multiple"
  selected?: Date[]
  onSelect?: (selected: Date[] | undefined) => void
}

type RangePickerProps = {
  mode: "range"
  selected?: DateRange
  onSelect?: (selected: DateRange | undefined) => void
}

type HebrewDatePickerProps = (SinglePickerProps | MultiplePickerProps | RangePickerProps) &
  Omit<React.ComponentProps<typeof HebrewCalendar>, "mode" | "selected" | "onSelect"> & {
    placeholder?: string
    closeOnSelect?: boolean
    showTodayButton?: boolean
    todayLabel?: string
    triggerClassName?: string
    contentClassName?: string
  }

function formatHebrewDate(date: Date) {
  return formatJewishDateInHebrew(toJewishDate(date))
}

function buildLabel(props: SinglePickerProps | MultiplePickerProps | RangePickerProps, placeholder: string) {
  if (props.mode === "multiple") {
    const selected = props.selected

    if (!selected || selected.length === 0) {
      return placeholder
    }

    if (selected.length === 1) {
      return formatHebrewDate(selected[0])
    }

    return String(selected.length) + " תאריכים נבחרו"
  }

  if (props.mode === "range") {
    const selected = props.selected

    if (!selected?.from) {
      return placeholder
    }

    if (!selected.to) {
      return formatHebrewDate(selected.from)
    }

    return formatHebrewDate(selected.from) + " - " + formatHebrewDate(selected.to)
  }

  if (!props.selected) {
    return placeholder
  }

  return formatHebrewDate(props.selected)
}

export function HebrewDatePicker({
  placeholder = "בחר/י תאריך עברי",
  closeOnSelect,
  showTodayButton = true,
  todayLabel = "היום",
  triggerClassName,
  contentClassName,
  ...props
}: HebrewDatePickerProps) {
  const [open, setOpen] = React.useState(false)
  const [month, setMonth] = React.useState(new Date())

  const currentSelectionMonth = React.useMemo(() => {
    if (props.mode === "multiple") {
      return props.selected?.[0]
    }

    if (props.mode === "range") {
      return props.selected?.from ?? props.selected?.to
    }

    return props.selected
  }, [props.mode, props.selected])

  React.useEffect(() => {
    if (currentSelectionMonth) {
      setMonth(currentSelectionMonth)
    }
  }, [currentSelectionMonth])

  const shouldAutoClose = closeOnSelect ?? props.mode !== "multiple"
  const triggerLabel = buildLabel(props, placeholder)
  const isEmpty = triggerLabel === placeholder

  const trigger = (
    <Button
      type="button"
      variant="outline"
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

  if (props.mode === "multiple") {
    const { mode, selected, onSelect, ...calendarProps } = props

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>{trigger}</PopoverTrigger>
        <PopoverContent dir="rtl" className={cn("w-auto p-0", contentClassName)}>
          <div className="flex flex-col gap-0">
            <HebrewCalendar
              {...calendarProps}
              mode={mode}
              month={month}
              onMonthChange={setMonth}
              selected={selected}
              onSelect={(next) => {
                onSelect?.(next as Date[] | undefined)

                if (shouldAutoClose && next && next.length > 0) {
                  setOpen(false)
                }
              }}
            />
            {showTodayButton && (
              <div className="border-t p-2">
                <Button type="button" variant="secondary" size="xs" className="w-full" onClick={() => setMonth(new Date())}>
                  {todayLabel}
                </Button>
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
    )
  }

  if (props.mode === "range") {
    const { mode, selected, onSelect, ...calendarProps } = props

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>{trigger}</PopoverTrigger>
        <PopoverContent dir="rtl" className={cn("w-auto p-0", contentClassName)}>
          <div className="flex flex-col gap-0">
            <HebrewCalendar
              {...calendarProps}
              mode={mode}
              month={month}
              onMonthChange={setMonth}
              selected={selected}
              onSelect={(next) => {
                onSelect?.(next)

                if (shouldAutoClose && next?.from && next.to) {
                  setOpen(false)
                }
              }}
            />
            {showTodayButton && (
              <div className="border-t p-2">
                <Button type="button" variant="secondary" size="xs" className="w-full" onClick={() => setMonth(new Date())}>
                  {todayLabel}
                </Button>
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
    )
  }

  const { selected, onSelect, ...calendarProps } = props

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent dir="rtl" className={cn("w-auto p-0", contentClassName)}>
        <div className="flex flex-col gap-0">
          <HebrewCalendar
            {...calendarProps}
            mode="single"
            month={month}
            onMonthChange={setMonth}
            selected={selected}
            onSelect={(next) => {
              onSelect?.(next as Date | undefined)

              if (shouldAutoClose && next) {
                setOpen(false)
              }
            }}
          />
          {showTodayButton && (
            <div className="border-t p-2">
              <Button type="button" variant="secondary" size="xs" className="w-full" onClick={() => setMonth(new Date())}>
                {todayLabel}
              </Button>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
`

function StepCard({
  step,
  title,
  description,
  isLast,
  children,
}: StepCardProps) {
  return (
    <div className="relative ps-11">
      <div className="absolute inset-y-0 inset-s-0 flex flex-col items-center">
        <div className="flex size-7 items-center justify-center rounded-full border bg-background text-xs font-semibold text-muted-foreground">
          {step}
        </div>
        {!isLast && <div className="mt-2 w-px flex-1 bg-border" />}
      </div>

      <Card className="gap-4 py-5 shadow-none ring-1 ring-border/70">
        <CardHeader className="gap-2 pb-0">
          <CardTitle className="text-lg">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">{children}</CardContent>
      </Card>
    </div>
  )
}

export default function InstructionsPage() {
  return (
    <div className="min-h-svh bg-[radial-gradient(1200px_500px_at_100%_-120px,oklch(0.97_0_0),transparent)] px-4 py-8 md:px-6 md:py-12">
      <main className="mx-auto w-full max-w-4xl space-y-8">
        <header className="space-y-4">
          <Badge variant="outline" className="bg-background/80">
            Hebrew Date Picker Guide
          </Badge>

          <div className="space-y-3">
            <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
              הנחיות לבניית בורר תאריכים עברי ב-Next.js
            </h1>
            <p className="max-w-3xl text-base text-muted-foreground">
              מדריך קצר ומעשי עם קטעי קוד מוכנים להעתקה: התקנה, יצירת קומפוננטת
              קלנדר עברי, ולבסוף עטיפת Date Picker מלאה עם Popover.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button asChild variant="outline" size="sm">
              <Link href="/">חזרה לדוגמאות</Link>
            </Button>
          </div>
        </header>

        <Alert className="border-emerald-600/50 bg-emerald-100/80 dark:border-emerald-400/40 dark:bg-emerald-900/30">
          <AlertTitle>מתחילים פרויקט חדש?</AlertTitle>
          <AlertDescription>
            אם הפרויקט חדש לגמרי, אפשר להתחיל עם תבנית RTL של{" "}
            <Link
              href="https://ui.shadcn.com/docs/rtl/next"
              target="_blank"
              rel="noreferrer"
            >
              shadcn
            </Link>{" "}
            ולשלב את הרכיבים של המדריך הזה מיד אחרי יצירת הפרויקט.
          </AlertDescription>
        </Alert>

        <Separator />

        <section className="space-y-6">
          <StepCard
            step="01"
            title="התקנת התלויות react-day-picker ו-jewish-date"
            description="השלב הראשון הוא התקנת ספריית הלוח והמרת תאריכים עבריים."
          >
            <CodeBlock
              filename="terminal"
              language="bash"
              code={installCommand}
            />
            <p className="text-sm text-muted-foreground">
              אחרי ההתקנה יש לך DayPicker עם תמיכה בלוח עברי דרך import מהנתיב
              react-day-picker/hebrew, ופונקציות פורמט עברי מתוך jewish-date.
            </p>
          </StepCard>

          <StepCard
            step="02"
            title="יצירת קומפוננטת HebrewCalendar"
            description="צרו את הקובץ components/ui/hebrew-calendar.tsx והדביקו את הקוד הבא."
          >
            <CodeBlock
              filename="components/ui/hebrew-calendar.tsx"
              language="tsx"
              code={hebrewCalendarCode}
            />
          </StepCard>

          <StepCard
            step="03"
            title="הוספת קומפוננטת HebrewDatePicker"
            description="צרו את הקובץ components/date-pickers/hebrew-date-picker.tsx והדביקו את הקוד הבא."
          >
            <CodeBlock
              filename="components/date-pickers/hebrew-date-picker.tsx"
              language="tsx"
              code={hebrewDatePickerCode}
            />
          </StepCard>

          <StepCard
            step="04"
            title="דוגמת שימוש בסיסית בקומפוננטה"
            description="לאחר יצירת הקבצים, אפשר להשתמש מיד ב-HebrewDatePicker בכל עמוד Client."
            isLast
          >
            <CodeBlock
              filename="app/basic-usage-example.tsx"
              language="tsx"
              code={basicUsageCode}
            />
          </StepCard>
        </section>
      </main>
    </div>
  )
}
