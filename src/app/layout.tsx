import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"

import { ThemeProvider } from "@/components/theme-provider"
import { jsonLd, faqSchema, howToSchema } from "@/lib/seo"

import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Lakhs & Crores Converter | USD to INR Currency Calculator",
  description: "Free online converter for Indian numbering system. Convert lakhs, crores to USD/INR with live exchange rates. Understand Indian rupee notation effortlessly - 1 lakh = 100,000, 1 crore = 10 million.",
  keywords: ["lakhs", "crores", "USD to INR", "INR to USD", "currency converter", "Indian numbering system", "rupee converter", "lakh to dollars", "crore to dollars", "Indian currency"],
  authors: [{ name: "AVGVSTVS96" }],
  metadataBase: new URL('https://lakhs.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Lakhs & Crores Converter | USD to INR Calculator",
    description: "Convert Indian numbers (lakhs, crores) to USD/INR with live exchange rates. 1 lakh = 100,000 | 1 crore = 10 million.",
    url: 'https://lakhs.vercel.app',
    siteName: 'Lakhs Converter',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Lakhs & Crores Converter",
    description: "Convert Indian numbers (lakhs, crores) to USD/INR with live exchange rates.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'verification_token_here', // Replace with actual Google Search Console token
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
