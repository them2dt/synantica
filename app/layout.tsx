import type { Metadata } from "next"
import { ThemeProvider } from "next-themes"
import { instrumentSerif } from "@/lib/fonts/instrument-serif"
import { generateMetadataWithOG } from "@/lib/og-image"
import { ToastProvider } from "@/components/ui/toast"
import { SpeedInsights } from '@vercel/speed-insights/next'
import "./globals.css"

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000"

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  ...generateMetadataWithOG(
    "Synantica - Find Your Next Career Event",
    "Discover workshops, hackathons, career fairs, and networking events that will accelerate your professional growth and connect you with opportunities."
  ),
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${instrumentSerif.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ToastProvider>
            {children}
          </ToastProvider>
        </ThemeProvider>
        <SpeedInsights />
      </body>
    </html>
  )
}
