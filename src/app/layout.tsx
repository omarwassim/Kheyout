import type { Metadata } from "next";
import { Fraunces, Quicksand } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
});

const quicksand = Quicksand({
  subsets: ["latin"],
  variable: "--font-quicksand",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Kheyout | Handmade Crochet Spider-Man",
  description:
    "Reserve a handmade crochet Spider-Man car charm from Kheyout Handmade Products.",
  icons:"icon.png"  
  };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${fraunces.variable} ${quicksand.variable} font-body`}>
        {children}
      </body>
    </html>
  );
}