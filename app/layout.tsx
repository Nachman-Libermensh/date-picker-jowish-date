import { Geist, Geist_Mono, Inter, Noto_Sans_Hebrew } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"
import { TooltipProvider } from "@/components/ui/tooltip"
import { DirectionProvider } from "@/components/ui/direction"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })
export const metadata = {
  title: "תאריך עברי - רכיב תאריך עברי ל-React",
  description:
    "רכיב תאריך עברי ל-React עם תמיכה בש RTL, כולל תיעוד והדגמות שימוש.",
}
const notoSansHebrew = Noto_Sans_Hebrew({
  subsets: ["hebrew"],
  variable: "--font-sans",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      dir="rtl"
      lang="he-IL"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        // fontMono.variable,
        notoSansHebrew.variable,
        "font-sans",
        inter.variable
      )}
    >
      <body>
        <DirectionProvider dir="rtl">
          <ThemeProvider>
            <TooltipProvider>{children}</TooltipProvider>
          </ThemeProvider>
        </DirectionProvider>
      </body>
    </html>
  )
}
