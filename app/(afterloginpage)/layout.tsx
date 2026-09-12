import Header from "@/components/common/Header";
import React from "react";

export default function layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="min-h-screen bg-background pt-[110px] md:pt-[100px]">
      <Header/>
      {children}
    </main>
  );
}
