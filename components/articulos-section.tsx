"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Heart, Star } from "lucide-react"
import { getArticulosPublicos, convertirArticuloAProducto } from "@/lib/api"
import type { Articulo } from "@/types/articulo"

export default function ArticulosSection() {
  const [articulos, setArticulos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [favorites, setFavorites] = useState<number[]>([])

  useEffect(() => {
    const fetchArticulos = async () => {
      try {
        setLoading(true)
        const response = await getArticulosPublicos(1, 10)
        
        // Convertir artículos de la API al formato del componente
        const productosConvertidos = response.data.map(convertirArticuloAProducto)
        setArticulos(productosConvertidos)
        
        console.log("Artículos cargados:", response.data.length)
      } catch (err) {
        console.error("Error cargando artículos:", err)
        setError(err instanceof Error ? err.message : "Error desconocido")
      } finally {
        setLoading(false)
      }
    }

    fetchArticulos()
  }, [])

  const toggleFavorite = (id: number) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(fav => fav !== id) : [...prev, id]
    )
  }

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#128498]"></div>
        <p className="mt-4 text-gray-600">Cargando artículos...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="py-20 text-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
          <p className="text-red-600 font-semibold mb-2">Error al cargar artículos</p>
          <p className="text-red-500 text-sm">{error}</p>
          <Button 
            onClick={() => window.location.reload()} 
            className="mt-4 bg-red-600 hover:bg-red-700"
          >
            Reintentar
          </Button>
        </div>
      </div>
    )
  }

  if (articulos.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="text-gray-600">No hay artículos disponibles en este momento.</p>
      </div>
    )
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-serif text-3xl md:text-5xl font-bold text-gray-900 mb-4">
            Artículos desde la API
          </h2>
          <p className="text-lg text-gray-600">
            {articulos.length} artículo{articulos.length !== 1 ? 's' : ''} disponible{articulos.length !== 1 ? 's' : ''}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {articulos.map((producto) => (
            <Card
              key={producto.id}
              className="group hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 hover:border-[#128498]/20"
            >
              <div className="relative overflow-hidden">
                <img
                  src={producto.image}
                  alt={producto.name}
                  className="w-full h-72 object-cover group-hover:scale-110 transition-transform duration-500"
                  onError={(e) => {
                    e.currentTarget.src = '/placeholder.jpg'
                  }}
                />
                
                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                  {producto.badges.map((badge: string, idx: number) => (
                    <Badge 
                      key={idx}
                      className={`${
                        badge === "Más Popular" ? "bg-[#128498] hover:bg-[#0f6a7a]" :
                        badge === "Nuevo" ? "bg-[#A1D0B2] hover:bg-[#8cb899] text-gray-900" :
                        badge === "Disponible" ? "bg-white/90 hover:bg-white text-gray-900 border border-gray-200" :
                        "bg-red-500 hover:bg-red-600"
                      } shadow-md`}
                    >
                      {badge}
                    </Badge>
                  ))}
                </div>

                {/* Favorite button */}
                <button 
                  onClick={() => toggleFavorite(producto.id)}
                  className="absolute top-3 right-3 bg-white p-2.5 rounded-full shadow-lg hover:scale-110 transition-all"
                >
                  <Heart className={`h-5 w-5 ${favorites.includes(producto.id) ? 'fill-red-500 text-red-500' : 'text-gray-600 hover:text-red-500'} transition-colors`} />
                </button>
              </div>

              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-serif text-lg font-semibold text-gray-900 line-clamp-2">
                    {producto.name}
                  </h4>
                  {producto.rating && (
                    <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-full">
                      <Star className="h-3.5 w-3.5 text-yellow-500 fill-current" />
                      <span className="text-xs font-semibold text-gray-700">{producto.rating}</span>
                    </div>
                  )}
                </div>

                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{producto.description}</p>
                
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-[#128498]">{producto.price}</span>
                  <Badge variant="outline" className="text-xs">{producto.category}</Badge>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-4 border-2 border-[#128498] text-[#128498] hover:bg-[#128498] hover:text-white"
                >
                  Ver Detalles
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

