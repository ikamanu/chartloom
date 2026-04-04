import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "ChartLoom — Clinical Chart Audit",
  description: "A beautiful, print-accurate daily chart audit form system",
  openGraph: {
    title: "ChartLoom — Clinical Chart Audit",
    description: "A beautiful, print-accurate daily chart audit form system for NCTR peer review.",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "ChartLoom" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ChartLoom — Clinical Chart Audit",
    description: "A beautiful, print-accurate daily chart audit form system for NCTR peer review.",
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans bg-stone-50 text-slate-900">
        {children}
      </body>
    </html>
  );
}
