import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Noto_Sans_JP } from 'next/font/google'
import { BIZ_UDMincho } from 'next/font/google'
import "./globals.css"
import MenuIcon from "../components/layout/MenuIcon/MenuIcon"
import TabBar from "../components/layout/TabBar/TabBar"
// import { useEffect, useRef } from "react"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const notoSansJp = Noto_Sans_JP({
  subsets: ['latin'],
  weight: ['400', '700'],
  preload: false,
  variable: '--font-noto-sans-jp',
  display: 'swap',
  fallback: ['Hiragino Sans', 'Hiragino Kaku Gothic ProN', 'sans-serif'],
})

const mincho = BIZ_UDMincho({
  subsets: ['latin'],
  weight: ['400', '700'],
  preload: false,
  variable: '--font-biz-ud-mincho',
  display: 'swap',
  fallback: ['Hiragino Mincho ProN', 'serif'],
})

export const metadata: Metadata = {
  title: "school festival",
  description: "高槻文化祭のホームページです",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const tabBar_Ref = useRef<HTMLDivElement>(null);

  // useEffect(() => {
  //   function handleSearchWrapperReady(e: CustomEvent) {
  //     const triggerEl = e.detail as HTMLElement;
  //     if (tabBar_Ref.current && triggerEl) {
  //       gsap.set(tabBar_Ref.current, { opacity: 0 });
  //       gsap.to(tabBar_Ref.current, {
  //         opacity: 1,
  //         duration: 0.6,
  //         ease: "power2.out",
  //         scrollTrigger: {
  //           trigger: triggerEl,
  //           start: "top bottom",
  //           toggleActions: "play none none reverse",
  //         },
  //       });
  //     }
  //   }
  //   window.addEventListener("searchWrapperReady", handleSearchWrapperReady as EventListener);

  //   return () => {
  //     window.removeEventListener("searchWrapperReady", handleSearchWrapperReady as EventListener);
  //   };
  // }, []);

  return (
    <html>
      <head>
        <meta charSet="utf-8" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} ${notoSansJp.variable} ${mincho.variable}`}>
        <MenuIcon />
        <TabBar />
        {children}
      </body>
    </html>
  );
}
