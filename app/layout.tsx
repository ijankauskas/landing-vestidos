import type React from "react"
import type { Metadata } from "next"
import { Instrument_Serif, Manrope, Pinyon_Script } from "next/font/google"
import "./globals.css"
import MaintenanceCheck from "@/components/maintenance-check"

// Instrument Serif - Para títulos
const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-instrument-serif",
  weight: ["400"],
})

// Manrope - Similar a Cabinet Grotesk para cuerpo de texto
// Si tienes los archivos de Cabinet Grotesk, podemos cargarlos localmente
const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-cabinet-grotesk",
  weight: ["400", "500", "600", "700"],
})

// Pinyon Script - Para acentos/destaque
const pinyonScript = Pinyon_Script({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-pinyon-script",
  weight: ["400"],
})

export const metadata: Metadata = {
  title: "Díaz & De Luca - Alquiler de Vestidos de Fiesta",
  description:
    "Descubre nuestra exclusiva colección de vestidos de fiesta para alquiler. Elegancia y sofisticación para tus momentos especiales.",
  generator: "v0.dev",
  icons: {
    icon: "/150PPI.png",
    shortcut: "/150PPI.png",
    apple: "/150PPI.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={`${instrumentSerif.variable} ${manrope.variable} ${pinyonScript.variable} antialiased`}>
      <body>
        <MaintenanceCheck>{children}</MaintenanceCheck>
      </body>
    </html>
  )
}
