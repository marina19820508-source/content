import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Апельсин — контент-планер",
  description: "Планирование и аналитика контента для преподавателя",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
