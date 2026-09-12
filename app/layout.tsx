import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "./theme-provider";
import { Providers } from "@/store/Provide";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Hospitality P&L Dashboard",
  description: "Financial performance analytics and insights for hospitality",
  // icons: {
  //   icon: "/hospitality.png",
  // },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Prevent flash of wrong theme */}
        <script
          // dangerouslySetInnerHTML={{
          //   __html: `
          //     (function() {
          //       try {
          //         var theme = localStorage.getItem("theme");
          //         if (theme === "dark") {
          //           document.documentElement.classList.add("dark");
          //         } else {
          //           document.documentElement.classList.add("light");
          //         }
          //       } catch (e) {}
          //     })();
          //   `,
          // }}
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var icon = document.createElement('link');
                icon.rel = 'icon';
                icon.type = 'image/png';
                var host = window.location.hostname;
                if (host === "hospitality-demo.vercel.app" || host === "hospitality-nine.vercel.app" || host === "localhost") {
                  icon.href = "/hospitality.png";
                } else {
                  icon.href = "/hotel7.png";
                }
                document.head.appendChild(icon);
              })();
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        <Providers>
          <ThemeProvider>{children}</ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
