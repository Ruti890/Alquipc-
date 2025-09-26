import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AlquiPc',
  description: 'Sistema de facturación para alquiler de equipos',
  openGraph: {
    title: 'AlquiPc',
    description: 'Sistema de facturación para alquiler de equipos',
    url: 'https://alquipc.vercel.app',
    siteName: 'AlquiPc',
    images: [
      {
        url: '/preview.png', // coloca aquí una imagen dentro de /public
        width: 1200,
        height: 630,
        alt: 'Vista previa de AlquiPc',
      },
    ],
    locale: 'es_ES',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AlquiPc',
    description: 'Sistema de facturación para alquiler de equipos',
    images: ['/preview.png'],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
