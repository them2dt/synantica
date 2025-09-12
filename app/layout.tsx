import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { satoshi } from "@/lib/fonts/satoshi";
import { clashDisplay } from "@/lib/fonts/clash-display";
import { generateMetadataWithOG } from "@/lib/og-image";
import { Navigation } from "@/components/layout/navigation";
import { NavigationSpacer } from "@/components/layout/navigation-spacer";
import { ToastProvider } from "@/components/ui/toast";
import { AuthNav } from '@/components/layout/auth-nav';
import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  ...generateMetadataWithOG(
    "Synantica - Find Your Next Career Event",
    "Discover workshops, hackathons, career fairs, and networking events that will accelerate your professional growth and connect you with opportunities."
  ),
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${satoshi.variable} ${clashDisplay.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ToastProvider>
            <Navigation authComponent={<AuthNav />} />
            <NavigationSpacer />
            {children}
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
