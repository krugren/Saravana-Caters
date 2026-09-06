import type { Metadata } from "next";
import { Playfair_Display, Manrope, Noto_Serif_Tamil } from "next/font/google";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["600", "700"],
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "700"],
});

const notoTamil = Noto_Serif_Tamil({
  subsets: ["tamil"],
  variable: "--font-tamil",
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://saravanacaters.in"),
  title: "Saravana Caters — Traditional South Indian Catering in Erode",
  description:
    "Saravana Caters — Erode's most trusted traditional South Indian catering service. Weddings, corporate events, temple functions, and house functions. Call +91 98427 22977.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-IN">
      <body
        className={`${playfair.variable} ${manrope.variable} ${notoTamil.variable} antialiased`}
      >
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  );
}
