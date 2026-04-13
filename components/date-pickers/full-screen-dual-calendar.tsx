"use client"

import * as React from "react"
import Link from "next/link"
import { format } from "date-fns"
import {
  formatJewishDate,
  formatJewishDateInHebrew,
  toJewishDate,
} from "jewish-date"
import { AnimatePresence, motion } from "framer-motion"
import { ArrowRight, CalendarDays, Languages, RotateCcw } from "lucide-react"
import { getDefaultClassNames, type DayButton } from "react-day-picker"
import { he } from "react-day-picker/hebrew"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import { Calendar, CalendarDayButton } from "@/components/ui/calendar"
import {
  HebrewCalendar,
  HebrewCalendarDayButton,
} from "@/components/ui/hebrew-calendar"
import { useIsMobile } from "@/hooks/use-mobile"
import {
  formatGregorianPrimaryCaption,
  formatHebrewPrimaryCaption,
  getGregorianDayLabel,
  getHebrewDayLabel,
} from "@/lib/dual-calendar-format"
import { cn } from "@/lib/utils"

type CalendarViewMode = "hebrew" | "gregorian"

type DualDayButtonProps = React.ComponentProps<typeof DayButton>

const headerVariants = {
  hidden: { opacity: 0, y: -12 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease: "easeOut",
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
} as const

const headerItemVariants = {
  hidden: { opacity: 0, y: -8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.28, ease: "easeOut" } },
} as const

const panelVariants = {
  initial: { opacity: 0, y: 20, scale: 0.99 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -16, scale: 0.99 },
} as const

function HebrewPrimaryDayButton(props: DualDayButtonProps) {
  const secondaryLabel = getGregorianDayLabel(props.day.date)

  return (
    <HebrewCalendarDayButton {...props}>
      {props.children ?? getHebrewDayLabel(props.day.date)}
      <span>{secondaryLabel}</span>
    </HebrewCalendarDayButton>
  )
}

function GregorianPrimaryDayButton(props: DualDayButtonProps) {
  const secondaryLabel = getHebrewDayLabel(props.day.date)

  return (
    <CalendarDayButton {...props}>
      {props.children ?? getGregorianDayLabel(props.day.date)}
      <span>{secondaryLabel}</span>
    </CalendarDayButton>
  )
}

function buildFullScreenClassNames(
  isMobile: boolean,
  defaults: ReturnType<typeof getDefaultClassNames>
) {
  return {
    root: cn(defaults.root, "h-full w-full"),
    months: cn(
      defaults.months,
      "relative h-full w-full items-stretch",
      isMobile ? "flex flex-col" : "grid grid-cols-2 gap-6"
    ),
    month: cn(defaults.month, "flex h-full w-full flex-col gap-4"),
    table: "h-full w-full border-collapse",
    week: cn(defaults.week, "mt-2 flex w-full flex-1"),
  }
}

