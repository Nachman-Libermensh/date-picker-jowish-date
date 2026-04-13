import { endOfMonth, format, startOfMonth } from "date-fns"
import {
  calcDaysInMonth,
  formatJewishDateInHebrew,
  toGregorianDate,
  toJewishDate,
} from "jewish-date"

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

function formatHebrewMonthRange(startDate: Date, endDate: Date) {
  const startJewishDate = toJewishDate(startDate)
  const endJewishDate = toJewishDate(endDate)

  const sameMonth =
    startJewishDate.monthName === endJewishDate.monthName &&
    startJewishDate.year === endJewishDate.year

  if (sameMonth) {
    return formatJewishDateInHebrew(startJewishDate, "MMMM YYYY")
  }

  const sameYear = startJewishDate.year === endJewishDate.year

  if (sameYear) {
    return `${formatJewishDateInHebrew(startJewishDate, "MMMM")}-${formatJewishDateInHebrew(endJewishDate, "MMMM YYYY")}`
  }

  return `${formatJewishDateInHebrew(startJewishDate, "MMMM YYYY")}-${formatJewishDateInHebrew(endJewishDate, "MMMM YYYY")}`
}

export function formatHebrewPrimaryCaption(monthDate: Date) {
  const jewishDate = toJewishDate(monthDate)
  const daysInJewishMonth = calcDaysInMonth(
    jewishDate.year,
    jewishDate.monthName
  )

  const monthStartGregorian = toGregorianDate({
    year: jewishDate.year,
    monthName: jewishDate.monthName,
    day: 1,
  })

  const monthEndGregorian = toGregorianDate({
    year: jewishDate.year,
    monthName: jewishDate.monthName,
    day: daysInJewishMonth,
  })

  const hebrewCaption = formatJewishDateInHebrew(jewishDate, "MMMM YYYY")
  const gregorianRange = formatGregorianMonthRange(
    monthStartGregorian,
    monthEndGregorian
  )

  return `${hebrewCaption} • ${gregorianRange}`
}

export function formatGregorianPrimaryCaption(monthDate: Date) {
  const gregorianCaption = format(monthDate, "LLLL yyyy")
  const hebrewRange = formatHebrewMonthRange(
    startOfMonth(monthDate),
    endOfMonth(monthDate)
  )

  return `${gregorianCaption} • ${hebrewRange}`
}

export function getHebrewDayLabel(date: Date) {
  return formatJewishDateInHebrew(toJewishDate(date), "D")
}

export function getGregorianDayLabel(date: Date) {
  return format(date, "d")
}
