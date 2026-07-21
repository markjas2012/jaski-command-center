import "./globals.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";

import Sidebar from "./components/Sidebar";
import ThemeProvider from "./components/ThemeProvider";
import TopBar from "./components/TopBar";

export const metadata: Metadata = {
  title: "Jaski Command Center",
  description: "Personal Command Center",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <div className="flex min-h-screen">
            <Sidebar />

            <div className="flex min-w-0 flex-1 flex-col">
              <TopBar />

              <main className="flex-1">{children}</main>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}