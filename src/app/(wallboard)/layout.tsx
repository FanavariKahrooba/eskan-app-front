import "./globals.css";
import type { Metadata } from "next";
import type { Viewport } from "next";
import NextTopLoader from "nextjs-toploader";
export const metadata: Metadata = {
  title: " سامانه اسکان سرای محله | پنل مدیریت",
  description: "",
};
import localFont from "next/font/local";
import { ReactQueryProvider } from "@/providers/react-query-provider";
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "green" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};
const myFont = localFont({ src: "../../fonts/Estedad.woff2" });

export default function WallboardRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <body className={`antialiased   ${myFont.className} scroll-smooth`}>
        <NextTopLoader color="oklch(0.606 0.25 292.717)" height={4} />
        <ReactQueryProvider>{children}</ReactQueryProvider>

        
      </body>
    </html>
  );
}
