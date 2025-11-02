"use client"

import { useState, useEffect } from "react"
import type { Articulo, ArticulosResponse } from "@/types/articulo"
import { getArticulosPublicos, getArticulosPorCategoria } from "@/lib/api"

/**
 * Hook para obtener artículos con loading y error states
 */
export function useArticulos(page: number = 1, limit: number = 10) {
  const [articulos, setArticulos] = useState<Articulo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  })

  useEffect(() => {
    const fetchArticulos = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await getArticulosPublicos(page, limit)
        setArticulos(response.data)
        setPagination(response.pagination)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido")
        console.error("Error en useArticulos:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchArticulos()
  }, [page, limit])

  return { articulos, loading, error, pagination }
}

/**
 * Hook para obtener artículos por categoría
 */
export function useArticulosPorCategoria(categoria: string) {
  const [articulos, setArticulos] = useState<Articulo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchArticulos = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await getArticulosPorCategoria(categoria)
        setArticulos(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido")
        console.error("Error en useArticulosPorCategoria:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchArticulos()
  }, [categoria])

  return { articulos, loading, error }
}

