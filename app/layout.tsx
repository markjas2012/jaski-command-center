import type { Metadata } from "next";
import "./globals.css";
import "./shell-lock.css";
import "./themes.css";

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
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `try{var t=localStorage.getItem('jaski-theme');document.documentElement.dataset.jaskiTheme=t==='blue-ice'?'blue-ice':'original'}catch(e){}` }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
