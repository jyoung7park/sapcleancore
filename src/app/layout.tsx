import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CCOE | SAP Clean Core Object Explorer",
  description: "SAP 객체 릴리스 상태 및 대체 API 검색기"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ko"><body>{children}</body></html>;
}
