import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "./providers";
import { createSupabaseServerClient } from "@/lib/supabaseServerClient";
import { muiFontsClassName } from "@/theme";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MTM",
  description: "일정, 출석, 질문, 공지를 관리하는 MTM 운영 도구",
  icons: {
    icon: "/favicon.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${muiFontsClassName} antialiased bg-slate-50`}
      >
        <Providers initialSession={session}>{children}</Providers>
      </body>
    </html>
  );
}
