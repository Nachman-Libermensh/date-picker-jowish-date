"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { addMonths, format } from "date-fns"
import {
  HDate,
  Locale,
  Location,
  Zmanim,
  gematriya,
  months,
} from "@hebcal/core"
import { AnimatePresence, motion } from "framer-motion"
import {
  ArrowRight,
  CalendarDays,
  Languages,
  MapPinIcon,
  RotateCcw,
  Settings2Icon,
} from "lucide-react"
import { getDefaultClassNames, type DayButton } from "react-day-picker"
import { he } from "react-day-picker/hebrew"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Calendar, CalendarDayButton } from "@/components/ui/calendar"
import {
  HebrewCalendar,
  HebrewCalendarDayButton,
} from "@/components/ui/hebrew-calendar"
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"
import { cn } from "@/lib/utils"

type CalendarViewMode = "hebrew" | "gregorian"
type DualDayButtonProps = React.ComponentProps<typeof DayButton>

type OptionItem = {
  value: string
  label: string
}

type PlaceOption = OptionItem & {
  hebcalLookup: string
}

type ZmanRow = {
  label: string
  value: string
}

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

const placeOptions: PlaceOption[] = [
  { value: "51", label: "ירושלים", hebcalLookup: "Jerusalem" },
  { value: "1", label: "תל אביב", hebcalLookup: "Tel Aviv" },
  { value: "3", label: "חיפה", hebcalLookup: "Haifa" },
  { value: "45", label: "באר שבע", hebcalLookup: "Beer Sheva" },
]

const methodOptions: OptionItem[] = [
  { value: "0", label: "ברירת מחדל" },
  { value: "1", label: "מגן אברהם" },
  { value: "2", label: 'גר"א' },
]

const defaultPlaceId = placeOptions[0].value
const defaultMethodId = methodOptions[0].value
const hebrewWeekdayLabels = ["א", "ב", "ג", "ד", "ה", "ו", "ש"] as const

function formatGregorianMonthRange(startDate: Date, endDate: Date) {
  const sameMonth =
    startDate.getMonth() === endDate.getMonth() &&
    startDate.getFullYear() === endDate.getFullYear()

  if (sameMonth) {
    return format(startDate, "MMM yyyy")
  }

  const sameYear = startDate.getFullYear() === endDate.getFullYear()

  if (sameYear) {
    return `${format(startDate, "MMM")}-${format(endDate, "MMM yyyy")}`
  }

  return `${format(startDate, "MMM yyyy")}-${format(endDate, "MMM yyyy")}`
}

function getHebrewMonthName(hdate: HDate) {
  return Locale.gettext(hdate.getMonthName(), "he-x-NoNikud")
}

function formatHebrewMonthYear(hdate: HDate) {
  return `${getHebrewMonthName(hdate)} ${gematriya(hdate.getFullYear())}`
}

function formatHebrewMonthRange(startDate: Date, endDate: Date) {
  const startHebrew = new HDate(startDate)
  const endHebrew = new HDate(endDate)

  const sameMonth =
    startHebrew.getMonth() === endHebrew.getMonth() &&
    startHebrew.getFullYear() === endHebrew.getFullYear()

  if (sameMonth) {
    return formatHebrewMonthYear(startHebrew)
  }

  const sameYear = startHebrew.getFullYear() === endHebrew.getFullYear()

  if (sameYear) {
    return `${getHebrewMonthName(startHebrew)}-${getHebrewMonthName(endHebrew)} ${gematriya(startHebrew.getFullYear())}`
  }

  return `${formatHebrewMonthYear(startHebrew)}-${formatHebrewMonthYear(endHebrew)}`
}

function formatHebcalDayInHebrew(date: Date) {
  return gematriya(new HDate(date).getDate())
}

function formatGregorianDayNumber(date: Date) {
  return format(date, "d")
}

