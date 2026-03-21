import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "White Studio",
  description: "Webdesign und SEO für Unternehmen in Stade und Hamburg",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  );
}
