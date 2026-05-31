import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Happy Birthday Faith 🌹",
  description: "A world built just for you. Happy 24th Birthday, Faith Makolla.",
  openGraph: {
    title: "Happy Birthday Faith 🌹",
    description: "Something beautiful is waiting for you.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#0a0118",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="bg-[#0a0118] text-white overflow-x-hidden" style={{ height: "100dvh" }}>
        {children}
      </body>
    </html>
  );
}