function formatHebrewPrimaryCaptionForPage(monthDate: Date) {
  const monthHebrewDate = new HDate(monthDate)
  const monthStart = new HDate(
    1,
    monthHebrewDate.getMonth(),
    monthHebrewDate.getFullYear()
  )
  const monthEnd = new HDate(
    monthHebrewDate.daysInMonth(),
    monthHebrewDate.getMonth(),
    monthHebrewDate.getFullYear()
  )

  return `${formatHebrewMonthYear(monthHebrewDate)} • ${formatGregorianMonthRange(monthStart.greg(), monthEnd.greg())}`
}

function formatGregorianPrimaryCaptionForPage(monthDate: Date) {
  const gregorianCaption = format(monthDate, "LLLL yyyy")
  const gregorianMonthStart = new Date(
    monthDate.getFullYear(),
    monthDate.getMonth(),
    1
  )
  const gregorianMonthEnd = new Date(
    monthDate.getFullYear(),
    monthDate.getMonth() + 1,
    0
  )

  return `${gregorianCaption} • ${formatHebrewMonthRange(gregorianMonthStart, gregorianMonthEnd)}`
}

function toInt(value: string | null) {
  if (!value) {
    return undefined
  }

  const parsed = Number.parseInt(value, 10)

  if (Number.isNaN(parsed)) {
    return undefined
  }

  return parsed
}

function isSameHebrewMonth(first: Date, second: Date) {
  const firstHebrew = new HDate(first)
  const secondHebrew = new HDate(second)

  return (
    firstHebrew.getFullYear() === secondHebrew.getFullYear() &&
    firstHebrew.getMonth() === secondHebrew.getMonth()
  )
}

function readOptionValue(
  rawValue: string | null,
  options: OptionItem[],
  fallback: string
) {
  if (!rawValue) {
    return fallback
  }

  const exists = options.some((option) => option.value === rawValue)
  return exists ? rawValue : fallback
}

function hebrewParamsToMonthDate(
  hMonthRaw: string | null,
  hYearRaw: string | null
) {
  const tishreiMonth = toInt(hMonthRaw)
  const year = toInt(hYearRaw)

  if (
    !tishreiMonth ||
    !year ||
    tishreiMonth < 1 ||
    year < 5000 ||
    year > 7000
  ) {
    return undefined
  }

  if (tishreiMonth > HDate.monthsInYear(year)) {
    return undefined
  }

  try {
    return new HDate(1, months.TISHREI, year)
      .add(tishreiMonth - 1, "month")
      .greg()
  } catch {
    return undefined
  }
}

function getOptionLabel(options: OptionItem[], value: string) {
  return options.find((option) => option.value === value)?.label ?? "-"
}

function getLocationByPlaceId(placeId: string) {
  const lookupName =
    placeOptions.find((option) => option.value === placeId)?.hebcalLookup ??
    "Jerusalem"

  return (
    Location.lookup(lookupName) ??
    new Location(31.778, 35.235, true, "Asia/Jerusalem", "Jerusalem", "IL")
  )
}

function HebrewPrimaryDayButton(props: DualDayButtonProps) {
  const secondaryLabel = formatGregorianDayNumber(props.day.date)

  return (
    <HebrewCalendarDayButton {...props}>
      {props.children ?? formatHebcalDayInHebrew(props.day.date)}
      <span>{secondaryLabel}</span>
    </HebrewCalendarDayButton>
  )
}

function GregorianPrimaryDayButton(props: DualDayButtonProps) {
  const secondaryLabel = formatHebcalDayInHebrew(props.day.date)

  return (
    <CalendarDayButton {...props}>
      {props.children ?? formatGregorianDayNumber(props.day.date)}
      <span>{secondaryLabel}</span>
    </CalendarDayButton>
  )
}

function buildFullScreenClassNames(
  defaults: ReturnType<typeof getDefaultClassNames>
) {
  return {
    root: cn(defaults.root, "h-full w-full"),
    months: cn(
      defaults.months,
      "relative flex h-full w-full flex-col items-stretch"
    ),
    month: cn(defaults.month, "flex h-full w-full flex-col gap-4"),
    table: "h-full w-full border-collapse",
    week: cn(defaults.week, "mt-2 flex w-full flex-1"),
  }
}

