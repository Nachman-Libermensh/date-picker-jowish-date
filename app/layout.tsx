import type { Metadata } from "next"
import { Inter, Noto_Sans_Hebrew } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { DirectionProvider } from "@/components/ui/direction"
import { TooltipProvider } from "@/components/ui/tooltip"
import { getCanonicalRoute, getSiteUrl } from "@/lib/seo"
import { cn } from "@/lib/utils"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })
const notoSansHebrew = Noto_Sans_Hebrew({
  subsets: ["hebrew"],
  variable: "--font-sans",
})

const siteUrl = getSiteUrl()
const siteName = "Date Picker עברי ולועזי ל-React"
const siteDescription =
  "רכיב Date Picker עברי ולועזי ל-React עם תמיכה ב-RTL, דוגמאות שימוש מלאות ומדריך הטמעה ל-Next.js."
const rootCanonicalUrl = getCanonicalRoute("/")

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: siteName,
  description: siteDescription,
  url: rootCanonicalUrl,
  inLanguage: ["he-IL", "en-US"],
  about: {
    "@type": "SoftwareApplication",
    name: "Hebrew Date Picker for React",
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Web",
  },
} as const

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "תאריך עברי ל-React | Hebrew Date Picker",
    template: "%s | תאריך עברי ל-React",
  },
  description: siteDescription,
  applicationName: siteName,
  keywords: [
    "תאריך עברי",
    "hebrew date picker",
    "react date picker",
    "nextjs hebrew calendar",
    "jewish date react",
    "RTL date picker",
    "לוח שנה עברי",
  ],
  alternates: {
    canonical: rootCanonicalUrl,
    languages: {
      "he-IL": rootCanonicalUrl,
      "en-US": rootCanonicalUrl,
    },
  },
  openGraph: {
    type: "website",
    locale: "he_IL",
    alternateLocale: "en_US",
    url: rootCanonicalUrl,
    title: "תאריך עברי ל-React | Hebrew Date Picker",
    description: siteDescription,
    siteName,
  },
  twitter: {
    card: "summary",
    title: "תאריך עברי ל-React | Hebrew Date Picker",
    description: siteDescription,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "developer tools",
}

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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <DirectionProvider dir="rtl">
          <ThemeProvider>
            <TooltipProvider>{children}</TooltipProvider>
          </ThemeProvider>
        </DirectionProvider>
      </body>
    </html>
  )
}
