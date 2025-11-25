"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Mail, Phone, MapPin, Instagram, Facebook, Heart, Star, Menu,
  Check, Clock, Shield, Sparkles, TrendingUp, ChevronDown, ChevronUp,
  Package, Truck, Calendar as CalendarIcon, Users, Award, Zap
} from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { getArticulosPublicos, convertirArticuloAProducto, crearLeadPublico, separarNombreCompleto, formatearFechaAPI } from "@/lib/api"
import type { Articulo } from "@/types/articulo"
import { ProductDetailModal } from "@/components/product-detail-modal"

// Componente de formulario de cita separado para evitar pérdida de foco
interface AppointmentFormProps {
  itemName?: string
  formData: {
    name: string
    phone: string
    email: string
    dni: string
    date: Date | undefined
    time: string
  }
  setFormData: React.Dispatch<React.SetStateAction<{
    name: string
    phone: string
    email: string
    dni: string
    date: Date | undefined
    time: string
  }>>
  formStep: number
  setFormStep: (step: number) => void
  handleSubmit: (e: React.FormEvent) => void
  formatDate: (date: Date | undefined) => string
  availableTimeSlots: string[]
  submittingForm: boolean
  submitError: string | null
}

const AppointmentForm: React.FC<AppointmentFormProps> = ({
  itemName,
  formData,
  setFormData,
  formStep,
  setFormStep,
  handleSubmit,
  formatDate,
  availableTimeSlots,
  submittingForm,
  submitError,
}) => {
  const [calendarOpen, setCalendarOpen] = useState(false)

  return (
    <div className="space-y-6">
      {itemName && (
        <div className="bg-[#B4D8D8]/20 p-4 rounded-lg text-center">
          <p className="text-sm text-gray-600">Reservando cita para probar:</p>
          <p className="font-serif text-lg font-semibold text-[#128498]">{itemName}</p>
        </div>
      )}

      {/* Progress Indicator */}
      <div className="flex items-center justify-center space-x-2">
        <div className={`flex items-center justify-center w-8 h-8 rounded-full ${formStep === 1 ? 'bg-[#128498] text-white' : 'bg-[#B4D8D8] text-gray-700'} font-semibold`}>
          1
        </div>
        <div className="w-12 h-1 bg-gray-200"></div>
        <div className={`flex items-center justify-center w-8 h-8 rounded-full ${formStep === 2 ? 'bg-[#128498] text-white' : 'bg-gray-200 text-gray-400'} font-semibold`}>
          2
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {formStep === 1 ? (
          <>
            <div>
              <Label htmlFor="name">Nombre y Apellido</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ej: María González"
                required
              />
            </div>
            <div>
              <Label htmlFor="phone">Teléfono (WhatsApp)</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="Ej: +54 9 11 1234-5678"
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="tu@email.com"
                required
              />
            </div>
            <Button
              type="button"
              onClick={() => {
                if (formData.name && formData.phone && formData.email) {
                  setFormStep(2)
                }
              }}
              className="w-full bg-[#128498] hover:bg-[#0f6a7a] text-white"
            >
              Continuar <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </>
        ) : (
          <>
            <div>
              <Label>Fecha de la Cita</Label>
              <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formatDate(formData.date)}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.date}
                    onSelect={(date) => {
                      // Limpiar el horario cuando cambia la fecha
                      setFormData({ ...formData, date, time: "" })
                      // Cerrar el Popover cuando se selecciona una fecha
                      setCalendarOpen(false)
                    }}
                    disabled={(date) => date < new Date() || date.getDay() === 0}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <p className="text-xs text-gray-500 mt-1">No atendemos domingos</p>
            </div>
            <div>
              <Label htmlFor="time">Horario Disponible</Label>
              <select
                id="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#128498] disabled:bg-gray-100 disabled:cursor-not-allowed"
                required
                disabled={!formData.date || availableTimeSlots.length === 0}
              >
                <option value="">
                  {!formData.date
                    ? "Primero selecciona una fecha"
                    : availableTimeSlots.length === 0
                      ? "No hay horarios disponibles"
                      : "Selecciona un horario"}
                </option>
                {availableTimeSlots.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot} hs
                  </option>
                ))}
              </select>
              {formData.date && availableTimeSlots.length > 0 && (
                <p className="text-xs text-gray-500 mt-1">
                  {formData.date.getDay() === 6
                    ? "Sábado: 10:00 a 14:00 hs"
                    : "Lunes a Viernes: 10:00 a 20:00 hs"}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="dni">DNI</Label>
              <Input
                id="dni"
                value={formData.dni}
                onChange={(e) => setFormData({ ...formData, dni: e.target.value })}
                placeholder="12345678"
              />
              <p className="text-xs text-gray-500 mt-1">Solo necesario para la reservá final</p>
            </div>

            {/* Mensaje de error */}
            {submitError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-600">
                {submitError}
              </div>
            )}

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setFormStep(1)}
                className="flex-1"
                disabled={submittingForm}
              >
                <ChevronUp className="mr-2 h-4 w-4" /> Volver
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-[#128498] hover:bg-[#0f6a7a] text-white"
                disabled={submittingForm}
              >
                {submittingForm ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Enviando...
                  </>
                ) : (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Confirmar Cita
                  </>
                )}
              </Button>
            </div>
          </>
        )}
      </form>
    </div>
  )
}

