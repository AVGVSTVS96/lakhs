import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"

import { ThemeProvider } from "@/components/theme-provider"

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
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Lakhs & Crores Converter',
    applicationCategory: 'FinanceApplication',
    description: 'Free online converter for Indian numbering system. Convert lakhs, crores to USD/INR with live exchange rates.',
    url: 'https://lakhs.vercel.app',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    featureList: [
      'USD to INR conversion',
      'INR to USD conversion',
      'Lakhs to international number format',
      'Crores to international number format',
      'Live exchange rates',
      'Indian and international number grouping',
    ],
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is a lakh?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'A lakh is a unit in the Indian numbering system equal to 100,000 (one hundred thousand). It is commonly used in India, Pakistan, Bangladesh, and other South Asian countries.',
        },
      },
      {
        '@type': 'Question',
        name: 'What is a crore?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'A crore equals 10,000,000 (ten million) or 100 lakhs. It is widely used in financial contexts across South Asia.',
        },
      },
      {
        '@type': 'Question',
        name: 'How do I convert lakhs to dollars?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'To convert lakhs to dollars: multiply the lakh value by 100,000 to get the rupee amount, then divide by the current USD/INR exchange rate. Our converter does this automatically with live exchange rates.',
        },
      },
      {
        '@type': 'Question',
        name: 'How much is 1 lakh in USD?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: '1 lakh is approximately $1,125 USD at current exchange rates (1 USD = 88.79 INR). The exact value varies with live exchange rates.',
        },
      },
      {
        '@type': 'Question',
        name: 'How much is 1 crore in USD?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: '1 crore is approximately $112,500 USD at current exchange rates. This converter provides real-time calculations with live USD/INR rates.',
        },
      },
    ],
  }

  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How to Convert Lakhs and Crores to USD',
    description: 'Step-by-step guide to convert Indian number notation (lakhs, crores) to USD using live exchange rates',
    step: [
      {
        '@type': 'HowToStep',
        name: 'Enter the amount',
        text: 'Enter your amount in the input field. You can input in either INR or USD by toggling the currency selector.',
      },
      {
        '@type': 'HowToStep',
        name: 'Enter lakhs or crores',
        text: 'Alternatively, enter values directly in lakhs or crores fields. The converter automatically calculates all formats.',
      },
      {
        '@type': 'HowToStep',
        name: 'View results',
        text: 'View the converted values in multiple formats: USD amount, INR with Indian grouping, INR with international grouping, lakhs, and crores.',
      },
      {
        '@type': 'HowToStep',
        name: 'Check exchange rate',
        text: 'See the live exchange rate at the bottom. Rates are updated every 5 minutes for accuracy.',
      },
    ],
  }

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
