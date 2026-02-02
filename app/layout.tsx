import type { Metadata, Viewport } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import './main.css'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jetbrains-mono',
})

export const metadata: Metadata = {
  title: 'Lemina - Investment Intelligence for African Tech | Verified Data & AI Analysis',
  description: 'Verified company data, AI-powered due diligence, and network coordination for investors navigating African private markets. From deal discovery to portfolio management—everything in one platform.',
  keywords: [
    'African tech investment',
    'startup intelligence platform',
    'venture capital Africa',
    'angel investing Africa',
    'Nigerian fintech investment',
    'due diligence tools',
    'portfolio management',
    'syndicate coordination',
    'emerging markets investment'
  ],
  openGraph: {
    title: 'Lemina - Investment Intelligence for African Tech',
    description: 'Verified data, AI-powered analysis, and network coordination for investors navigating African private markets. Built specifically for angels, VCs, and institutional investors.',
    url: 'https://lemina.co',
    siteName: 'Lemina',
    images: [
      {
        url: 'https://lemina.co/og-image.png',
        width: 1200,
        height: 630,
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lemina - Investment Intelligence for African Tech',
    description: 'Verified data, AI analysis, network tools. Built for investors navigating African private markets.',
    images: ['https://lemina.co/twitter-card.png'],
    site: '@lemina',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://lemina.co',
    languages: {
      'en': 'https://lemina.co',
      'pt': 'https://lemina.co/pt',
    },
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

import { ToastProvider } from '@/components/providers/ToastProvider';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <head>
        <link rel="icon" href="/assets/favicon.ico" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Lemina",
              "description": "Investment intelligence platform for African tech",
              "url": "https://lemina.co",
              "logo": "https://lemina.co/logo.png",
              "email": "admin@lemina.co",
              "sameAs": [
                "https://twitter.com/lemina",
                "https://linkedin.com/company/lemina"
              ],
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Lagos",
                "addressCountry": "NG"
              }
            })
          }}
        />
      </head>
      <body className="font-sans antialiased">
        <ToastProvider>
          <div className="gradient-bg"></div>
          {children}
        </ToastProvider>
      </body>
    </html>
  )
}