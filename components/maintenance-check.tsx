"use client"

import { MANTENIMIENTO_ACTIVO } from "@/lib/api"
import MaintenanceScreen from "./maintenance-screen"

export default function MaintenanceCheck({ children }: { children: React.ReactNode }) {
  // Si el mantenimiento está activo, mostrar solo la pantalla de mantenimiento
  if (MANTENIMIENTO_ACTIVO) {
    return <MaintenanceScreen />
  }

  // Si no está en mantenimiento, mostrar el contenido normal
  return <>{children}</>
}

