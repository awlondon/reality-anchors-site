import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Reality Anchors Limited | Structural Intelligence Platform",
  description:
    "Enterprise structural intelligence workflows for deterministic optimization, validation, and measurable outcomes.",
  openGraph: {
    title: "Reality Anchors Limited",
    description:
      "Move from estimation to governed optimization with enterprise-safe AI workflows.",
    images: ["/fallback-hero.svg"],
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#0B0F17" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preload" as="video" href="/hero-loop.webm" type="video/webm" />
      </head>
      <body className="bg-graphite text-white antialiased">
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
