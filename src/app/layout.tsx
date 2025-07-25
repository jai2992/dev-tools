import type { Metadata } from "next";
import "./globals.css";


export const metadata: Metadata = {
  title: "Devtools",
  description: "A place where you get all sort of dev tools for free...",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4913229567533880"
        crossOrigin="anonymous"></script>
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
