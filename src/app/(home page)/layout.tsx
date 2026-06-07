import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";
import NextTopLoader from "nextjs-toploader";
import localFont from "next/font/local";
import ThemeProvider from "@/components/theme-provider";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "سامانه اسکان سرای محله",
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

const myFont = localFont({ src: "../../fonts/iraniansans.woff2" });
const myFont2 = localFont({
  src: "../../fonts/Estedad.woff2",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fa"
      dir="rtl"
      className={`${myFont2.className} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <NextTopLoader color="oklch(0.606 0.25 292.717)" height={4} />
        <Providers>
          <ThemeProvider>{children}</ThemeProvider>
        </Providers>
      </body>

      {/* <Script
        id="goftino-widget"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `!function(){var i="ivTdwR",a=window,d=document;function g(){var g=d.createElement("script"),s="https://www.goftino.com/widget/"+i,l=localStorage.getItem("goftino_"+i);g.async=!0,g.src=l?s+"?o="+l:s;d.getElementsByTagName("head")[0].appendChild(g);}"complete"===d.readyState?g():a.attachEvent?a.attachEvent("onload",g):a.addEventListener("load",g,!1);}();`,
        }}
      /> */}
    </html>
  );
}