export default function DressRentalPage() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    dni: "",
    date: undefined as Date | undefined,
    time: "",
  })

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState("Todos")
  const [formStep, setFormStep] = useState(1)
  const [favorites, setFavorites] = useState<number[]>([])
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [previousSlide, setPreviousSlide] = useState<number | null>(null)
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [carouselModalOpen, setCarouselModalOpen] = useState(false)

  // Estados para artículos de la API
  const [articulosAPI, setArticulosAPI] = useState<any[]>([])
  const [loadingArticulos, setLoadingArticulos] = useState(true)
  const [errorArticulos, setErrorArticulos] = useState<string | null>(null)

  // Estados para el formulario de cita
  const [submittingForm, setSubmittingForm] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  // Autoplay del carousel - Pure fade implementation
  // Se pausa cuando el modal está abierto
  useEffect(() => {
    // No ejecutar autoplay si el modal está abierto
    if (carouselModalOpen) {
      return
    }

    const intervalId = setInterval(() => {
      setPreviousSlide(currentSlide)
      setCurrentSlide((prev) => (prev === carouselSlides.length - 1 ? 0 : prev + 1))
    }, 10000) // Cambia cada 10 segundos para coincidir con la animación Ken Burns

    return () => {
      clearInterval(intervalId)
    }
  }, [currentSlide, carouselModalOpen])

  // Cargar artículos de la API
  useEffect(() => {
    const fetchArticulos = async () => {
      try {
        setLoadingArticulos(true)
        setErrorArticulos(null)

        const response = await getArticulosPublicos(1, 50) // Obtener hasta 50 artículos

        // Convertir artículos de la API al formato del componente
        const productosConvertidos = response.data.map(convertirArticuloAProducto)

        setArticulosAPI(productosConvertidos)

        console.log(`✅ ${response.data.length} artículos cargados desde la API`)
      } catch (error) {
        console.error("❌ Error cargando artículos desde la API:", error)
        setErrorArticulos(error instanceof Error ? error.message : "Error desconocido")
        // No mostrar error al usuario, simplemente usar datos hardcodeados
      } finally {
        setLoadingArticulos(false)
      }
    }

    fetchArticulos()
  }, [])

  const carouselSlides = [
    {
      id: 1,
      image: "/portada_1.jpg",
      title: "Vestidos que Cuentan Historias",
      subtitle: "Elegancia para cada ocasión especial",
      cta: "Reservar Cita",
      gradient: "from-[#128498]/80 via-[#128498]/60 to-transparent"
    },
    {
      id: 2,
      image: "/portada_2.jpg",
      title: "Encontrá Tu Vestido Perfecto",
      subtitle: "Más de 100 diseños exclusivos disponibles",
      cta: "Reservar Cita",
      gradient: "from-[#AB9072]/80 via-[#AB9072]/60 to-transparent"
    },
    {
      id: 3,
      image: "/portada_3.jpg",
      title: "Brillá en Tu Evento",
      subtitle: "Colección Premium 2025",
      cta: "Reservar Cita",
      gradient: "from-[#A1D0B2]/80 via-[#A1D0B2]/60 to-transparent"
    }
  ]

  // Función para generar horarios disponibles según el día de la semana
  const getAvailableTimeSlots = (date: Date | undefined): string[] => {
    if (!date) return []

    const dayOfWeek = date.getDay() // 0 = Domingo, 1 = Lunes, ..., 6 = Sábado

    // Sábado: 10:00 a 14:00 (cada 30 minutos)
    if (dayOfWeek === 6) {
      const slots: string[] = []
      for (let hour = 10; hour < 14; hour++) {
        slots.push(`${hour.toString().padStart(2, '0')}:00`)
        slots.push(`${hour.toString().padStart(2, '0')}:30`)
      }
      return slots
    }

    // Lunes a Viernes: 10:00 a 20:00 (cada 30 minutos)
    if (dayOfWeek >= 1 && dayOfWeek <= 5) {
      const slots: string[] = []
      for (let hour = 10; hour < 20; hour++) {
        slots.push(`${hour.toString().padStart(2, '0')}:00`)
        slots.push(`${hour.toString().padStart(2, '0')}:30`)
      }
      return slots
    }

    // Domingo: no hay horarios disponibles
    return []
  }

  const availableTimeSlots = getAvailableTimeSlots(formData.date)

  const formatDate = (date: Date | undefined) => {
    if (!date) return "Selecciona una fecha"
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }
    return date.toLocaleDateString("es-ES", options)
  }

  const toggleFavorite = (id: number) => {
    setFavorites(prev =>
      prev.includes(id) ? prev.filter(fav => fav !== id) : [...prev, id]
    )
  }

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validar que tengamos todos los datos necesarios
    if (!formData.name || !formData.email || !formData.date || !formData.time) {
      setSubmitError("Por favor completa todos los campos requeridos")
      return
    }

    setSubmittingForm(true)
    setSubmitError(null)

    try {
      // Separar nombre y apellido
      const { nombre, apellido } = separarNombreCompleto(formData.name)

      // Formatear fecha
      const fechaFormateada = formatearFechaAPI(formData.date)

      // Preparar datos para el API
      const leadData = {
        nombre,
        apellido,
        email: formData.email,
        telefono: formData.phone || undefined,
        dni: formData.dni || undefined,
        crearCita: true,
        fecha: fechaFormateada,
        horario: formData.time,
      }

      console.log("Enviando lead:", leadData)

      // Enviar a la API
      const response = await crearLeadPublico(leadData)

      if (response.success) {
        // Éxito
        alert("¡Solicitud de cita enviada exitosamente! Te contactaremos pronto.")

        // Limpiar formulario
        setFormData({ name: "", phone: "", email: "", dni: "", date: undefined, time: "" })
        setFormStep(1)
      } else {
        // Error desde la API
        setSubmitError(response.message || "Error al enviar la solicitud")
        alert(`Error: ${response.message}`)
      }
    } catch (error) {
      console.error("Error al enviar formulario:", error)
      setSubmitError("Error de conexión. Por favor intenta nuevamente.")
      alert("Error al enviar la solicitud. Por favor intenta nuevamente.")
    } finally {
      setSubmittingForm(false)
    }
  }


  const testimonials = [
    {
      id: 1,
      name: "María González",
      image: "/placeholder-user.jpg",
      rating: 5,
      comment: "¡Increíble servicio! El vestido era exactamente lo que necesitaba para la boda. La atención fue excepcional.",
      event: "Boda",
    },
    {
      id: 2,
      name: "Laura Martínez",
      image: "/placeholder-user.jpg",
      rating: 5,
      comment: "Quedé enamorada del vestido. La calidad es excelente y el precio muy accesible. ¡Volveré sin duda!",
      event: "Fiesta de 15",
    },
    {
      id: 3,
      name: "Carolina Ruiz",
      image: "/placeholder-user.jpg",
      rating: 5,
      comment: "Profesionales, atentas y con vestidos hermosos. Me ayudaron a encontrar el vestido perfecto para mi graduación.",
      event: "Graduación",
    },
  ]

  // Todos los productos vienen de la API
  const allProducts = [...articulosAPI]

  // Obtener categorías únicas de los artículos
  const categoriasDisponibles = ["Todos", ...Array.from(new Set(allProducts.map(p => p.category)))]

  // Filtrar productos por categoría seleccionada
  const filteredProducts =
    selectedCategory === "Todos" ? allProducts : allProducts.filter((product) => product.category === selectedCategory)

  // Agrupar productos por categoría para mostrarlos organizados
  const productosPorCategoria: { [key: string]: any[] } = {}
  filteredProducts.forEach(product => {
    if (!productosPorCategoria[product.category]) {
      productosPorCategoria[product.category] = []
    }
    productosPorCategoria[product.category].push(product)
  })

  // Para compatibilidad con el código existente
  const longDresses = productosPorCategoria["Largos"] || []
  const shortDresses = productosPorCategoria["Cortos"] || []
  const shoesProducts = productosPorCategoria["Zapatos"] || []


  return (
    <div className="min-h-screen bg-white">
      <div className="fixed bottom-6 right-6 z-50">
        <a
          href="https://wa.me/+5491151101658"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-green-500 hover:bg-green-600 text-white w-14 h-14 rounded-full shadow-lg transition-all duration-300 hover:scale-110 flex items-center justify-center"
        >
          <svg className="h-7 w-7" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
          </svg>
        </a>
      </div>

      {/* Header - Minimalista estilo Toia de Kiev */}
      <header className="absolute top-0 left-0 right-0 z-50 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            {/* Logo Secundario - Visible en mobile y desktop */}
            <div className="flex items-center">
              <img
                src="/CMYK LOGO SECUNDARIO JPG FONDO TRANSPARENTE  HORIZONTAL VERSION NEGRO.png"
                alt="Díaz & De Luca Logo"
                className="h-10 md:h-16 object-contain"
                style={{
                  filter: 'brightness(0) invert(1)',
                  WebkitFilter: 'brightness(0) invert(1)'
                }}
              />
            </div>

            <nav className="hidden md:flex items-center space-x-8">
              <a href="#catalogo" className="text-white hover:text-white/80 transition-colors text-sm font-light tracking-wide uppercase">
                Alquiler
              </a>
              <a href="#catalogo" className="text-white hover:text-white/80 transition-colors text-sm font-light tracking-wide uppercase">
                Catálogo
              </a>
              <a href="#faq" className="text-white hover:text-white/80 transition-colors text-sm font-light tracking-wide uppercase">
                Preguntas Frecuentes
              </a>
              <Dialog>
                <DialogTrigger asChild>
                  <button className="text-white hover:text-white/80 transition-colors text-sm font-light tracking-wide uppercase border border-white/30 px-4 py-2 hover:border-white/60 transition-all">
                    Coordinar Cita
                  </button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle className="font-serif text-2xl text-center">Reservá tu Cita</DialogTitle>
                  </DialogHeader>
                  <AppointmentForm
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
            </nav>

            <button className="md:hidden p-2 text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <Menu className="h-6 w-6" />
            </button>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden bg-white/95 backdrop-blur-md py-4 rounded-lg mt-2">
              <nav className="flex flex-col space-y-4 px-4">
                <a href="#catalogo" className="text-gray-700 hover:text-[#128498] transition-colors text-sm uppercase tracking-wide">
                  Alquiler
                </a>
                <a href="#catalogo" className="text-gray-700 hover:text-[#128498] transition-colors text-sm uppercase tracking-wide">
                  Catálogo
                </a>
                <a href="#faq" className="text-gray-700 hover:text-[#128498] transition-colors text-sm uppercase tracking-wide">
                  Preguntas Frecuentes
                </a>
                <Dialog>
                  <DialogTrigger asChild>
                    <button className="text-left text-gray-700 hover:text-[#128498] transition-colors text-sm uppercase tracking-wide border border-gray-300 px-4 py-2 rounded">
                      Coordinar Cita
                    </button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle className="font-serif text-2xl text-center">Reservá tu Cita</DialogTitle>
                    </DialogHeader>
                    <AppointmentForm
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
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section Fullscreen - Estilo Toia de Kiev - Fade Carousel */}
      <section className="relative w-full h-screen overflow-hidden">
        {/* Slides container - absolute positioning for pure fade effect */}
        <div className="relative w-full h-screen">
          {carouselSlides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 w-full h-screen transition-opacity duration-[2500ms] ${currentSlide === index ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                }`}
              style={{
                transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            >
              <div className="relative w-full h-full">
                {/* Background Image - Fullscreen con Ken Burns Effect */}
                <div className="absolute inset-0 w-full h-full overflow-hidden">
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className={`w-full h-full object-cover object-center ${index % 2 === 0
                        ? 'carousel-image-animate'
                        : 'carousel-image-animate-alt'
                      }`}
                    style={{
                      minWidth: '100%',
                      minHeight: '100%',
                      objectFit: 'cover',
                      objectPosition: 'center',
                      animationDelay: `${index * -3}s`
                    }}
                  />
                  {/* Overlay sutil */}
                  <div className="absolute inset-0 bg-black/10"></div>
                </div>

                {/* Content - Centrado vertical y horizontal estilo minimalista */}
                <div className="relative z-10 h-full flex items-center justify-center">
                  <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center">
                    <h1
                      key={`title-${slide.id}-${currentSlide}`}
                      className={`font-serif text-5xl md:text-7xl lg:text-8xl font-light text-white mb-6 leading-tight tracking-wider ${currentSlide === index
                          ? 'carousel-text-enter'
                          : previousSlide === index
                            ? 'carousel-text-exit'
                            : 'opacity-0'
                        }`}
                    >
                      {slide.title}
                    </h1>

                    <p
                      key={`subtitle-${slide.id}-${currentSlide}`}
                      className={`text-lg md:text-xl text-white/90 mb-12 leading-relaxed font-light tracking-wide max-w-2xl mx-auto ${currentSlide === index
                          ? 'carousel-text-enter carousel-text-delay-1'
                          : previousSlide === index
                            ? 'carousel-text-exit carousel-text-delay-1'
                            : 'opacity-0'
                        }`}
                    >
                      {slide.subtitle}
                    </p>

                    <div
                      key={`buttons-${slide.id}-${currentSlide}`}
                      className={`flex flex-col sm:flex-row gap-4 justify-center items-center ${currentSlide === index
                          ? 'carousel-text-enter carousel-text-delay-2'
                          : previousSlide === index
                            ? 'carousel-text-exit carousel-text-delay-2'
                            : 'opacity-0'
                        }`}
                    >
                      <Dialog open={carouselModalOpen} onOpenChange={setCarouselModalOpen}>
                        <DialogTrigger asChild>
                          <button className="bg-white text-gray-900 hover:bg-gray-50 px-8 py-4 text-sm font-light tracking-wider uppercase transition-all duration-300 border border-white">
                            {slide.cta}
                          </button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle className="font-serif text-2xl text-center">Reservá tu Cita</DialogTitle>
                            <DialogDescription className="text-center text-gray-600">
                              Agendá tu visita para probarte los vestidos que más te gusten
                            </DialogDescription>
                          </DialogHeader>
                          <AppointmentForm
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

                      <button
                        onClick={() => document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' })}
                        className="border border-white/50 text-white hover:border-white hover:bg-white/10 px-8 py-4 text-sm font-light tracking-wider uppercase transition-all duration-300"
                      >
                        Explorar Colección
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Arrows - Minimalistas */}
        <button
          onClick={() => {
            setPreviousSlide(currentSlide)
            setCurrentSlide((prev) => (prev === 0 ? carouselSlides.length - 1 : prev - 1))
          }}
          className="absolute left-8 top-1/2 -translate-y-1/2 z-30 bg-transparent border border-white/30 text-white hover:bg-white/10 hover:border-white h-12 w-12 rounded-full opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center"
          aria-label="Previous slide"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={() => {
            setPreviousSlide(currentSlide)
            setCurrentSlide((prev) => (prev === carouselSlides.length - 1 ? 0 : prev + 1))
          }}
          className="absolute right-8 top-1/2 -translate-y-1/2 z-30 bg-transparent border border-white/30 text-white hover:bg-white/10 hover:border-white h-12 w-12 rounded-full opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center"
          aria-label="Next slide"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Carousel Indicators - Minimalistas */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
          {carouselSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setPreviousSlide(currentSlide)
                setCurrentSlide(index)
              }}
              className={`transition-all duration-300 h-1 ${currentSlide === index
                ? 'w-8 bg-white'
                : 'w-8 bg-white/30 hover:bg-white/50'
                }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>
      {/* Secondary Hero Section */}
      <section id="inicio" className="relative bg-gradient-to-br from-[#B4D8D8] via-[#E0D7CE] to-[#F9F7F5] py-24 md:py-36 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#128498]/5 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#A1D0B2]/5 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left space-y-8">
              {/* <div className="inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm">
                <Sparkles className="h-4 w-4 text-[#128498] mr-2" />
                <span className="text-sm font-medium text-gray-700">Más de 10 años creando momentos especiales</span>
              </div> */}

              <h2 className="font-serif text-5xl md:text-7xl font-bold text-[#128498] leading-tight">
                Vestidos que
                <span className="italic block text-[#128498]">cuentan</span>
                <span className="text-[#128498] block">historias...</span>
              </h2>

              <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-xl">
                Descubrí  nuestra exclusiva colección de vestidos y accesorios. Tu elegancia comienza aquí.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="lg" className="bg-[#128498] hover:bg-[#0f6a7a] text-white px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all">
                      <CalendarIcon className="mr-2 h-5 w-5" />
                      Reservar Cita
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="font-serif text-2xl text-center">Reservá tu Cita</DialogTitle>
                      <DialogDescription className="text-center text-gray-600">
                        Agendá tu visita para probarte los vestidos que más te gusten
                      </DialogDescription>
                    </DialogHeader>
                    <AppointmentForm
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
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' })}
                  className="border-2 border-[#128498] text-[#128498] hover:bg-[#128498]/10 px-8 py-4 text-lg bg-white/80 backdrop-blur-sm"
                >
                  Explorar Colección
                </Button>
              </div>

              {/* Trust indicators */}
              <div className="flex flex-wrap gap-6 justify-center lg:justify-start pt-4">
                <div className="flex items-center gap-2">
                  <div className="bg-white p-2 rounded-lg shadow-sm">
                    <Check className="h-5 w-5 text-green-600" />
                  </div>
                  <span className="text-sm text-gray-600">PRIMERA CALIDAD</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="bg-white p-2 rounded-lg shadow-sm">
                    <Shield className="h-5 w-5 text-[#128498]" />
                  </div>
                  <span className="text-sm text-gray-600">SERVICIO CONFIABLE</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="bg-white p-2 rounded-lg shadow-sm">
                    <Clock className="h-5 w-5 text-[#A1D0B2]" />
                  </div>
                  <span className="text-sm text-gray-600">RESERVA FLEXIBLE</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative z-10">
                <img
                  src="/principal.jpg"
                  alt="Mujer elegante en vestido de fiesta"
                  className="w-full h-auto rounded-3xl shadow-2xl"
                />
              </div>
              <div className="absolute -bottom-8 -left-8 bg-white p-6 rounded-2xl shadow-xl z-20 animate-[float_3s_ease-in-out_infinite]">
                <div className="flex items-center space-x-3">
                  <div className="flex -space-x-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#128498] to-[#A1D0B2] flex items-center justify-center text-white font-bold">5</div>
                    <Star className="h-5 w-5 text-yellow-500 fill-current" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">4.9/5</p>
                    <p className="text-sm text-gray-600">+200 clientas</p>
                  </div>
                </div>
              </div>
              <div className="absolute -top-8 -right-8 bg-[#128498] text-white p-4 rounded-2xl shadow-xl z-20 animate-[float_3s_ease-in-out_infinite] animation-delay-150">
                <TrendingUp className="h-6 w-6 mb-1" />
                <p className="text-sm font-semibold">Más Popular</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#128498] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="font-serif text-3xl md:text-4xl text-white mb-2">¿Tenés una fiesta?</h3>
          <p className="text-xl md:text-2xl text-white/90 italic">¡Te esperamos!</p>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-white mx-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-8">
            <div className="text-center group w-full sm:w-80">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-[#128498] to-[#0f6a7a] rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Package className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-serif text-xl font-semibold text-gray-900 mb-2">Amplia Colección</h3>
              <p className="text-gray-600">Vestidos y accesorios para cada ocasión especial</p>
            </div>

            <div className="text-center group w-full sm:w-80">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-[#AB9072] to-[#967a5f] rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-serif text-xl font-semibold text-gray-900 mb-2">Arreglos Express</h3>
              <p className="text-gray-600">Ajustes profesionales disponibles</p>
            </div>

            <div className="text-center group w-full sm:w-80">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-[#B4D8D8] to-[#9bc2c2] rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-serif text-xl font-semibold text-gray-900 mb-2">Atención Personalizada</h3>
              <p className="text-gray-600">Te acompañamos en cada paso</p>
            </div>
          </div>
        </div>
      </section>

      <section id="catalogo" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto text-center mb-16">
            <h2 className="font-serif text-3xl md:text-5xl font-bold text-gray-900 mb-4">Nuestra Colección</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
              Cada vestido ha sido cuidadosamente seleccionado para garantizar que te sientas radiante y segura en tu
              día especial.
            </p>
            <a
              href="/articulos"
              className="inline-flex items-center gap-2 px-8 py-3 bg-[#128498] hover:bg-[#0f6a7a] text-white rounded-lg font-semibold transition-all hover:shadow-lg"
            >
              Ver Catálogo
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>

            {/* Indicador de carga de API */}
            {loadingArticulos && (
              <div className="mt-4 flex items-center justify-center gap-2 text-[#128498]">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#128498]"></div>
              </div>
            )}

            {/* Total de productos */}
            {!loadingArticulos && (
              <p className="mt-4 text-sm text-gray-500">
                {allProducts.length} producto{allProducts.length !== 1 ? 's' : ''} disponible{allProducts.length !== 1 ? 's' : ''}
                {articulosAPI.length > 0 && (
                  <span className="text-[#128498] font-semibold ml-1">
                    ({articulosAPI.length})
                  </span>
                )}
              </p>
            )}
          </div>

          <div className="flex flex-wrap justify-center gap-4 mb-12 items-center">
            {categoriasDisponibles.map((category) => {
              const count = category === "Todos" ? allProducts.length : allProducts.filter(p => p.category === category).length
              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-2 rounded-full font-medium transition-colors ${selectedCategory === category
                    ? "bg-[#128498] text-white shadow-lg"
                    : "bg-white text-gray-700 hover:bg-[#B4D8D8] border border-gray-200"
                    }`}
                >
                  {category} <span className="ml-1 text-xs opacity-75">({count})</span>
                </button>
              )
            })}
          </div>

          {/* Vestidos Largos Section */}
          {(selectedCategory === "Todos" || selectedCategory === "Largos") && longDresses.length > 0 && (
            <div className="mb-16">
              <div className="grid lg:grid-cols-4 gap-8 items-center">
                <div className="lg:col-span-1">
                  <div className="bg-[#128498] text-white p-8 rounded-2xl text-center h-full flex flex-col justify-center">
                    <h3 className="font-serif text-3xl font-bold mb-4">Vestidos</h3>
                    <p className="text-2xl italic">largos</p>
                    <div className="w-16 h-0.5 bg-white mx-auto mt-4"></div>
                  </div>
                </div>
                <div className="lg:col-span-3">
                  <div className="grid md:grid-cols-3 gap-6">
                    {longDresses.map((dress) => (
                      <Card
                        key={dress.id}
                        className="group hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 hover:border-[#128498]/20"
                      >
                        <div className="relative overflow-hidden">
                          <img
                            src={dress.image || "/placeholder.svg"}
                            alt={dress.name}
                            className="w-full h-72 object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          {/* Favorite button */}
                          <button
                            onClick={() => toggleFavorite(dress.id)}
                            className="absolute top-3 right-3 bg-white p-2.5 rounded-full shadow-lg hover:scale-110 transition-all"
                          >
                            <Heart className={`h-5 w-5 ${favorites.includes(dress.id) ? 'fill-red-500 text-red-500' : 'text-gray-600 hover:text-red-500'} transition-colors`} />
                          </button>
                        </div>
                        <CardContent className="p-5">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-serif text-lg font-semibold text-gray-900">{dress.name}</h4>
                            <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-full">
                              <Star className="h-3.5 w-3.5 text-yellow-500 fill-current" />
                              <span className="text-xs font-semibold text-gray-700">{dress.rating}</span>
                            </div>
                          </div>
                          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{dress.description}</p>
                          <ProductDetailModal
                            product={dress}
                            trigger={
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedProduct(dress)
                                  setSelectedImageIndex(0)
                                }}
                                className="w-full border-2 border-[#128498] text-[#128498] hover:bg-[#128498] hover:text-white bg-transparent transition-all"
                              >
                                Ver Detalles
                              </Button>
                            }
                            favorites={favorites}
                            toggleFavorite={toggleFavorite}
                            formData={formData}
                            setFormData={setFormData}
                            formStep={formStep}
                            setFormStep={setFormStep}
                            handleSubmit={handleSubmit}
                            formatDate={formatDate}
                            availableTimeSlots={availableTimeSlots}
                            submittingForm={submittingForm}
                            submitError={submitError}
                            AppointmentForm={AppointmentForm}
                          />
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Vestidos Cortos Section */}
          {(selectedCategory === "Todos" || selectedCategory === "Cortos") && shortDresses.length > 0 && (
            <div>
              <div className="grid lg:grid-cols-4 gap-8 items-center">
                <div className="lg:col-span-1">
                  <div className="bg-[#AB9072] text-white p-8 rounded-2xl text-center h-full flex flex-col justify-center">
                    <h3 className="font-serif text-3xl font-bold mb-4">Vestidos</h3>
                    <p className="text-2xl italic">cortos</p>
                    <div className="w-16 h-0.5 bg-white mx-auto mt-4"></div>
                  </div>
                </div>
                <div className="lg:col-span-3">
                  <div className="grid md:grid-cols-3 gap-6">
                    {shortDresses.map((dress) => (
                      <Card
                        key={dress.id}
                        className="group hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 hover:border-[#AB9072]/20"
                      >
                        <div className="relative overflow-hidden">
                          <img
                            src={dress.image || "/placeholder.svg"}
                            alt={dress.name}
                            className="w-full h-72 object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          {/* Favorite button */}
                          <button
                            onClick={() => toggleFavorite(dress.id)}
                            className="absolute top-3 right-3 bg-white p-2.5 rounded-full shadow-lg hover:scale-110 transition-all"
                          >
                            <Heart className={`h-5 w-5 ${favorites.includes(dress.id) ? 'fill-red-500 text-red-500' : 'text-gray-600 hover:text-red-500'} transition-colors`} />
                          </button>
                        </div>
                        <CardContent className="p-5">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-serif text-lg font-semibold text-gray-900">{dress.name}</h4>
                            <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-full">
                              <Star className="h-3.5 w-3.5 text-yellow-500 fill-current" />
                              <span className="text-xs font-semibold text-gray-700">{dress.rating}</span>
                            </div>
                          </div>
                          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{dress.description}</p>
                          <ProductDetailModal
                            product={dress}
                            trigger={
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedProduct(dress)
                                  setSelectedImageIndex(0)
                                }}
                                className="w-full border-2 border-[#AB9072] text-[#AB9072] hover:bg-[#AB9072] hover:text-white bg-transparent transition-all"
                              >
                                Ver Detalles
                              </Button>
                            }
                            favorites={favorites}
                            toggleFavorite={toggleFavorite}
                            formData={formData}
                            setFormData={setFormData}
                            formStep={formStep}
                            setFormStep={setFormStep}
                            handleSubmit={handleSubmit}
                            formatDate={formatDate}
                            availableTimeSlots={availableTimeSlots}
                            submittingForm={submittingForm}
                            submitError={submitError}
                            AppointmentForm={AppointmentForm}
                          />
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Zapatos Section */}
          {(selectedCategory === "Todos" || selectedCategory === "Zapatos") && shoesProducts.length > 0 && (
            <div className="mb-16">
              <div className="grid lg:grid-cols-4 gap-8 items-center">
                <div className="lg:col-span-1">
                  <div className="bg-[#A1D0B2] text-white p-8 rounded-2xl text-center h-full flex flex-col justify-center">
                    <h3 className="font-serif text-3xl font-bold mb-4">Zapatos</h3>
                    <p className="text-2xl italic">elegantes</p>
                    <div className="w-16 h-0.5 bg-white mx-auto mt-4"></div>
                  </div>
                </div>
                <div className="lg:col-span-3">
                  <div className="grid md:grid-cols-3 gap-6">
                    {shoesProducts.map((shoe) => (
                      <Card key={shoe.id} className="group hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 hover:border-[#A1D0B2]/20">
                        <div className="relative overflow-hidden">
                          <img
                            src={shoe.image || "/placeholder.svg"}
                            alt={shoe.name}
                            className="w-full h-72 object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          {/* Favorite button */}
                          <button
                            onClick={() => toggleFavorite(shoe.id)}
                            className="absolute top-3 right-3 bg-white p-2.5 rounded-full shadow-lg hover:scale-110 transition-all"
                          >
                            <Heart className={`h-5 w-5 ${favorites.includes(shoe.id) ? 'fill-red-500 text-red-500' : 'text-gray-600 hover:text-red-500'} transition-colors`} />
                          </button>
                        </div>
                        <CardContent className="p-5">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-serif text-lg font-semibold text-gray-900">{shoe.name}</h4>
                            <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-full">
                              <Star className="h-3.5 w-3.5 text-yellow-500 fill-current" />
                              <span className="text-xs font-semibold text-gray-700">{shoe.rating}</span>
                            </div>
                          </div>
                          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{shoe.description}</p>
                          <ProductDetailModal
                            product={shoe}
                            trigger={
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedProduct(shoe)
                                  setSelectedImageIndex(0)
                                }}
                                className="w-full border-2 border-[#A1D0B2] text-[#A1D0B2] hover:bg-[#A1D0B2] hover:text-white bg-transparent transition-all"
                              >
                                Ver Detalles
                              </Button>
                            }
                            favorites={favorites}
                            toggleFavorite={toggleFavorite}
                            formData={formData}
                            setFormData={setFormData}
                            formStep={formStep}
                            setFormStep={setFormStep}
                            handleSubmit={handleSubmit}
                            formatDate={formatDate}
                            availableTimeSlots={availableTimeSlots}
                            submittingForm={submittingForm}
                            submitError={submitError}
                            AppointmentForm={AppointmentForm}
                          />
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Mostrar otras categorías dinámicamente */}
          {Object.keys(productosPorCategoria)
            .filter(cat => !["Largos", "Cortos", "Zapatos"].includes(cat))
            .map(categoria => {
              const productos = productosPorCategoria[categoria]
              if (productos.length === 0) return null
              if (selectedCategory !== "Todos" && selectedCategory !== categoria) return null

              // Color dinámico basado en la categoría
              const coloresPorCategoria: { [key: string]: string } = {
                "Abrigos": "#D4A574",
                "Accesorios": "#C4B5A0",
                "Otros": "#9CA3AF"
              }
              const colorCategoria = coloresPorCategoria[categoria] || "#6B7280"

              return (
                <div key={categoria} className="mb-16">
                  <div className="grid lg:grid-cols-4 gap-8 items-center">
                    <div className="lg:col-span-1">
                      <div className="text-white p-8 rounded-2xl text-center h-full flex flex-col justify-center" style={{ backgroundColor: colorCategoria }}>
                        <h3 className="font-serif text-3xl font-bold mb-4">{categoria}</h3>
                        <p className="text-2xl italic">{productos.length} productos</p>
                        <div className="w-16 h-0.5 bg-white mx-auto mt-4"></div>
                      </div>
                    </div>
                    <div className="lg:col-span-3">
                      <div className="grid md:grid-cols-3 gap-6">
                        {productos.map((product: any) => (
                          <Card
                            key={product.id}
                            className="group hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 hover:border-[#128498]/20"
                          >
                            <div className="relative overflow-hidden">
                              <img
                                src={product.image || "/placeholder.svg"}
                                alt={product.name}
                                className="w-full h-72 object-cover group-hover:scale-110 transition-transform duration-500"
                                onError={(e) => {
                                  // Prevenir bucle infinito: solo cambiar si no es ya el placeholder
                                  const placeholderDataUri = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlbiBubyBkaXNwb25pYmxlPC90ZXh0Pjwvc3ZnPg=='
                                  if (e.currentTarget.src !== placeholderDataUri) {
                                    e.currentTarget.src = placeholderDataUri
                                  }
                                }}
                              />
                              {/* Favorite button */}
                              <button
                                onClick={() => toggleFavorite(product.id)}
                                className="absolute top-3 right-3 bg-white p-2.5 rounded-full shadow-lg hover:scale-110 transition-all"
                              >
                                <Heart className={`h-5 w-5 ${favorites.includes(product.id) ? 'fill-red-500 text-red-500' : 'text-gray-600 hover:text-red-500'} transition-colors`} />
                              </button>
                            </div>
                            <CardContent className="p-5">
                              <div className="flex items-start justify-between mb-2">
                                <h4 className="font-serif text-lg font-semibold text-gray-900">{product.name}</h4>
                                {product.rating && (
                                  <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-full">
                                    <Star className="h-3.5 w-3.5 text-yellow-500 fill-current" />
                                    <span className="text-xs font-semibold text-gray-700">{product.rating}</span>
                                  </div>
                                )}
                              </div>
                              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>

                              {product.categoriaOriginal && (
                                <div className="mb-3">
                                  <Badge variant="outline" className="text-xs">
                                    {product.categoriaOriginal}
                                  </Badge>
                                </div>
                              )}

                              <ProductDetailModal
                                product={product}
                                trigger={
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      setSelectedProduct(product)
                                      setSelectedImageIndex(0)
                                    }}
                                    className="w-full border-2 text-[#128498] hover:bg-[#128498] hover:text-white bg-transparent transition-all"
                                    style={{ borderColor: colorCategoria }}
                                  >
                                    Ver Detalles
                                  </Button>
                                }
                                favorites={favorites}
                                toggleFavorite={toggleFavorite}
                                formData={formData}
                                setFormData={setFormData}
                                formStep={formStep}
                                setFormStep={setFormStep}
                                handleSubmit={handleSubmit}
                                formatDate={formatDate}
                                availableTimeSlots={availableTimeSlots}
                                submittingForm={submittingForm}
                                submitError={submitError}
                                AppointmentForm={AppointmentForm}
                              />
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-5xl font-bold text-gray-900 mb-4">¿Cómo Funciona?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Alquilar tu vestido perfecto es más fácil de lo que imaginás
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="relative">
              <div className="text-center">
                <div className="mx-auto w-20 h-20 bg-gradient-to-br from-[#128498] to-[#0f6a7a] rounded-full flex items-center justify-center mb-6 relative">
                  <CalendarIcon className="h-10 w-10 text-white" />
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-[#A1D0B2] rounded-full flex items-center justify-center text-gray-900 font-bold text-sm">1</div>
                </div>
                <h3 className="font-serif text-xl font-semibold text-gray-900 mb-3">Agendá tu Cita</h3>
                <p className="text-gray-600">Reservá tu visita online o por WhatsApp. Elegí día y horario.</p>
              </div>
              <div className="hidden md:block absolute top-10 -right-4 w-8 h-0.5 bg-[#B4D8D8]"></div>
            </div>

            <div className="relative">
              <div className="text-center">
                <div className="mx-auto w-20 h-20 bg-gradient-to-br from-[#A1D0B2] to-[#8cb899] rounded-full flex items-center justify-center mb-6 relative">
                  <Sparkles className="h-10 w-10 text-white" />
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-[#128498] rounded-full flex items-center justify-center text-white font-bold text-sm">2</div>
                </div>
                <h3 className="font-serif text-xl font-semibold text-gray-900 mb-3">Probate Vestidos</h3>
                <p className="text-gray-600">Probate todos los que quieras.</p>
              </div>
              <div className="hidden md:block absolute top-10 -right-4 w-8 h-0.5 bg-[#B4D8D8]"></div>
            </div>

            <div className="relative">
              <div className="text-center">
                <div className="mx-auto w-20 h-20 bg-gradient-to-br from-[#AB9072] to-[#967a5f] rounded-full flex items-center justify-center mb-6 relative">
                  <Check className="h-10 w-10 text-white" />
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-[#A1D0B2] rounded-full flex items-center justify-center text-gray-900 font-bold text-sm">3</div>
                </div>
                <h3 className="font-serif text-xl font-semibold text-gray-900 mb-3">Elegí</h3>
                <p className="text-gray-600">Seleccioná tu favorito.</p>
              </div>
              <div className="hidden md:block absolute top-10 -right-4 w-8 h-0.5 bg-[#B4D8D8]"></div>
            </div>

            <div className="relative">
              <div className="text-center">
                <div className="mx-auto w-20 h-20 bg-gradient-to-br from-[#B4D8D8] to-[#9bc2c2] rounded-full flex items-center justify-center mb-6 relative">
                  <Award className="h-10 w-10 text-white" />
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-[#AB9072] rounded-full flex items-center justify-center text-white font-bold text-sm">4</div>
                </div>
                <h3 className="font-serif text-xl font-semibold text-gray-900 mb-3">Disfrutá tu Evento</h3>
                <p className="text-gray-600">Retiralo 2 días antes y devolvelo hasta 3 días después.</p>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <Dialog>
              <DialogTrigger asChild>
                <Button size="lg" className="bg-[#128498] hover:bg-[#0f6a7a] text-white px-8 py-4">
                  <CalendarIcon className="mr-2 h-5 w-5" />
                  Comenzar Ahora
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="font-serif text-2xl text-center">Reservá tu Cita</DialogTitle>
                  <DialogDescription className="text-center text-gray-600">
                    Agendá tu visita para probarte los vestidos que más te gusten
                  </DialogDescription>
                </DialogHeader>
                <AppointmentForm
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
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      {/* <section className="py-20 bg-gradient-to-br from-[#B4D8D8]/20 to-[#E0D7CE]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-5xl font-bold text-gray-900 mb-4">Lo que Dicen Nuestras Clientas</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Más de 200 mujeres confiaron en nosotras para sus momentos especiales
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.id} className="p-6 hover:shadow-xl transition-all duration-300 border-2 hover:border-[#128498]/20">
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-[#B4D8D8]"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.event}</p>
                  </div>
                </div>
                <div className="flex gap-1 mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-500 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 italic leading-relaxed">"{testimonial.comment}"</p>
            </Card>
            ))}
          </div>

          <div className="mt-12 bg-white p-8 rounded-2xl shadow-lg text-center max-w-3xl mx-auto border-2 border-[#128498]/10">
            <div className="flex items-center justify-center gap-8 mb-6">
              <div>
                <p className="text-4xl font-bold text-[#128498]">4.9</p>
                <div className="flex gap-0.5 mt-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-500 fill-current" />
                  ))}
                </div>
              </div>
              <div className="h-16 w-px bg-gray-200"></div>
              <div>
                <p className="text-4xl font-bold text-[#128498]">200+</p>
                <p className="text-sm text-gray-600 mt-1">Clientas Felices</p>
              </div>
              <div className="h-16 w-px bg-gray-200"></div>
              <div>
                <p className="text-4xl font-bold text-[#128498]">10+</p>
                <p className="text-sm text-gray-600 mt-1">Años de Experiencia</p>
              </div>
            </div>
            <p className="text-gray-600">Tu satisfacción es nuestra prioridad</p>
          </div>
        </div>
      </section> */}

      <section id="faq" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-5xl font-bold text-gray-900 mb-4">Preguntas Frecuentes</h2>
            <p className="text-lg text-gray-600">Todo lo que necesitas saber sobre nuestro servicio</p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "¿Puedo ir a probarme los vestidos?",
                a: "Sí, siempre con cita previa y un acompañante por persona. Podés agendarla en el calendario o contactándote por WhatsApp. La cita dura 1 hora aprox. y pedimos puntualidad para no perjudicar a las demás."
              },
              {
                q: "¿Cuánto dura el alquiler?",
                a: "Retirás el vestido 2 días antes de tu evento y lo devolvés entre 2 a 3 días posteriores."
              },
              {
                q: "¿Qué pasa si lo retiro o devuelvo tarde?",
                a: "Podés retirar hasta el mismo día del evento. La devolución debe hacerse en la fecha pactada, para no afectar reservas siguientes."
              },
              {
                q: "¿Con cuánta anticipación puedo reservar el vestido?",
                a: "Podés reservar cuando quieras, no hay un mínimo de anticipación."
              },
              {
                q: "¿Qué pasa con las cancelaciones?",
                a: "En caso de cancelación, el saldo queda a tu favor para usar cuando desees en cualquier otro alquiler."
              },
              {
                q: "¿Se le pueden hacer arreglos al vestido?",
                a: "Sí, siempre que no dañe la confección. Solo ruedos y pinzas, con costo adicional."
              },
              {
                q: "¿Quién se encarga de la tintorería?",
                a: "Nosotras nos encargamos de la limpieza y tintorería del vestido. Lo devolvés tal como lo usaste."
              },
              {
                q: "¿Hacen envíos?",
                a: "Sí, hacemos envíos. El costo del envío está a cargo del cliente."
              },
              {
                q: "¿Puedo comprar el vestido que alquilé?",
                a: "Sí, podés comprarlo siempre que no tenga reservas posteriores. Consultános disponibilidad."
              }
            ].map((faq, index) => (
              <Card
                key={index}
                className={`overflow-hidden transition-all duration-300 ${expandedFaq === index ? 'border-2 border-[#128498] shadow-lg' : 'border-2 border-transparent hover:border-gray-200'
                  }`}
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <h3 className="font-serif text-lg md:text-xl font-semibold text-gray-900 pr-4">
                    {faq.q}
                  </h3>
                  <div className={`flex-shrink-0 transition-transform duration-300 ${expandedFaq === index ? 'rotate-180' : ''}`}>
                    <ChevronDown className="h-6 w-6 text-[#128498]" />
                  </div>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${expandedFaq === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    }`}
                >
                  <div className="px-6 pb-6">
                    <p className="text-gray-600 leading-relaxed">{faq.a}</p>
                  </div>
                </div>
              </Card>
            ))}

            <Card className="p-6 bg-gradient-to-r from-[#B4D8D8] to-[#E0D7CE] border-2 border-[#128498]/20 mt-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#128498] rounded-full flex items-center justify-center flex-shrink-0">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-semibold text-[#128498] mb-1">¡Te esperamos!</h3>
                  <p className="text-gray-700">Estamos aquí para hacer de tu evento algo inolvidable.</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contacto" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-5xl font-bold text-gray-900 mb-4">Contactanos</h2>
            <p className="text-lg text-gray-600">Estamos aquí para hacer realidad el vestido de tus sueños</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center p-8">
              <MapPin className="h-12 w-12 text-[#128498] mx-auto mb-4" />
              <h3 className="font-serif text-xl font-semibold mb-2">Ubicación</h3>
              <p className="text-gray-600">
                Helguera 2691 PB C
                <br />
                Ciudad de buenos aires
                <br />
                CP 1417 CQI
              </p>
            </Card>

            <Card className="text-center p-8">
              <Phone className="h-12 w-12 text-[#128498] mx-auto mb-4" />
              <h3 className="font-serif text-xl font-semibold mb-2">Teléfono</h3>
              <p className="text-gray-600">
                11 5110-1658
                <br />
                Lun - Vie: 10:00 - 20:00
                <br />
                Sab: 10:00 - 14:00
              </p>
            </Card>

            <Card className="text-center p-8">
              <Mail className="h-12 w-12 text-[#128498] mx-auto mb-4" />
              <h3 className="font-serif text-xl font-semibold mb-2">Email</h3>
              <p className="text-gray-600">
                diazdeluca2691@gmail.com
                <br />
                Respuesta en 24hs
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-gradient-to-r from-[#128498] to-[#0f6a7a] py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="font-serif text-3xl md:text-4xl font-bold text-white mb-4">
            Recibí Novedades y Ofertas Exclusivas
          </h3>
          <p className="text-lg text-white/90 mb-8">
            Suscribíte a nuestro newsletter y enterate de nuevos vestidos y promociones especiales
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="tu@email.com"
              className="flex-1 bg-white border-0 h-12 text-gray-900 placeholder:text-gray-500"
            />
            <Button className="bg-white text-[#128498] hover:bg-gray-100 h-12 px-8 font-semibold">
              Suscribirme
            </Button>
          </div>
          <p className="text-sm text-white/70 mt-4">
            No spam. Solo contenido valioso. Podés cancelar en cualquier momento.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center mb-4">
                <img
                  src="/CMYK LOGO SECUNDARIO JPG FONDO TRANSPARENTE  HORIZONTAL VERSION NEGRO.png"
                  alt="Díaz & De Luca Logo"
                  className="h-12 md:h-16 object-contain"
                  style={{
                    filter: 'brightness(0) saturate(100%) invert(27%) sepia(85%) saturate(1200%) hue-rotate(160deg) brightness(0.7) contrast(1.2)',
                    WebkitFilter: 'brightness(0) saturate(100%) invert(27%) sepia(85%) saturate(1200%) hue-rotate(160deg) brightness(0.7) contrast(1.2)'
                  }}
                />
              </div>
              <div className="flex space-x-4">
                <a
                  href="https://www.instagram.com/diazdeluca.ok?igsh=MTEwcXIxejdhNWQ2ag%3D%3D"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-800 p-3 rounded-full text-gray-300 hover:bg-[#128498] hover:text-white transition-all"
                >
                  <Instagram className="h-5 w-5" />
                </a>
                <a
                  href="https://www.facebook.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-800 p-3 rounded-full text-gray-300 hover:bg-[#128498] hover:text-white transition-all"
                >
                  <Facebook className="h-5 w-5" />
                </a>
                <a
                  href="https://wa.me/+5491151101658"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-800 p-3 rounded-full text-gray-300 hover:bg-green-500 hover:text-white transition-all"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                  </svg>
                </a>
                <a
                  href="https://www.tiktok.com/@diazdeluca7"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-800 p-3 rounded-full text-gray-300 hover:bg-[#128498] hover:text-white transition-all"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
                  </svg>
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-serif text-lg font-semibold mb-4 text-white">Enlaces Rápidos</h4>
              <ul className="space-y-3 text-gray-300">
                <li>
                  <a href="#inicio" className="hover:text-[#128498] transition-colors flex items-center gap-2">
                    <ChevronDown className="h-4 w-4 -rotate-90" />
                    Inicio
                  </a>
                </li>
                <li>
                  <a href="#catalogo" className="hover:text-[#128498] transition-colors flex items-center gap-2">
                    <ChevronDown className="h-4 w-4 -rotate-90" />
                    Catálogo
                  </a>
                </li>
                <li>
                  <a href="#faq" className="hover:text-[#128498] transition-colors flex items-center gap-2">
                    <ChevronDown className="h-4 w-4 -rotate-90" />
                    Preguntas Frecuentes
                  </a>
                </li>
                <li>
                  <a href="#contacto" className="hover:text-[#128498] transition-colors flex items-center gap-2">
                    <ChevronDown className="h-4 w-4 -rotate-90" />
                    Contacto
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-serif text-lg font-semibold mb-4 text-white">Información</h4>
              <ul className="space-y-3 text-gray-300">
                <li>
                  <a href="#" className="hover:text-[#128498] transition-colors flex items-center gap-2">
                    <ChevronDown className="h-4 w-4 -rotate-90" />
                    Términos y Condiciones
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#128498] transition-colors flex items-center gap-2">
                    <ChevronDown className="h-4 w-4 -rotate-90" />
                    Política de Privacidad
                  </a>
                </li>
                <li>
                  <a href="#faq" className="hover:text-[#128498] transition-colors flex items-center gap-2">
                    <ChevronDown className="h-4 w-4 -rotate-90" />
                    Preguntas Frecuentes
                  </a>
                </li>
                <li>
                  <a href="https://wa.me/+5491151101658" className="hover:text-[#128498] transition-colors flex items-center gap-2">
                    <ChevronDown className="h-4 w-4 -rotate-90" />
                    Soporte WhatsApp
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-400 text-sm">
                &copy; 2025 Díaz & De Luca. Todos los derechos reservados.
              </p>
              <p className="text-gray-400 text-sm">
                Desarrollado con ❤️ por <span className="text-[#128498] font-semibold">Ecomsolver</span>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
