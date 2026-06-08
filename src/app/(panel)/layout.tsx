import type { Metadata } from "next";
import type { Viewport } from "next";
import "./globals.css";
import localFont from "next/font/local";
import NextTopLoader from "nextjs-toploader";
import DashboardLayout from "@/components/console/layout/dashboard-layout";
import "./form.setup";
import { ReactQueryProvider } from "@/providers/react-query-provider";

export const metadata: Metadata = {
  title: " سامانه اسکان سرای محله | پنل مدیریت",
  description: "",
};
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

export default function RootPanelLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  //
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <body className={`antialiased   ${myFont.className} scroll-smooth`}>
        <NextTopLoader color="oklch(0.606 0.25 292.717)" height={4} />
        <ReactQueryProvider>
          {" "}
          <DashboardLayout>{children}</DashboardLayout>{" "}
        </ReactQueryProvider>
      </body>
    </html>
  );
}
