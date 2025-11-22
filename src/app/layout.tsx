import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"

import { ThemeProvider } from "@/components/theme-provider"
import { jsonLd, faqSchema, howToSchema, organizationSchema } from "@/lib/seo"

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
    languages: {
      'en-US': '/',
      'en-IN': '/',
      'x-default': '/',
    },
  },
  openGraph: {
    title: "Lakhs & Crores Converter | USD to INR Calculator",
    description: "Convert Indian numbers (lakhs, crores) to USD/INR with live exchange rates. 1 lakh = 100,000 | 1 crore = 10 million.",
    url: 'https://lakhs.vercel.app',
    siteName: 'Lakhs Converter',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/opengraph-image.svg',
        width: 1200,
        height: 630,
        alt: 'Lakhs and Crores to USD Converter',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Lakhs & Crores Converter",
    description: "Convert Indian numbers (lakhs, crores) to USD/INR with live exchange rates.",
    images: ['/opengraph-image.svg'],
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
    google: 'YOUR_ACTUAL_GOOGLE_VERIFICATION_TOKEN_HERE',
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased transition-colors duration-300`}>
        <ThemeProvider>
          <div className="flex flex-col min-h-screen">
            <div className="flex-grow">
              {children}
            </div>
            <footer className="py-8 text-center text-xs text-muted-foreground/60">
              <p>Rates are updated every 5 minutes. Built by AVGVSTVS96.</p>
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
