import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { satoshi } from "@/lib/fonts/satoshi";
import { generateMetadataWithOG } from "@/lib/og-image";
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${satoshi.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
