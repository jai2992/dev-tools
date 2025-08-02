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
        <meta name="google-adsense-account" content="ca-pub-4913229567533880"></meta>
      </head>
      <body>
        {children}
      <div className="flex justify-center items-center w-screen bottom-0 text-white font-bold fixed text-sm sm:text-md">© 2025 www.devtools.software</div>
      </body>
    </html>
  );
}
