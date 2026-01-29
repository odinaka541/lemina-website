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
  title: 'Lemina - Building the investment bank for African tech',
  description: 'Market intelligence platform for investors deploying capital in African tech markets',
  keywords: ['africa', 'tech', 'investment', 'fintech', 'venture capital', 'startup'],
  authors: [{ name: 'Lemina' }],
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