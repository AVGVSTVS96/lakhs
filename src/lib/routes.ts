import { Metadata } from "next"

export type PageConfig = {
  title: string
  description: string
  heading: string
  intro: string
}

export const conversionPages: Record<string, PageConfig> = {
  "lakh-to-usd": {
    title: "Lakh to USD Converter — Live Rate Calculator",
    description: "Convert lakhs to US dollars with the live USD/INR exchange rate. 1 lakh equals 100,000. Free, clean, and accurate online tool.",
    heading: "lakh to usd",
    intro: "Convert any amount from lakhs to United States Dollars using a live exchange rate.",
  },
  "crore-to-usd": {
    title: "Crore to USD Converter — Live Rate Calculator",
    description: "Convert crores to US dollars with the live USD/INR exchange rate. 1 crore equals 10 million. Free, clean, and accurate online tool.",
    heading: "crore to usd",
    intro: "Convert any amount from crores to United States Dollars using a live exchange rate.",
  },
  "inr-to-usd": {
    title: "INR to USD Converter — Indian Rupee to US Dollar",
    description: "Convert Indian Rupees (INR) to US Dollars (USD) with live exchange rates. Accurate, fast, and simple currency calculator.",
    heading: "inr to usd",
    intro: "Convert Indian Rupees directly to US Dollars with real-time market rates.",
  },
  "usd-to-inr": {
    title: "USD to INR Converter — US Dollar to Indian Rupee",
    description: "Convert US Dollars (USD) to Indian Rupees (INR) with live exchange rates. Best tool for checking dollar rates in India.",
    heading: "usd to inr",
    intro: "Convert US Dollars to Indian Rupees using the latest live exchange rate.",
  },
  "lakh-to-million": {
    title: "Lakh to Million Converter — Indian to International System",
    description: "Convert lakhs to millions instantly. Understand the difference between Indian (1 lakh = 0.1 million) and international numbering systems.",
    heading: "lakh to million",
    intro: "Instantly convert between the Indian 'Lakh' and the international 'Million'.",
  },
  "crore-to-million": {
    title: "Crore to Million Converter — Indian to International System",
    description: "Convert crores to millions instantly. 1 Crore = 10 Million. Simple tool for Indian vs International number system conversion.",
    heading: "crore to million",
    intro: "Easily convert large values from Indian Crores to International Millions.",
  },
}

