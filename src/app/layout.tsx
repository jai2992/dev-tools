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
      <body>
        {children}
      </body>
    </html>
  );
}
