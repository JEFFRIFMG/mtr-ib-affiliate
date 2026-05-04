import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'IB & Affiliate Program — MyTradingReviews',
  description: 'Institutional rates, available to everyone. Up to $800 CPA, $15/lot rebate, 50% rev share.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Gantari:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ fontFamily: 'var(--font-body)' }}>{children}</body>
    </html>
  )
}
