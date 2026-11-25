import type { Metadata } from "next";
import { Jost } from "next/font/google";
import "./globals.css";

// Geometric sans standing in for a proprietary luxury-retail face
const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Atelier Store",
  description: "Atelier Store",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${jost.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
