import type { Metadata } from "next";
import { IBM_Plex_Sans, IBM_Plex_Mono, Inter } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import { DevModeProvider } from "@/lib/dev-mode-context";
import "./globals.css";

const plexSans = IBM_Plex_Sans({
  variable: "--font-plex-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

// Inter — fallback stand-in for Stripe's Söhne (which is proprietary).
// Activated via data-theme="stripe" which maps --theme-font-sans to it.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Westpac BizEdge — Deal Workspace",
  description:
    "Senior Experience Designer interview prototype. Banker deal workspace demonstrating 9 design decisions for the Westpac Business Lending Origination Platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-theme="ibm"
      data-version="v1"
      data-grayscale="off"
      className={`${plexSans.variable} ${plexMono.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <DevModeProvider>
          <TooltipProvider delayDuration={200}>{children}</TooltipProvider>
        </DevModeProvider>
      </body>
    </html>
  );
}