export function FullScreenDualCalendar() {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()
  const isInternalQueryUpdateRef = React.useRef(false)
  const pendingQueryRef = React.useRef<string | null>(null)

  const searchParamsString = searchParams.toString()
  const parsedSearchParams = React.useMemo(
    () => new URLSearchParams(searchParamsString),
    [searchParamsString]
  )

  const rawHMonth = parsedSearchParams.get("hmonth")
  const rawHYear = parsedSearchParams.get("hyear")
  const rawPlaceId = parsedSearchParams.get("placeId")
  const rawMethodId = parsedSearchParams.get("methodId")

  const queryMonthDate = React.useMemo(
    () => hebrewParamsToMonthDate(rawHMonth, rawHYear),
    [rawHMonth, rawHYear]
  )
  const queryPlaceId = React.useMemo(
    () => readOptionValue(rawPlaceId, placeOptions, defaultPlaceId),
    [rawPlaceId]
  )
  const queryMethodId = React.useMemo(
    () => readOptionValue(rawMethodId, methodOptions, defaultMethodId),
    [rawMethodId]
  )

  const [viewMode, setViewMode] = React.useState<CalendarViewMode>("hebrew")
  const [placeId, setPlaceId] = React.useState(queryPlaceId)
  const [methodId, setMethodId] = React.useState(queryMethodId)
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
    new Date()
  )
  const [visibleMonth, setVisibleMonth] = React.useState<Date>(
    () => queryMonthDate ?? new Date()
  )

  const numberOfMonths = 1

  const defaultClassNames = React.useMemo(() => getDefaultClassNames(), [])
  const sharedClassNames = React.useMemo(
    () => buildFullScreenClassNames(defaultClassNames),
    [defaultClassNames]
  )

  React.useEffect(() => {
    if (isInternalQueryUpdateRef.current) {
      isInternalQueryUpdateRef.current = false
      return
    }

    setVisibleMonth((currentVisibleMonth) => {
      if (
        !queryMonthDate ||
        isSameHebrewMonth(queryMonthDate, currentVisibleMonth)
      ) {
        return currentVisibleMonth
      }

      return queryMonthDate
    })

    setPlaceId((currentPlaceId) =>
      currentPlaceId === queryPlaceId ? currentPlaceId : queryPlaceId
    )

    setMethodId((currentMethodId) =>
      currentMethodId === queryMethodId ? currentMethodId : queryMethodId
    )
  }, [queryMethodId, queryMonthDate, queryPlaceId])

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

    return new HDate(selectedDate).renderGematriya(true)
  }, [selectedDate])

  const selectedHebrewLatinLabel = React.useMemo(() => {
    if (!selectedDate) {
      return "Not selected"
    }

    return new HDate(selectedDate).toString()
  }, [selectedDate])

  const visibleHebrewMonth = React.useMemo(
    () => new HDate(visibleMonth),
    [visibleMonth]
  )
  const visibleHebrewTishreiMonth = visibleHebrewMonth.getTishreiMonth()
  const visibleHebrewYear = visibleHebrewMonth.getFullYear()

  const activeLocation = React.useMemo(
    () => getLocationByPlaceId(placeId),
    [placeId]
  )

  const zmanimRows = React.useMemo<ZmanRow[]>(() => {
    try {
      const dateForZmanim = selectedDate ?? new Date()
      const zmanim = new Zmanim(activeLocation, dateForZmanim, true)
      const formatter = activeLocation.getTimeFormatter()
      const isMagenAvraham = methodId === "1"

      const sofZmanShma = isMagenAvraham
        ? zmanim.sofZmanShmaMGA()
        : zmanim.sofZmanShma()
      const sofZmanTfilla = isMagenAvraham
        ? zmanim.sofZmanTfillaMGA()
        : zmanim.sofZmanTfilla()

      return [
        { label: "עלות השחר", value: formatter.format(zmanim.alotHaShachar()) },
        { label: "הנץ החמה", value: formatter.format(zmanim.sunrise()) },
        { label: "סוף זמן שמע", value: formatter.format(sofZmanShma) },
        { label: "סוף זמן תפילה", value: formatter.format(sofZmanTfilla) },
        { label: "שקיעה", value: formatter.format(zmanim.sunset()) },
        { label: "צאת הכוכבים", value: formatter.format(zmanim.tzeit()) },
      ]
    } catch {
      return []
    }
  }, [activeLocation, methodId, selectedDate])

  const queryPreview = React.useMemo(
    () =>
      `?hmonth=${visibleHebrewTishreiMonth}&hyear=${visibleHebrewYear}&placeId=${placeId}&methodId=${methodId}`,
    [methodId, placeId, visibleHebrewTishreiMonth, visibleHebrewYear]
  )

  const activePlaceLabel = React.useMemo(
    () => getOptionLabel(placeOptions, placeId),
    [placeId]
  )

  const activeMethodLabel = React.useMemo(
    () => getOptionLabel(methodOptions, methodId),
    [methodId]
  )

  React.useEffect(() => {
    const params = new URLSearchParams(searchParamsString)
    let hasChanges = false

    const targetValues = [
      ["hmonth", String(visibleHebrewTishreiMonth)],
      ["hyear", String(visibleHebrewYear)],
      ["placeId", placeId],
      ["methodId", methodId],
    ] as const

    for (const [key, value] of targetValues) {
      if (params.get(key) !== value) {
        params.set(key, value)
        hasChanges = true
      }
    }

    if (!hasChanges) {
      pendingQueryRef.current = null
      return
    }

    const nextQuery = params.toString()

    if (pendingQueryRef.current === nextQuery) {
      return
    }

    pendingQueryRef.current = nextQuery
    isInternalQueryUpdateRef.current = true

    router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, {
      scroll: false,
    })
  }, [
    methodId,
    pathname,
    placeId,
    router,
    searchParamsString,
    visibleHebrewTishreiMonth,
    visibleHebrewYear,
  ])

  const onMonthChange = React.useCallback((nextMonth: Date) => {
    setVisibleMonth(nextMonth)
  }, [])

  const goToNextMonth = React.useCallback(() => {
    setVisibleMonth((currentMonth) => addMonths(currentMonth, 1))
  }, [])

  const goToPreviousMonth = React.useCallback(() => {
    setVisibleMonth((currentMonth) => addMonths(currentMonth, -1))
  }, [])

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
                  עברי
                </Button>
                <Button
                  type="button"
                  variant={viewMode === "gregorian" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("gregorian")}
                  className="min-w-28"
                >
                  לועזי
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

        <section className="border-b border-border/70 bg-background/70 px-3 py-3 sm:px-6 sm:py-4">
          <div className="grid gap-3 lg:grid-cols-[auto_1fr] xl:grid-cols-[auto_auto_1fr_auto]">
            <div className="flex flex-wrap items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={goToPreviousMonth}
              >
                חודש קודם
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={goToNextMonth}
              >
                חודש הבא
              </Button>
            </div>

            <div className="rounded-lg border border-border/70 bg-background/70 px-3 py-2">
              <div className="text-xs text-muted-foreground">חודש פעיל</div>
              <div className="text-sm font-medium">
                {formatHebrewMonthYear(visibleHebrewMonth)}
              </div>
              <div className="text-xs text-muted-foreground">
                {format(visibleMonth, "MMMM yyyy")}
              </div>
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPinIcon className="size-3.5" />
                  מקום
                </div>
                <NativeSelect
                  className="w-full"
                  value={placeId}
                  onChange={(event) => setPlaceId(event.target.value)}
                >
                  {placeOptions.map((option) => (
                    <NativeSelectOption key={option.value} value={option.value}>
                      {option.label}
                    </NativeSelectOption>
                  ))}
                </NativeSelect>
              </div>

              <div className="space-y-1">
                <div className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                  <Settings2Icon className="size-3.5" />
                  שיטת חישוב
                </div>
                <NativeSelect
                  className="w-full"
                  value={methodId}
                  onChange={(event) => setMethodId(event.target.value)}
                >
                  {methodOptions.map((option) => (
                    <NativeSelectOption key={option.value} value={option.value}>
                      {option.label}
                    </NativeSelectOption>
                  ))}
                </NativeSelect>
              </div>
            </div>

            <div className="rounded-lg border border-border/70 bg-background/70 px-3 py-2">
              <div className="text-xs text-muted-foreground">Query params</div>
              <div className="truncate text-xs font-medium" dir="ltr">
                {queryPreview}
              </div>
            </div>
          </div>
        </section>

        <main className="flex-1 px-2 py-3 sm:px-6 sm:py-4">
          <div className="h-full rounded-xl border border-border/70 bg-background/70">
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
                    onMonthChange={onMonthChange}
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    numberOfMonths={numberOfMonths}
                    pagedNavigation={false}
                    captionLayout="dropdown"
                    className="h-full w-full rounded-none border-0 bg-transparent p-2 [--cell-size:clamp(2.6rem,6.4vw,5.1rem)] sm:p-5"
                    classNames={sharedClassNames}
                    formatters={{
                      formatCaption: formatHebrewPrimaryCaptionForPage,
                      formatDay: formatHebcalDayInHebrew,
                      formatMonthDropdown: (date) =>
                        getHebrewMonthName(new HDate(date)),
                      formatYearDropdown: (date) =>
                        gematriya(new HDate(date).getFullYear()),
                      formatWeekdayName: (weekdayDate) =>
                        hebrewWeekdayLabels[weekdayDate.getDay()],
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
                    onMonthChange={onMonthChange}
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    numberOfMonths={numberOfMonths}
                    pagedNavigation={false}
                    captionLayout="dropdown"
                    className="h-full w-full rounded-none border-0 bg-transparent p-2 [--cell-size:clamp(2.6rem,6.4vw,5.1rem)] sm:p-5"
                    classNames={sharedClassNames}
                    formatters={{
                      formatCaption: formatGregorianPrimaryCaptionForPage,
                    }}
                    components={{
                      DayButton: GregorianPrimaryDayButton,
                    }}
                  />
                </motion.section>
              )}
            </AnimatePresence>
          </div>
        </main>

        <section className="border-t border-border/70 px-3 py-3 sm:px-6 sm:py-4">
          <div className="grid gap-3 lg:grid-cols-2 xl:grid-cols-4">
            <Card size="sm">
              <CardHeader>
                <CardTitle>נתוני חודש</CardTitle>
                <CardDescription>
                  תצוגה מרוכזת של החודש הפעיל בשתי המערכות.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">חודש עברי</span>
                  <span>{formatHebrewMonthYear(visibleHebrewMonth)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">חודש לועזי</span>
                  <span>{format(visibleMonth, "MMMM yyyy")}</span>
                </div>
              </CardContent>
            </Card>

            <Card size="sm">
              <CardHeader>
                <CardTitle>הקשר תצוגה</CardTitle>
                <CardDescription>
                  פריסת הלוח נשארת מלאה, והמידע המשלים מוצג באזורים נפרדים.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">מצב פעיל</span>
                  <span>{viewMode === "hebrew" ? "עברי" : "לועזי"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">תאריך נבחר</span>
                  <span>{selectedHebrewLabel}</span>
                </div>
              </CardContent>
            </Card>

            <Card size="sm">
              <CardHeader>
                <CardTitle>הגדרות סנכרון</CardTitle>
                <CardDescription>
                  תומך בשיתוף קישור עם חודש, שנה, מקום ושיטת חישוב.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">מקום</span>
                  <span>{activePlaceLabel}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">שיטה</span>
                  <span>{activeMethodLabel}</span>
                </div>
              </CardContent>
            </Card>

            <Card size="sm">
              <CardHeader>
                <CardTitle>זמני היום</CardTitle>
                <CardDescription>
                  מחושב עם @hebcal/core לפי מקום ושיטת החישוב שנבחרו.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">אזור זמן</span>
                  <span dir="ltr">{activeLocation.getTzid()}</span>
                </div>

                {zmanimRows.length > 0 ? (
                  zmanimRows.map((row) => (
                    <div
                      key={row.label}
                      className="flex items-center justify-between"
                    >
                      <span className="text-muted-foreground">{row.label}</span>
                      <span>{row.value}</span>
                    </div>
                  ))
                ) : (
                  <div className="text-muted-foreground">
                    לא ניתן לחשב זמני היום עבור הנתונים הנוכחיים.
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </section>

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
