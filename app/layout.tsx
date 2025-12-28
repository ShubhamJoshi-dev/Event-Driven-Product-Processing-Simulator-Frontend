import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Serverless Add Product Flow Simulator',
  description: 'Visual simulation of AWS serverless architecture flow for adding products',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

