// Import global styles and fonts
import "./globals.css";
import type { Metadata, Viewport } from "next";
import NotFoundComponent from "./not-found-component";
import localFont from "next/font/local";

export const metadata: Metadata = {
  title: "404 - Page Not Found",
  description: "The page you are looking for does not exist.",
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

const myFont = localFont({ src: "../fonts/iraniansans.woff2" });

export default function GlobalNotFound() {
  return (
    <html lang="fa" dir="rtl" className={myFont.className}>
      <body>
        <NotFoundComponent />
      </body>
    </html>
  );
}
