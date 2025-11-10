"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog"
import { Heart, Star, Check, Shield, ChevronDown, Calendar as CalendarIcon } from "lucide-react"

interface ProductDetailModalProps {
  product: any
  trigger: React.ReactNode
  favorites: number[]
  toggleFavorite: (id: number) => void
  formData?: any
  setFormData?: any
  formStep?: number
  setFormStep?: any
  handleSubmit?: any
  formatDate?: any
  availableTimeSlots?: string[]
  submittingForm?: boolean
  submitError?: string | null
  AppointmentForm?: React.ComponentType<any>
}

export function ProductDetailModal({
  product,
  trigger,
  favorites,
  toggleFavorite,
  formData,
  setFormData,
  formStep,
  setFormStep,
  handleSubmit,
  formatDate,
  availableTimeSlots,
  submittingForm,
  submitError,
  AppointmentForm
}: ProductDetailModalProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  if (!product) return null

  // Filtrar imágenes válidas (no null, undefined o vacías)
  const validImages = product.images 
    ? product.images.filter((img: string) => img && img.trim() !== '') 
    : []

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-[95vw] w-full max-h-[95vh] overflow-hidden p-8">
        <DialogHeader>
          <DialogTitle className="sr-only">{product.name}</DialogTitle>
        </DialogHeader>
        
        <div className="grid lg:grid-cols-[1.2fr_1fr] gap-8 lg:max-h-[82vh]">
          {/* Galería de Imágenes - FIJA en desktop, normal en mobile */}
          <div className="space-y-4 lg:sticky lg:top-0 lg:self-start">
            {/* Imagen Principal */}
            <div className="relative w-full lg:max-h-[68vh] max-h-[50vh] rounded-2xl overflow-hidden bg-gray-100 shadow-xl flex items-center justify-center">
              <img
                src={validImages[selectedImageIndex] || product.image}
                alt={product.name}
                className="w-full h-auto lg:max-h-[68vh] max-h-[50vh] object-contain"
              />
              <button
                onClick={() => toggleFavorite(product.id)}
                className="absolute top-4 right-4 bg-white p-3 rounded-full shadow-lg hover:scale-110 transition-all z-10"
              >
                <Heart className={`h-6 w-6 ${favorites.includes(product.id) ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
              </button>

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.badges?.map((badge: string, idx: number) => (
                  <Badge
                    key={idx}
                    className={`${badge === "Más Popular" ? "bg-[#128498]" :
                      badge === "Nuevo" ? "bg-[#A1D0B2] text-gray-900" :
                        badge === "Disponible" ? "bg-green-500" :
                          "bg-red-500"
                      } shadow-lg`}
                  >
                    {badge}
                  </Badge>
                ))}
              </div>

              {/* Navegación de imágenes */}
              {validImages.length > 1 && (
                <>
                  <button
                    onClick={() => setSelectedImageIndex((prev: number) =>
                      prev > 0 ? prev - 1 : validImages.length - 1
                    )}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-all"
                  >
                    <ChevronDown className="h-5 w-5 rotate-90 text-gray-800" />
                  </button>
                  <button
                    onClick={() => setSelectedImageIndex((prev: number) =>
                      prev < validImages.length - 1 ? prev + 1 : 0
                    )}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-all"
                  >
                    <ChevronDown className="h-5 w-5 -rotate-90 text-gray-800" />
                  </button>
                </>
              )}
            </div>

            {/* Miniaturas - Solo mostrar si hay más de 1 imagen válida */}
            {validImages.length > 1 && (
              <div className="flex flex-wrap gap-3 max-w-md mx-auto justify-center">
                {validImages.map((image: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all hover:scale-105 flex-shrink-0 ${
                      selectedImageIndex === idx 
                        ? 'border-[#128498] shadow-lg scale-105' 
                        : 'border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Información del Producto - CON SCROLL solo en desktop */}
          <div className="space-y-5 pb-4 lg:overflow-y-auto lg:max-h-[82vh] product-detail-scroll lg:pr-2">
            {/* Header */}
            <div>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                {product.name}
              </h2>
              <div className="flex items-center gap-4 mb-3">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-5 w-5 ${i < Math.floor(product.rating || 0) ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} />
                  ))}
                </div>
                {product.rating && (
                  <span className="text-gray-600">
                    {product.rating} ({product.reviews || 0} reseñas)
                  </span>
                )}
              </div>
              <p className="text-3xl font-bold text-[#128498]">{product.price}</p>
              <p className="text-sm text-gray-500 mt-1">Precio de alquiler por evento</p>
            </div>

            {/* Descripción */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Descripción</h3>
              <p className="text-gray-600 leading-relaxed">{product.fullDescription || product.description}</p>
            </div>

            {/* Características */}
            {product.features && product.features.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Características</h3>
                <ul className="space-y-2">
                  {product.features.map((feature: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2 text-gray-600">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Cuidados */}
            {product.care && (
              <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <Shield className="h-5 w-5 text-amber-600" />
                  Cuidados
                </h3>
                <p className="text-gray-700 text-sm">{product.care}</p>
              </div>
            )}

            {/* Ocasiones */}
            {product.occasion && product.occasion.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Ideal Para</h3>
                <div className="flex flex-wrap gap-2">
                  {product.occasion.map((occ: string) => (
                    <Badge key={occ} className="bg-[#B4D8D8] text-gray-800 hover:bg-[#9bc2c2]">
                      {occ}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* CTAs - Sticky solo en desktop con scroll */}
            <div className="lg:sticky lg:bottom-0 bg-gradient-to-t from-white via-white to-transparent pt-6 pb-2 lg:-mx-2 lg:px-2 border-t space-y-3 mt-6">
              {AppointmentForm && formData && setFormData && handleSubmit ? (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="lg" className="w-full bg-[#128498] hover:bg-[#0f6a7a] text-white">
                      <CalendarIcon className="mr-2 h-5 w-5" />
                      Reservar Cita para Probar
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="font-serif text-2xl text-center">
                        Reservar {product.name}
                      </DialogTitle>
                      <DialogDescription className="text-center text-gray-600">
                        Agendá tu cita para probarte este artículo
                      </DialogDescription>
                    </DialogHeader>
                    <AppointmentForm
                      itemName={product.name}
                      formData={formData}
                      setFormData={setFormData}
                      formStep={formStep}
                      setFormStep={setFormStep}
                      handleSubmit={handleSubmit}
                      formatDate={formatDate}
                      availableTimeSlots={availableTimeSlots}
                      submittingForm={submittingForm}
                      submitError={submitError}
                    />
                  </DialogContent>
                </Dialog>
              ) : (
                <Button size="lg" className="w-full bg-[#128498] hover:bg-[#0f6a7a] text-white">
                  <CalendarIcon className="mr-2 h-5 w-5" />
                  Reservar Cita para Probar
                </Button>
              )}

              <a
                href="https://wa.me/1234567890"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 border-2 border-green-500 text-green-600 rounded-lg hover:bg-green-50 transition-all font-semibold"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                </svg>
                Consultar por WhatsApp
              </a>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

