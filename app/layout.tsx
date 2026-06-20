import "./globals.css";
import { Inter } from "next/font/google";
import { I18nProvider } from "../context/I18nContext";
import Layout from "../components/layout/Layout";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'),
  title: "FoodERP — Restaurant Management Demo",
  description:
    "Full-stack restaurant ERP demo: POS, Kitchen Display, Delivery, Analytics, Employee Management. Built with Next.js 16, React 19, Tailwind CSS v4, Zustand v5.",
  keywords: ["restaurant", "ERP", "POS", "Next.js", "React", "demo", "portfolio"],
  authors: [{ name: "FoodERP Demo" }],
  openGraph: {
    title:       "FoodERP — Restaurant Management Demo",
    description: "Full-featured restaurant ERP demo with real-time POS, Kitchen Display, Analytics and more.",
    type:        "website",
    images:      [{ url: "/og-image.svg", width: 1200, height: 630 }],
  },
  twitter: {
    card:        "summary_large_image",
    title:       "FoodERP — Restaurant Management Demo",
    description: "Full-featured restaurant ERP demo built with Next.js 16 & React 19.",
    images:      ["/og-image.svg"],
  },
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <I18nProvider>
          <Layout>
            {children}
          </Layout>
        </I18nProvider>
      </body>
    </html>
  );
}
