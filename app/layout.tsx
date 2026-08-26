import type { Metadata } from "next";
import "./globals.css";
import "./shell-lock.css";

export const metadata: Metadata = {
  title: "Jaski Command Center",
  description: "A personal command center built around the things that make me smile.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