export function FullScreenDualCalendar() {
  const isMobile = useIsMobile()

  const [viewMode, setViewMode] = React.useState<CalendarViewMode>("hebrew")
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
    new Date()
  )
  const [visibleMonth, setVisibleMonth] = React.useState<Date>(new Date())

  const numberOfMonths = isMobile ? 1 : 2
  const defaultClassNames = React.useMemo(() => getDefaultClassNames(), [])
  const sharedClassNames = React.useMemo(
    () => buildFullScreenClassNames(isMobile, defaultClassNames),
    [defaultClassNames, isMobile]
  )

  const selectedGregorianLabel = React.useMemo(() => {
    if (!selectedDate) {
      return "לא נבחר"
    }

    return format(selectedDate, "EEEE, dd/MM/yyyy")
  }, [selectedDate])

  const selectedHebrewLabel = React.useMemo(() => {
    if (!selectedDate) {
      return "לא נבחר"
    }

    return formatJewishDateInHebrew(toJewishDate(selectedDate))
  }, [selectedDate])

  const selectedHebrewLatinLabel = React.useMemo(() => {
    if (!selectedDate) {
      return "Not selected"
    }

    return formatJewishDate(toJewishDate(selectedDate))
  }, [selectedDate])

  const goToToday = React.useCallback(() => {
    const today = new Date()
    setVisibleMonth(today)
    setSelectedDate(today)
  }, [])

  return (
    <div className="relative min-h-svh overflow-hidden bg-muted/35">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,hsl(var(--primary)/0.12)_0%,transparent_45%),radial-gradient(circle_at_bottom_right,hsl(var(--foreground)/0.08)_0%,transparent_40%)]" />

      <div className="relative flex min-h-svh flex-col">
        <motion.header
          variants={headerVariants}
          initial="hidden"
          animate="show"
          className="border-b border-border/70 bg-background/90 px-3 py-3 backdrop-blur-sm sm:px-6 sm:py-4"
        >
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <motion.div variants={headerItemVariants} className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-lg font-semibold tracking-tight sm:text-2xl">
                  לוח שנה מלא - עברי ולועזי
                </h1>
                <Badge variant="secondary" className="gap-1">
                  <Languages className="size-3" />
                  מצב דו-תצוגתי
                </Badge>
              </div>

              <p className="max-w-4xl text-sm text-muted-foreground">
                בכל מצב מוצגים גם התאריך העברי וגם הלועזי: היום הראשי מוצג לפי
                מצב התצוגה, ובכל תא מופיע גם התאריך המשני. הכותרת מציגה הקשר חכם
                של טווח החודשים במערכת המקבילה.
              </p>
            </motion.div>

            <motion.div
              variants={headerItemVariants}
              className="flex flex-wrap items-center gap-2"
            >
              <ButtonGroup className="w-full sm:w-auto">
                <Button
                  type="button"
                  variant={viewMode === "hebrew" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("hebrew")}
                  className="min-w-28"
                >
                  עברי ראשי
                </Button>
                <Button
                  type="button"
                  variant={viewMode === "gregorian" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("gregorian")}
                  className="min-w-28"
                >
                  לועזי ראשי
                </Button>
              </ButtonGroup>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={goToToday}
              >
                <RotateCcw className="size-4" />
                חזרה להיום
              </Button>

              <Button asChild type="button" variant="ghost" size="sm">
                <Link href="/">
                  <ArrowRight className="size-4" />
                  חזרה לדוגמאות
                </Link>
              </Button>
            </motion.div>
          </div>

          <motion.div
            variants={headerItemVariants}
            className="mt-3 grid gap-2 text-xs text-muted-foreground sm:grid-cols-3"
          >
            <div className="rounded-md border border-border/70 bg-background/70 px-2.5 py-1.5">
              <span className="font-medium text-foreground">לועזי:</span>{" "}
              {selectedGregorianLabel}
            </div>
            <div className="rounded-md border border-border/70 bg-background/70 px-2.5 py-1.5">
              <span className="font-medium text-foreground">עברי:</span>{" "}
              {selectedHebrewLabel}
            </div>
            <div className="rounded-md border border-border/70 bg-background/70 px-2.5 py-1.5">
              <span className="font-medium text-foreground">Hebrew:</span>{" "}
              {selectedHebrewLatinLabel}
            </div>
          </motion.div>
        </motion.header>

        <main className="flex-1 p-0">
          <AnimatePresence mode="wait" initial={false}>
            {viewMode === "hebrew" ? (
              <motion.section
                key="hebrew-calendar-view"
                variants={panelVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="h-full w-full"
              >
                <HebrewCalendar
                  mode="single"
                  dir="rtl"
                  locale={he}
                  month={visibleMonth}
                  onMonthChange={setVisibleMonth}
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  numberOfMonths={numberOfMonths}
                  pagedNavigation={!isMobile}
                  captionLayout="label"
                  className="h-full w-full rounded-none border-0 bg-transparent p-2 [--cell-size:clamp(2.6rem,6.4vw,5.1rem)] sm:p-5"
                  classNames={sharedClassNames}
                  formatters={{
                    formatCaption: formatHebrewPrimaryCaption,
                  }}
                  components={{
                    DayButton: HebrewPrimaryDayButton,
                  }}
                />
              </motion.section>
            ) : (
              <motion.section
                key="gregorian-calendar-view"
                variants={panelVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="h-full w-full"
              >
                <Calendar
                  mode="single"
                  dir="rtl"
                  locale={he}
                  month={visibleMonth}
                  onMonthChange={setVisibleMonth}
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  numberOfMonths={numberOfMonths}
                  pagedNavigation={!isMobile}
                  captionLayout="label"
                  className="h-full w-full rounded-none border-0 bg-transparent p-2 [--cell-size:clamp(2.6rem,6.4vw,5.1rem)] sm:p-5"
                  classNames={sharedClassNames}
                  formatters={{
                    formatCaption: formatGregorianPrimaryCaption,
                  }}
                  components={{
                    DayButton: GregorianPrimaryDayButton,
                  }}
                />
              </motion.section>
            )}
          </AnimatePresence>
        </main>

        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.25 }}
          className="border-t border-border/70 bg-background/75 px-3 py-2 text-xs text-muted-foreground backdrop-blur-sm sm:px-6"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1">
              <CalendarDays className="size-3.5" />
              ניווט חודשי מלא עם סנכרון בין מערכות התאריכים
            </span>
            <span>בחירת יום בכל מצב מעדכנת מיד את שתי התצוגות</span>
          </div>
        </motion.footer>
      </div>
    </div>
  )
}
