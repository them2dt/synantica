import type { Metadata } from 'next'
import { GeistMono } from 'geist/font/mono'
import { Analytics } from '@vercel/analytics/next'
import { AuthProvider } from '@/lib/auth/auth-context'
import { satoshi } from '@/lib/fonts/satoshi'
import './globals.css'

export const metadata: Metadata = {
  title: 'Campus Events - Student Event Platform',
  description: 'Discover and join amazing events happening on campus',
  generator: 'Next.js',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-mono ${satoshi.variable} ${GeistMono.variable}`}>
        <AuthProvider>
          {children}
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
