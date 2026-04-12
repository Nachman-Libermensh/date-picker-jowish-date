"use client"

import * as React from "react"
import Link from "next/link"
import { format } from "date-fns"
import { formatJewishDateInHebrew, toJewishDate } from "jewish-date"
import type { DateRange } from "react-day-picker"

import { DatePicker } from "@/components/date-pickers/date-picker"
import { HebrewDatePicker } from "@/components/date-pickers/hebrew-date-picker"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

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

function formatGregorianDate(date?: Date) {
  if (!date) {
    return "לא נבחר"
  }

  return format(date, "dd/MM/yyyy")
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

function formatRangeGregorian(range?: DateRange) {
  if (!range?.from) {
    return "לא נבחר טווח"
  }

  if (!range.to) {
    return `התחלה: ${formatGregorianDate(range.from)}`
  }

  return `${formatGregorianDate(range.from)} - ${formatGregorianDate(range.to)}`
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

  const [hebrewSingleBasic, setHebrewSingleBasic] = React.useState<Date>()
  const [hebrewMultipleBasic, setHebrewMultipleBasic] = React.useState<Date[]>(
    []
  )
  const [hebrewRangeBasic, setHebrewRangeBasic] = React.useState<DateRange>()

  const [hebrewSingleNoWeekends, setHebrewSingleNoWeekends] =
    React.useState<Date>()
  const [hebrewMultipleLimited, setHebrewMultipleLimited] = React.useState<
    Date[]
  >([])
  const [hebrewRangeNoWeekends, setHebrewRangeNoWeekends] =
    React.useState<DateRange>()
  const [hebrewRangePlanning, setHebrewRangePlanning] =
    React.useState<DateRange>()

  const [gregorianSingleBasic, setGregorianSingleBasic] = React.useState<Date>()
  const [gregorianMultipleBasic, setGregorianMultipleBasic] = React.useState<
    Date[]
  >([])
  const [gregorianRangeBasic, setGregorianRangeBasic] =
    React.useState<DateRange>()

  const [gregorianSingleNoWeekends, setGregorianSingleNoWeekends] =
    React.useState<Date>()
  const [gregorianMultipleLimited, setGregorianMultipleLimited] =
    React.useState<Date[]>([])
  const [gregorianRangeNoWeekends, setGregorianRangeNoWeekends] =
    React.useState<DateRange>()
  const [gregorianRangePlanning, setGregorianRangePlanning] =
    React.useState<DateRange>()

  const toArrayOrEmpty = React.useCallback((nextDates: Date[] | undefined) => {
    return nextDates ?? []
  }, [])

  const toLastFour = React.useCallback((nextDates: Date[] | undefined) => {
    if (!nextDates?.length) {
      return []
    }

    return nextDates.slice(-4)
  }, [])

  const handleHebrewMultipleBasicSelect = React.useCallback(
    (nextDates: Date[] | undefined) => {
      setHebrewMultipleBasic(toArrayOrEmpty(nextDates))
    },
    [toArrayOrEmpty]
  )

  const handleHebrewMultipleLimitedSelect = React.useCallback(
    (nextDates: Date[] | undefined) => {
      setHebrewMultipleLimited(toLastFour(nextDates))
    },
    [toLastFour]
  )

  const handleGregorianMultipleBasicSelect = React.useCallback(
    (nextDates: Date[] | undefined) => {
      setGregorianMultipleBasic(toArrayOrEmpty(nextDates))
    },
    [toArrayOrEmpty]
  )

  const handleGregorianMultipleLimitedSelect = React.useCallback(
    (nextDates: Date[] | undefined) => {
      setGregorianMultipleLimited(toLastFour(nextDates))
    },
    [toLastFour]
  )

  return (
    <div className="min-h-svh bg-muted/40 p-6">
      <div className="mx-auto w-full max-w-6xl space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>דוגמאות DatePicker עברי ולועזי</CardTitle>
            <CardDescription>
              מעבר בין טאבים, דוגמאות רגילות ליחיד/רבים/טווח, ודוגמאות מתקדמות
              עם מגבלות בחירה וכפתור היום.
            </CardDescription>
            <div className="pt-2">
              <Button asChild variant="outline" size="sm">
                <Link href="/instructions">מעבר לעמוד הנחיות</Link>
              </Button>
            </div>
          </CardHeader>
        </Card>

        <Tabs defaultValue="hebrew">
          <TabsList className="grid w-full grid-cols-2 md:w-fit">
            <TabsTrigger value="hebrew">תאריכים עבריים</TabsTrigger>
            <TabsTrigger value="gregorian">תאריכים לועזיים</TabsTrigger>
          </TabsList>

          <TabsContent value="hebrew" className="mt-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>בחירה יחידה רגילה</CardTitle>
                  <CardDescription>שימוש בסיסי במצב single.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <HebrewDatePicker
                    selected={hebrewSingleBasic}
                    onSelect={setHebrewSingleBasic}
                    todayLabel="היום"
                  />
                  <p className="text-sm text-muted-foreground">
                    נבחר: {formatGregorianDateInHebrew(hebrewSingleBasic)}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>בחירה מרובה רגילה</CardTitle>
                  <CardDescription>שימוש בסיסי במצב multiple.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <HebrewDatePicker
                    mode="multiple"
                    selected={hebrewMultipleBasic}
                    onSelect={handleHebrewMultipleBasicSelect}
                    closeOnSelect={false}
                    todayLabel="היום"
                  />
                  <p className="text-sm text-muted-foreground">
                    נבחרו: {hebrewMultipleBasic.length}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>בחירת טווח רגילה</CardTitle>
                  <CardDescription>שימוש בסיסי במצב range.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <HebrewDatePicker
                    mode="range"
                    selected={hebrewRangeBasic}
                    onSelect={setHebrewRangeBasic}
                    todayLabel="היום"
                  />
                  <p className="text-sm text-muted-foreground">
                    טווח: {formatRangeInHebrew(hebrewRangeBasic)}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>יחיד ללא שישי ושבת</CardTitle>
                  <CardDescription>
                    דוגמה עם חסימת סופי שבוע ותאריכים לא זמינים.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <HebrewDatePicker
                    selected={hebrewSingleNoWeekends}
                    onSelect={setHebrewSingleNoWeekends}
                    disabled={[{ dayOfWeek: [5, 6] }, ...blackoutDays]}
                    startMonth={today}
                    endMonth={addDays(today, 180)}
                    todayLabel="היום"
                  />
                  <p className="text-sm text-muted-foreground">
                    נבחר: {formatGregorianDateInHebrew(hebrewSingleNoWeekends)}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>מרובה עם מגבלת 4</CardTitle>
                  <CardDescription>
                    נשמרים רק 4 התאריכים האחרונים.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <HebrewDatePicker
                    mode="multiple"
                    selected={hebrewMultipleLimited}
                    onSelect={handleHebrewMultipleLimitedSelect}
                    closeOnSelect={false}
                    disabled={[{ before: today }, { dayOfWeek: [5, 6] }]}
                    startMonth={today}
                    endMonth={addDays(today, 120)}
                    todayLabel="היום"
                  />
                  <p className="text-sm text-muted-foreground">
                    נבחרו: {hebrewMultipleLimited.length} / 4
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>טווח ללא שישי/שבת</CardTitle>
                  <CardDescription>
                    חסימת תאריכי עבר, סופי שבוע ותאריכים ספציפיים.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <HebrewDatePicker
                    mode="range"
                    selected={hebrewRangeNoWeekends}
                    onSelect={setHebrewRangeNoWeekends}
                    disabled={[
                      { before: today },
                      { dayOfWeek: [5, 6] },
                      ...blockedRangeDays,
                    ]}
                    startMonth={today}
                    endMonth={addDays(today, 180)}
                    todayLabel="היום"
                  />
                  <p className="text-sm text-muted-foreground">
                    טווח: {formatRangeInHebrew(hebrewRangeNoWeekends)}
                  </p>
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>טווח לתכנון עתידי</CardTitle>
                  <CardDescription>
                    בחירת טווח רק החל מעוד שבועיים ועד כחמישה חודשים קדימה.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 md:max-w-md">
                  <HebrewDatePicker
                    mode="range"
                    selected={hebrewRangePlanning}
                    onSelect={setHebrewRangePlanning}
                    disabled={[
                      { before: addDays(today, 14) },
                      { after: addDays(today, 150) },
                    ]}
                    startMonth={today}
                    endMonth={addDays(today, 180)}
                    todayLabel="היום"
                  />
                  <p className="text-sm text-muted-foreground">
                    טווח: {formatRangeInHebrew(hebrewRangePlanning)}
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="gregorian" className="mt-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>בחירה יחידה רגילה</CardTitle>
                  <CardDescription>שימוש בסיסי במצב single.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <DatePicker
                    selected={gregorianSingleBasic}
                    onSelect={setGregorianSingleBasic}
                    placeholder="בחר/י תאריך לועזי"
                    todayLabel="היום"
                  />
                  <p className="text-sm text-muted-foreground">
                    נבחר: {formatGregorianDate(gregorianSingleBasic)}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>בחירה מרובה רגילה</CardTitle>
                  <CardDescription>שימוש בסיסי במצב multiple.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <DatePicker
                    mode="multiple"
                    selected={gregorianMultipleBasic}
                    onSelect={handleGregorianMultipleBasicSelect}
                    closeOnSelect={false}
                    placeholder="בחר/י תאריכים"
                    todayLabel="היום"
                  />
                  <p className="text-sm text-muted-foreground">
                    נבחרו: {gregorianMultipleBasic.length}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>בחירת טווח רגילה</CardTitle>
                  <CardDescription>שימוש בסיסי במצב range.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <DatePicker
                    mode="range"
                    selected={gregorianRangeBasic}
                    onSelect={setGregorianRangeBasic}
                    placeholder="בחר/י טווח תאריכים"
                    todayLabel="היום"
                  />
                  <p className="text-sm text-muted-foreground">
                    טווח: {formatRangeGregorian(gregorianRangeBasic)}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>יחיד ללא שישי ושבת</CardTitle>
                  <CardDescription>
                    חסימת סופי שבוע ומספר תאריכים לא זמינים.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <DatePicker
                    selected={gregorianSingleNoWeekends}
                    onSelect={setGregorianSingleNoWeekends}
                    disabled={[{ dayOfWeek: [5, 6] }, ...blackoutDays]}
                    startMonth={today}
                    endMonth={addDays(today, 180)}
                    placeholder="בחר/י תאריך לועזי"
                    todayLabel="היום"
                  />
                  <p className="text-sm text-muted-foreground">
                    נבחר: {formatGregorianDate(gregorianSingleNoWeekends)}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>מרובה עם מגבלת 4</CardTitle>
                  <CardDescription>
                    נשמרים רק 4 התאריכים האחרונים.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <DatePicker
                    mode="multiple"
                    selected={gregorianMultipleLimited}
                    onSelect={handleGregorianMultipleLimitedSelect}
                    closeOnSelect={false}
                    disabled={[{ before: today }, { dayOfWeek: [5, 6] }]}
                    startMonth={today}
                    endMonth={addDays(today, 120)}
                    placeholder="בחר/י תאריכים"
                    todayLabel="היום"
                  />
                  <p className="text-sm text-muted-foreground">
                    נבחרו: {gregorianMultipleLimited.length} / 4
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>טווח ללא שישי/שבת</CardTitle>
                  <CardDescription>
                    חסימת תאריכי עבר, סופי שבוע ותאריכים ספציפיים.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <DatePicker
                    mode="range"
                    selected={gregorianRangeNoWeekends}
                    onSelect={setGregorianRangeNoWeekends}
                    disabled={[
                      { before: today },
                      { dayOfWeek: [5, 6] },
                      ...blockedRangeDays,
                    ]}
                    startMonth={today}
                    endMonth={addDays(today, 180)}
                    placeholder="בחר/י טווח תאריכים"
                    todayLabel="היום"
                  />
                  <p className="text-sm text-muted-foreground">
                    טווח: {formatRangeGregorian(gregorianRangeNoWeekends)}
                  </p>
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>טווח לתכנון עתידי</CardTitle>
                  <CardDescription>
                    בחירת טווח רק החל מעוד שבועיים ועד כחמישה חודשים קדימה.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 md:max-w-md">
                  <DatePicker
                    mode="range"
                    selected={gregorianRangePlanning}
                    onSelect={setGregorianRangePlanning}
                    disabled={[
                      { before: addDays(today, 14) },
                      { after: addDays(today, 150) },
                    ]}
                    startMonth={today}
                    endMonth={addDays(today, 180)}
                    placeholder="בחר/י טווח תאריכים"
                    todayLabel="היום"
                  />
                  <p className="text-sm text-muted-foreground">
                    טווח: {formatRangeGregorian(gregorianRangePlanning)}
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
