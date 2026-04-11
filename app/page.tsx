"use client"

import * as React from "react"
import { formatJewishDateInHebrew, toJewishDate } from "jewish-date"
import type { DateRange } from "react-day-picker"

import { HebrewDatePicker } from "@/components/date-pickers/hebrew-date-picker"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

function startOfDay(date: Date) {
  const nextDate = new Date(date)
  nextDate.setHours(0, 0, 0, 0)
  return nextDate
}

function addDays(date: Date, days: number) {
  const nextDate = new Date(date)
  nextDate.setDate(nextDate.getDate() + days)
  return startOfDay(nextDate)
}

function formatGregorianDateInHebrew(date?: Date) {
  if (!date) {
    return "לא נבחר"
  }

  return formatJewishDateInHebrew(toJewishDate(date))
}

function formatRangeInHebrew(range?: DateRange) {
  if (!range?.from) {
    return "לא נבחר טווח"
  }

  if (!range.to) {
    return `התחלה: ${formatGregorianDateInHebrew(range.from)}`
  }

  return `${formatGregorianDateInHebrew(range.from)} - ${formatGregorianDateInHebrew(range.to)}`
}

export default function Page() {
  const today = React.useMemo(() => startOfDay(new Date()), [])
  const blackoutDays = React.useMemo(
    () => [addDays(today, 3), addDays(today, 11), addDays(today, 20)],
    [today]
  )
  const blockedRangeDays = React.useMemo(
    () => [addDays(today, 7), addDays(today, 8), addDays(today, 15)],
    [today]
  )

  const [singleNoWeekends, setSingleNoWeekends] = React.useState<Date>()
  const [singleWindow, setSingleWindow] = React.useState<Date>()
  const [multipleDates, setMultipleDates] = React.useState<Date[]>([])
  const [rangeNoWeekends, setRangeNoWeekends] = React.useState<DateRange>()
  const [rangePlanning, setRangePlanning] = React.useState<DateRange>()

  const handleMultipleSelect = React.useCallback(
    (nextDates: Date[] | undefined) => {
      if (!nextDates?.length) {
        setMultipleDates([])
        return
      }

      setMultipleDates(nextDates.slice(-4))
    },
    []
  )

  return (
    <div className="min-h-svh bg-muted/40 p-6">
      <div className="mx-auto grid w-full max-w-6xl gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>בחירה יחידה ללא שישי ושבת</CardTitle>
            <CardDescription>
              דוגמה לבחירה יחידה עם חסימת סופי שבוע ותאריכים לא זמינים.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <HebrewDatePicker
              selected={singleNoWeekends}
              onSelect={setSingleNoWeekends}
              disabled={[{ dayOfWeek: [5, 6] }, ...blackoutDays]}
              startMonth={today}
              endMonth={addDays(today, 180)}
            />
            <p className="text-sm text-muted-foreground">
              נבחר: {formatGregorianDateInHebrew(singleNoWeekends)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>בחירה יחידה בחלון של 30 ימים</CardTitle>
            <CardDescription>
              אפשר לבחור רק מהיום ועד 30 יום קדימה, עם מספר ימים חסומים באמצע.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <HebrewDatePicker
              selected={singleWindow}
              onSelect={setSingleWindow}
              disabled={[
                { before: today },
                { after: addDays(today, 30) },
                addDays(today, 6),
                addDays(today, 14),
                addDays(today, 22),
              ]}
              startMonth={today}
              endMonth={addDays(today, 30)}
            />
            <p className="text-sm text-muted-foreground">
              נבחר: {formatGregorianDateInHebrew(singleWindow)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>בחירה מרובה עם מגבלת כמות</CardTitle>
            <CardDescription>
              מצב multiple עד 4 תאריכים, בלי תאריכי עבר ובלי שישי/שבת.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <HebrewDatePicker
              mode="multiple"
              selected={multipleDates}
              onSelect={handleMultipleSelect}
              closeOnSelect={false}
              disabled={[{ before: today }, { dayOfWeek: [5, 6] }]}
              startMonth={today}
              endMonth={addDays(today, 120)}
            />
            <p className="text-sm text-muted-foreground">
              נבחרו: {multipleDates.length} / 4
            </p>
            {multipleDates.length > 0 && (
              <p className="text-sm text-muted-foreground">
                {multipleDates
                  .map((date) => formatGregorianDateInHebrew(date))
                  .join(", ")}
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>בחירת טווח ללא שישי/שבת</CardTitle>
            <CardDescription>
              מצב range עם מניעת חציה דרך ימים חסומים ותאריכי עבר.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <HebrewDatePicker
              mode="range"
              selected={rangeNoWeekends}
              onSelect={setRangeNoWeekends}
              disabled={[
                { before: today },
                { dayOfWeek: [5, 6] },
                ...blockedRangeDays,
              ]}
              startMonth={today}
              endMonth={addDays(today, 180)}
            />
            <p className="text-sm text-muted-foreground">
              טווח: {formatRangeInHebrew(rangeNoWeekends)}
            </p>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>טווח לתכנון עתידי</CardTitle>
            <CardDescription>
              אפשר לבחור טווח רק החל מעוד שבועיים ועד כחמישה חודשים קדימה.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 md:max-w-md">
            <HebrewDatePicker
              mode="range"
              selected={rangePlanning}
              onSelect={setRangePlanning}
              disabled={[
                { before: addDays(today, 14) },
                { after: addDays(today, 150) },
              ]}
              startMonth={today}
              endMonth={addDays(today, 180)}
            />
            <p className="text-sm text-muted-foreground">
              טווח: {formatRangeInHebrew(rangePlanning)}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
