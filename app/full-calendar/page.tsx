import type { Metadata } from "next"

import { FullScreenDualCalendar } from "@/components/date-pickers/full-screen-dual-calendar"
import { getCanonicalRoute } from "@/lib/seo"

const fullCalendarCanonicalUrl = getCanonicalRoute("/full-calendar")

export const metadata: Metadata = {
  title: "לוח שנה מלא: עברי ולועזי",
  description:
    "לוח שנה מלא ומסונכרן לתצוגה עברית ולועזית עם ניווט חודשי, תצוגה דו-מערכתית חכמה ואנימציות עדינות.",
  keywords: [
    "לוח שנה עברי",
    "לוח שנה לועזי",
    "React Hebrew calendar",
    "dual calendar",
    "react-day-picker hebrew",
  ],
  alternates: {
    canonical: fullCalendarCanonicalUrl,
  },
  openGraph: {
    type: "website",
    locale: "he_IL",
    url: fullCalendarCanonicalUrl,
    title: "לוח שנה מלא: עברי ולועזי",
    description:
      "תצוגת לוח שנה מלאה, מתוחה על כל המסך, עם מעבר חכם בין מצב עברי ללועזי וסנכרון מלא.",
  },
}

export default function FullCalendarPage() {
  return <FullScreenDualCalendar />
}
