"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Heart, Star, Search, ChevronLeft, ChevronRight, Filter, X } from "lucide-react"
import { getArticulosPublicos, convertirArticuloAProducto, type ArticulosOptions } from "@/lib/api"
import { ProductDetailModal } from "@/components/product-detail-modal"

export default function ArticulosPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // Estados
  const [articulos, setArticulos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [favorites, setFavorites] = useState<number[]>([])
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  
  // Parámetros de filtrado y paginación
  const [currentPage, setCurrentPage] = useState(Number(searchParams.get('page')) || 1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '')
  const [searchInput, setSearchInput] = useState(searchTerm)
  const [sortBy, setSortBy] = useState<string>(searchParams.get('sort') || 'descripcion')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>((searchParams.get('order') as 'asc' | 'desc') || 'asc')
  const [limit] = useState(12) // Artículos por página
  
  // Obtener categorías únicas
  const [categorias, setCategorias] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  // Cargar artículos
  useEffect(() => {
    const fetchArticulos = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const options: ArticulosOptions = {
          page: currentPage,
          limit,
          search: searchTerm || undefined,
          sort: sortBy,
          order: sortOrder,
        }
        
        const response = await getArticulosPublicos(currentPage, limit, options)
        
        // Convertir artículos
        const productosConvertidos = response.data.map(convertirArticuloAProducto)
        setArticulos(productosConvertidos)
        
        // Actualizar paginación
        if (response.pagination) {
          setTotalPages(response.pagination.totalPages)
          setTotal(response.pagination.total)
        }
        
        // Extraer categorías únicas
        const cats = Array.from(new Set(productosConvertidos.map(p => p.category)))
        setCategorias(cats)
        
        console.log(`✅ ${response.data.length} artículos cargados (Página ${currentPage}/${response.pagination?.totalPages})`)
      } catch (err) {
        console.error("❌ Error cargando artículos:", err)
        setError(err instanceof Error ? err.message : "Error desconocido")
      } finally {
        setLoading(false)
      }
    }

    fetchArticulos()
  }, [currentPage, searchTerm, sortBy, sortOrder, limit])

  // Actualizar URL cuando cambian los filtros
  useEffect(() => {
    const params = new URLSearchParams()
    if (currentPage > 1) params.set('page', String(currentPage))
    if (searchTerm) params.set('search', searchTerm)
    if (sortBy !== 'descripcion') params.set('sort', sortBy)
    if (sortOrder !== 'asc') params.set('order', sortOrder)
    
    const newUrl = params.toString() ? `/articulos?${params.toString()}` : '/articulos'
    router.replace(newUrl, { scroll: false })
  }, [currentPage, searchTerm, sortBy, sortOrder, router])

  const toggleFavorite = (id: number) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(fav => fav !== id) : [...prev, id]
    )
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setSearchTerm(searchInput)
    setCurrentPage(1) // Resetear a página 1 al buscar
  }

  const handleClearSearch = () => {
    setSearchInput('')
    setSearchTerm('')
    setCurrentPage(1)
  }

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const filteredArticulos = selectedCategory
    ? articulos.filter(a => a.category === selectedCategory)
    : articulos

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-[#128498]"></div>
          <p className="mt-6 text-gray-600 text-lg">Cargando artículos...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-20">
        <div className="max-w-md mx-auto px-4">
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <X className="h-8 w-8 text-red-600" />
            </div>
            <p className="text-red-600 font-semibold text-lg mb-2">Error al cargar artículos</p>
            <p className="text-red-500 text-sm mb-6">{error}</p>
            <Button 
              onClick={() => window.location.reload()} 
              className="bg-red-600 hover:bg-red-700"
            >
              Reintentar
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#128498] to-[#0f6a7a] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-serif text-4xl md:text-6xl font-bold mb-4">
            Catálogo Completo
          </h1>
          <p className="text-xl text-white/90">
            Explorá nuestra colección completa de {total} artículos
          </p>
        </div>
      </div>

      {/* Filtros y Búsqueda */}
      <div className="bg-white border-b sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Búsqueda */}
            <form onSubmit={handleSearch} className="flex-1 max-w-md w-full">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Buscar artículos..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="pl-10 pr-10"
                />
                {searchInput && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </form>

            {/* Ordenamiento */}
            <div className="flex gap-2 items-center">
              <Filter className="h-4 w-4 text-gray-600" />
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [newSort, newOrder] = e.target.value.split('-')
                  setSortBy(newSort)
                  setSortOrder(newOrder as 'asc' | 'desc')
                  setCurrentPage(1)
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#128498]"
              >
                <option value="descripcion-asc">Nombre (A-Z)</option>
                <option value="descripcion-desc">Nombre (Z-A)</option>
                <option value="precioVenta-asc">Precio (Menor a Mayor)</option>
                <option value="precioVenta-desc">Precio (Mayor a Menor)</option>
                <option value="createdAt-desc">Más Recientes</option>
                <option value="esDestacado-desc">Destacados</option>
              </select>
            </div>
          </div>

          {/* Filtro por categorías */}
          {categorias.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  !selectedCategory
                    ? 'bg-[#128498] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Todos ({articulos.length})
              </button>
              {categorias.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === cat
                      ? 'bg-[#128498] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {cat} ({articulos.filter(a => a.category === cat).length})
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Grid de Artículos */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {filteredArticulos.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-serif font-bold text-gray-900 mb-2">
              No se encontraron artículos
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm 
                ? `No hay resultados para "${searchTerm}"`
                : 'No hay artículos disponibles en este momento'
              }
            </p>
            {searchTerm && (
              <Button onClick={handleClearSearch} className="bg-[#128498] hover:bg-[#0f6a7a]">
                Limpiar búsqueda
              </Button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredArticulos.map((producto) => (
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
                      <h4 className="font-serif text-lg font-semibold text-gray-900 line-clamp-2 flex-1">
                        {producto.name}
                      </h4>
                      {producto.rating && (
                        <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-full ml-2">
                          <Star className="h-3.5 w-3.5 text-yellow-500 fill-current" />
                          <span className="text-xs font-semibold text-gray-700">{producto.rating}</span>
                        </div>
                      )}
                    </div>

                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{producto.description}</p>
                    
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl font-bold text-[#128498]">{producto.price}</span>
                      <Badge variant="outline" className="text-xs">{producto.category}</Badge>
                    </div>

                    <ProductDetailModal
                      product={producto}
                      trigger={
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedProduct(producto)}
                          className="w-full border-2 border-[#128498] text-[#128498] hover:bg-[#128498] hover:text-white transition-all"
                        >
                          Ver Detalles
                        </Button>
                      }
                      favorites={favorites}
                      toggleFavorite={toggleFavorite}
                    />
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Paginación */}
            {totalPages > 1 && (
              <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-sm text-gray-600">
                  Mostrando {((currentPage - 1) * limit) + 1} - {Math.min(currentPage * limit, total)} de {total} artículos
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    variant="outline"
                    size="sm"
                    className="border-[#128498] text-[#128498] hover:bg-[#128498] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Anterior
                  </Button>

                  <div className="flex gap-1">
                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                      let pageNum
                      if (totalPages <= 5) {
                        pageNum = i + 1
                      } else if (currentPage <= 3) {
                        pageNum = i + 1
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i
                      } else {
                        pageNum = currentPage - 2 + i
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                            currentPage === pageNum
                              ? 'bg-[#128498] text-white'
                              : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      )
                    })}
                  </div>

                  <Button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    variant="outline"
                    size="sm"
                    className="border-[#128498] text-[#128498] hover:bg-[#128498] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Siguiente
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}