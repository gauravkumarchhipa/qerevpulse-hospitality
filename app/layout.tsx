import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "./theme-provider";
import { Providers } from "@/store/Provide";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "QeRevPulse",
  description: "Financial performance analytics and insights for hospitality",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <ThemeProvider>{children}</ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
