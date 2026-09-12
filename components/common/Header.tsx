"use client";

import * as Popover from "@radix-ui/react-popover";
import React, { useEffect, useLayoutEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Moon, Sun, Menu, X } from "lucide-react";
import { useTheme } from "@/app/theme-provider";
import { Button } from "../ui/button";
import LineChart from "../dashboard/charts/line-chart";

const navItems = [
  { href: "/", label: "Dashboard" },
  // { href: "/analysis", label: "Analysis" },
  { href: "/revenue", label: "Revenue Analysis" },
  { href: "/seasonal", label: "Seasonal Analysis" },
  { href: "/daily", label: "Daily Analysis" },
  { href: "/predictive", label: "Predictive Analysis" },
  // { href: "/intelligence", label: "Intelligence Hub" },
];

const Header = () => {
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const isActive = (href: string) => pathname === href;
  const [hideHeader, setHideHeader] = useState(false);
  useLayoutEffect(() => {
    const host = window.location.hostname;
    if (
      host === "hospitality-demo.vercel.app" ||
      host === "localhost" ||
      host === "hospitality-hotel-resort-dubai.vercel.app" ||
      host === "172.16.51.124"
    ) {
      setHideHeader(true);
    }
  }, []);

  const controlNavbar = () => {
    if (typeof window !== "undefined") {
      if (window.scrollY < lastScrollY) {
        setShowHeader(true);
      } else {
        setShowHeader(false);
      }
      setLastScrollY(window.scrollY);
    }
  };
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("scroll", controlNavbar);
      return () => window.removeEventListener("scroll", controlNavbar);
    }
  }, [lastScrollY]);

  return (
    <header
      className={`w-full transition-transform duration-300 z-[100] fixed top-0 ${
        showHeader ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="text-white w-full px-4 py-4 bg-[linear-gradient(to_right,_#1D4ED8,_#1E3A8A,_#1D4ED8)] dark:bg-[linear-gradient(to_right,_#1E3A8A,_#1D4ED8,_#1E3A8A)]">
        <div className="flex flex-wrap md:flex-nowrap justify-between items-center gap-4 w-full">
          {/* Logo */}
          <div className="flex items-center flex-1 min-w-0">
            <Image
              src="/qe-revpulse.png"
              alt="QE RevPulse"
              width={140}
              height={36}
              className="object-contain h-8 w-auto cursor-pointer"
              onClick={() => router.push("/")}
              priority
            />
          </div>

          {/* Desktop Navigation */}
          {/* <nav className="hidden gap-6 items-center text-sm sm:text-base font-medium text-white"> */}
          <nav className="hidden lg:flex gap-6 items-center text-sm sm:text-base font-medium text-white">
            {hideHeader ? (
              navItems.map(({ href, label }: any) => (
                <Link
                  key={href}
                  href={href}
                  className={`pb-1 border-b-2 transition-all duration-150 ${
                    pathname === href
                      ? "border-white"
                      : "border-transparent hover:border-blue-300"
                  }`}
                >
                  {label}
                </Link>
              ))
            ) : (
              <></>
            )}
          </nav>

          {/* Mobile + Theme Group */}
          <div className="flex items-center gap-2 lg:hidden ml-auto">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="text-white hover:bg-blue-700"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
            {hideHeader && (
              <Popover.Root open={open} onOpenChange={setOpen}>
                <Popover.Trigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-blue-700"
                  >
                    <Menu className="h-5 w-5" />
                  </Button>
                </Popover.Trigger>

                <Popover.Portal>
                  <Popover.Content
                    sideOffset={8}
                    align="end"
                    className="z-[100] bg-white dark:bg-black text-black dark:text-white rounded-lg shadow-md p-4 w-64"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-sm font-bold">Menu</span>
                      <Popover.Close asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-black dark:text-white hover:bg-gray-200 dark:hover:bg-black"
                        >
                          <X className="h-5 w-5" />
                        </Button>
                      </Popover.Close>
                    </div>

                    <div className="flex flex-col gap-3">
                      {navItems.map(({ href, label }: any) => (
                        <Link
                          key={href}
                          href={href}
                          onClick={() => setOpen(false)}
                          className={`block text-sm font-medium ${
                            pathname === href
                              ? "text-blue-700"
                              : "hover:text-blue-600"
                          }`}
                        >
                          {label}
                        </Link>
                      ))}
                    </div>
                  </Popover.Content>
                </Popover.Portal>
              </Popover.Root>
            )}
          </div>

          {/* Theme toggle for desktop */}
          <div className="hidden lg:flex flex-shrink-0">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="text-white hover:bg-blue-700"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
