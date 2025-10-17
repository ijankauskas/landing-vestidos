import type React from "react"
import type { Metadata } from "next"
import { Playfair_Display, DM_Sans } from "next/font/google"
import "./globals.css"

const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
})

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-sans",
})

export const metadata: Metadata = {
  title: "Díaz & De Luca - Alquiler de Vestidos de Fiesta",
  description:
    "Descubre nuestra exclusiva colección de vestidos de fiesta para alquiler. Elegancia y sofisticación para tus momentos especiales.",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={`${playfair.variable} ${dmSans.variable} antialiased`}>
      <body>{children}</body>
    </html>
  )
}
