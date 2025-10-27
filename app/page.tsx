"use client"

import type React from "react"

import { useState } from "react"
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

  const availableTimeSlots = ["10:00","10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30"]

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Aquí se integraría con el ERP externo
    console.log("Datos del formulario:", formData)
    alert("¡Solicitud de cita enviada! Te contactaremos pronto.")
    setFormData({ name: "", phone: "", email: "", dni: "", date: undefined, time: "" })
    setFormStep(1)
  }

  const dresses = [
    {
      id: 1,
      name: "Vestido Celestial",
      description: "Elegante vestido largo con bordados dorados y escote en V",
      image: "/golden-embroidered-gown.png",
      category: "Largos",
      badges: ["Más Popular", "Disponible"],
      rating: 4.9,
    },
    {
      id: 2,
      name: "Vestido Aurora",
      description: "Vestido de gala con falda amplia y detalles de pedrería",
      image: "/sequined-ball-gown.png",
      category: "Largos",
      badges: ["Nuevo", "Disponible"],
      rating: 5.0,
    },
    {
      id: 3,
      name: "Vestido Serenidad",
      description: "Diseño minimalista con corte sirena y tela satinada",
      image: "/minimalist-mermaid-dress.png",
      category: "Largos",
      badges: ["Disponible"],
      rating: 4.8,
    },
    {
      id: 4,
      name: "Vestido Majestuoso",
      description: "Vestido de noche con mangas de encaje y cola desmontable",
      image: "/majestic-lace-dress.png",
      category: "Largos",
      badges: ["Reservado"],
      rating: 4.7,
    },
    {
      id: 5,
      name: "Vestido Radiante",
      description: "Vestido corto con lentejuelas y escote halter",
      image: "/sequined-halter-dress.png",
      category: "Cortos",
      badges: ["Más Popular", "Disponible"],
      rating: 4.9,
    },
    {
      id: 6,
      name: "Vestido Encanto",
      description: "Vestido midi con flores bordadas y cintura marcada",
      image: "/embroidered-floral-midi-dress.png",
      category: "Cortos",
      badges: ["Disponible"],
      rating: 4.6,
    },
  ]

  const shoes = [
    {
      id: 7,
      name: "Stilettos Dorados",
      description: "Elegantes tacones altos dorados, perfectos para eventos especiales",
      image: "/elegant-heels-gold.jpg",
      category: "Zapatos",
      badges: ["Disponible"],
      rating: 4.8,
    },
    {
      id: 8,
      name: "Pumps Clásicos",
      description: "Zapatos nude de tacón alto, ideales para cualquier vestido",
      image: "/classic-pumps-nude.png",
      category: "Zapatos",
      badges: ["Más Popular", "Disponible"],
      rating: 5.0,
    },
    {
      id: 9,
      name: "Sandalias Plateadas",
      description: "Sandalias con tiras plateadas, elegantes y cómodas",
      image: "/strappy-sandals-silver.jpg",
      category: "Zapatos",
      badges: ["Disponible"],
      rating: 4.7,
    },
    {
      id: 10,
      name: "Tacones Negros",
      description: "Zapatos negros de punta, clásicos y sofisticados",
      image: "/pointed-toe-heels-black.png",
      category: "Zapatos",
      badges: ["Disponible"],
      rating: 4.9,
    },
  ]

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

  const allProducts = [...dresses, ...shoes]
  const filteredProducts =
    selectedCategory === "Todos" ? allProducts : allProducts.filter((product) => product.category === selectedCategory)

  const longDresses = filteredProducts.filter((product) => product.category === "Largos")
  const shortDresses = filteredProducts.filter((product) => product.category === "Cortos")
  const shoesProducts = filteredProducts.filter((product) => product.category === "Zapatos")

  const AppointmentForm = ({ itemName }: { itemName?: string }) => (
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
              <Popover>
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
                    onSelect={(date) => setFormData({ ...formData, date })}
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#128498]"
                required
              >
                <option value="">Selecciona un horario</option>
                {availableTimeSlots.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot} hs
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="dni">DNI (opcional)</Label>
              <Input
                id="dni"
                value={formData.dni}
                onChange={(e) => setFormData({ ...formData, dni: e.target.value })}
                placeholder="12345678"
              />
              <p className="text-xs text-gray-500 mt-1">Solo necesario para la reserva final</p>
            </div>
            <div className="flex gap-2">
              <Button 
                type="button" 
                variant="outline"
                onClick={() => setFormStep(1)}
                className="flex-1"
              >
                <ChevronUp className="mr-2 h-4 w-4" /> Volver
              </Button>
              <Button type="submit" className="flex-1 bg-[#128498] hover:bg-[#0f6a7a] text-white">
                <Check className="mr-2 h-4 w-4" />
                Confirmar Cita
              </Button>
            </div>
          </>
        )}
      </form>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#F9F7F5]">
      <div className="fixed bottom-6 right-6 z-50">
        <a
          href="https://wa.me/1234567890"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-green-500 hover:bg-green-600 text-white w-14 h-14 rounded-full shadow-lg transition-all duration-300 hover:scale-110 flex items-center justify-center"
        >
          <svg className="h-7 w-7" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
          </svg>
        </a>
      </div>

      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <img src="/diaz-deluca-logo.jpg" alt="Díaz & De Luca Logo" className="h-16 w-16 object-contain" />
              <h1 className="font-serif text-2xl md:text-3xl font-bold text-gray-900">
                <span className="text-[#128498]">Díaz &</span> <span className="text-[#128498]">De Luca</span>
              </h1>
            </div>

            <nav className="hidden md:flex space-x-8">
              <a href="#inicio" className="text-gray-700 hover:text-[#128498] transition-colors">
                Inicio
              </a>
              <a href="#catalogo" className="text-gray-700 hover:text-[#128498] transition-colors">
                Catálogo
              </a>
              <a href="#faq" className="text-gray-700 hover:text-[#128498] transition-colors">
                FAQ
              </a>
              <a href="#contacto" className="text-gray-700 hover:text-[#128498] transition-colors">
                Contacto
              </a>
            </nav>

            <div className="flex items-center space-x-4">
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-[#128498] hover:bg-[#0f6a7a] text-white">
                    <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 11a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm6 0a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm6 0a2 2 0 1 1 0-4 2 2 0 0 1 0 4z" />
                    </svg>
                    Agendar Cita
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle className="font-serif text-2xl text-center">Reserva tu Cita</DialogTitle>
                  </DialogHeader>
                  <AppointmentForm />
                </DialogContent>
              </Dialog>

              <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                <Menu className="h-6 w-6 text-gray-700" />
              </button>
            </div>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200 py-4">
              <nav className="flex flex-col space-y-4">
                <a href="#inicio" className="text-gray-700 hover:text-[#128498] transition-colors">
                  Inicio
                </a>
                <a href="#catalogo" className="text-gray-700 hover:text-[#128498] transition-colors">
                  Catálogo
                </a>
                <a href="#faq" className="text-gray-700 hover:text-[#128498] transition-colors">
                  FAQ
                </a>
                <a href="#contacto" className="text-gray-700 hover:text-[#128498] transition-colors">
                  Contacto
                </a>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section id="inicio" className="relative bg-gradient-to-br from-[#B4D8D8] via-[#E0D7CE] to-[#F9F7F5] py-24 md:py-36 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#128498]/5 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#A1D0B2]/5 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left space-y-8">
              <div className="inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm">
                <Sparkles className="h-4 w-4 text-[#128498] mr-2" />
                <span className="text-sm font-medium text-gray-700">Más de 10 años creando momentos especiales</span>
              </div>
              
              <h2 className="font-serif text-5xl md:text-7xl font-bold text-gray-900 leading-tight">
                Vestidos que 
                <span className="italic block text-gray-700">cuentan</span>
                <span className="text-[#128498] block">historias</span>
              </h2>
              
              <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-xl">
                Descubre nuestra exclusiva colección de vestidos y complementos. Tu elegancia comienza aquí.
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
                      <DialogTitle className="font-serif text-2xl text-center">Reserva tu Cita</DialogTitle>
                      <DialogDescription className="text-center text-gray-600">
                        Agenda tu visita para probarte los vestidos que más te gusten
                      </DialogDescription>
                    </DialogHeader>
                    <AppointmentForm />
                  </DialogContent>
                </Dialog>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' })}
                  className="border-2 border-[#128498] text-[#128498] hover:bg-[#128498]/10 px-8 py-4 text-lg bg-white/80 backdrop-blur-sm"
                >
                  Ver Catálogo
                </Button>
              </div>
              
              {/* Trust indicators */}
              <div className="flex flex-wrap gap-6 justify-center lg:justify-start pt-4">
                <div className="flex items-center gap-2">
                  <div className="bg-white p-2 rounded-lg shadow-sm">
                    <Check className="h-5 w-5 text-green-600" />
                  </div>
                  <span className="text-sm text-gray-600">Calidad Premium</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="bg-white p-2 rounded-lg shadow-sm">
                    <Shield className="h-5 w-5 text-[#128498]" />
                  </div>
                  <span className="text-sm text-gray-600">Servicio Confiable</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="bg-white p-2 rounded-lg shadow-sm">
                    <Clock className="h-5 w-5 text-[#A1D0B2]" />
                  </div>
                  <span className="text-sm text-gray-600">Reserva Flexible</span>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="relative z-10">
                <img
                  src="/elegant-woman-evening-dress.png"
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
          <h3 className="font-serif text-3xl md:text-4xl text-white mb-2">¿Tienes una fiesta?</h3>
          <p className="text-xl md:text-2xl text-white/90 italic">¿Querés estar divina?</p>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-[#128498] to-[#0f6a7a] rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Package className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-serif text-xl font-semibold text-gray-900 mb-2">Amplia Colección</h3>
              <p className="text-gray-600">Vestidos y complementos para cada ocasión especial</p>
            </div>
            
            <div className="text-center group">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-[#A1D0B2] to-[#8cb899] rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Truck className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-serif text-xl font-semibold text-gray-900 mb-2">Envíos Disponibles</h3>
              <p className="text-gray-600">Recibí tu vestido donde estés</p>
            </div>
            
            <div className="text-center group">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-[#AB9072] to-[#967a5f] rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-serif text-xl font-semibold text-gray-900 mb-2">Arreglos Express</h3>
              <p className="text-gray-600">Ajustes profesionales disponibles</p>
            </div>
            
            <div className="text-center group">
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
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-5xl font-bold text-gray-900 mb-4">Nuestra Colección</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Cada vestido ha sido cuidadosamente seleccionado para garantizar que te sientas radiante y segura en tu
              día especial.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {["Todos", "Largos", "Cortos", "Abrigos", "Zapatos", "Accesorios", "Otros"].map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full font-medium transition-colors ${selectedCategory === category
                  ? /* Updated active category button to new teal */ "bg-[#128498] text-white"
                  : "bg-white text-gray-700 hover:bg-[#B4D8D8] border border-gray-200"
                  }`}
              >
                {category}
              </button>
            ))}
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
                          {/* Badges */}
                          <div className="absolute top-3 left-3 flex flex-col gap-2">
                            {dress.badges.map((badge, idx) => (
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
                          <Dialog>
                            {/* <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="w-full border-2 border-[#128498] text-[#128498] hover:bg-[#128498] hover:text-white bg-transparent transition-all"
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                Agendar Prueba
                              </Button>
                            </DialogTrigger> */}
                            <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle className="font-serif text-2xl text-center">
                                  Reservar {dress.name}
                                </DialogTitle>
                                <DialogDescription className="text-center text-gray-600">
                                  Agenda tu cita para probarte este hermoso vestido
                                </DialogDescription>
                              </DialogHeader>
                              <AppointmentForm itemName={dress.name} />
                            </DialogContent>
                          </Dialog>
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
                          {/* Badges */}
                          <div className="absolute top-3 left-3 flex flex-col gap-2">
                            {dress.badges.map((badge, idx) => (
                              <Badge 
                                key={idx}
                                className={`${
                                  badge === "Más Popular" ? "bg-[#AB9072] hover:bg-[#967a5f]" :
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
                          <Dialog>
                            {/* <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="w-full border-2 border-[#AB9072] text-[#AB9072] hover:bg-[#AB9072] hover:text-white bg-transparent transition-all"
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                Agendar Prueba
                              </Button>
                            </DialogTrigger> */}
                            <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle className="font-serif text-2xl text-center">
                                  Reservar {dress.name}
                                </DialogTitle>
                                <DialogDescription className="text-center text-gray-600">
                                  Agenda tu cita para probarte este hermoso vestido
                                </DialogDescription>
                              </DialogHeader>
                              <AppointmentForm itemName={dress.name} />
                            </DialogContent>
                          </Dialog>
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
                          {/* Badges */}
                          <div className="absolute top-3 left-3 flex flex-col gap-2">
                            {shoe.badges.map((badge, idx) => (
                              <Badge 
                                key={idx}
                                className={`${
                                  badge === "Más Popular" ? "bg-[#A1D0B2] hover:bg-[#8cb899] text-gray-900" :
                                  badge === "Nuevo" ? "bg-[#128498] hover:bg-[#0f6a7a]" :
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
                          <Dialog>
                            {/* <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="w-full border-2 border-[#A1D0B2] text-[#A1D0B2] hover:bg-[#A1D0B2] hover:text-white bg-transparent transition-all"
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                Agendar Prueba
                              </Button>
                            </DialogTrigger> */}
                            <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle className="font-serif text-2xl text-center">
                                  Reservar {shoe.name}
                                </DialogTitle>
                                <DialogDescription className="text-center text-gray-600">
                                  Agenda tu cita para probarte estos hermosos zapatos
                                </DialogDescription>
                              </DialogHeader>
                              <AppointmentForm itemName={shoe.name} />
                            </DialogContent>
                          </Dialog>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedCategory !== "Todos" &&
            selectedCategory !== "Largos" &&
            selectedCategory !== "Cortos" &&
            selectedCategory !== "Zapatos" && (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">Próximamente tendremos productos en esta categoría.</p>
              </div>
            )}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-5xl font-bold text-gray-900 mb-4">¿Cómo Funciona?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Alquilar tu vestido perfecto es más fácil de lo que imaginas
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="relative">
              <div className="text-center">
                <div className="mx-auto w-20 h-20 bg-gradient-to-br from-[#128498] to-[#0f6a7a] rounded-full flex items-center justify-center mb-6 relative">
                  <CalendarIcon className="h-10 w-10 text-white" />
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-[#A1D0B2] rounded-full flex items-center justify-center text-gray-900 font-bold text-sm">1</div>
                </div>
                <h3 className="font-serif text-xl font-semibold text-gray-900 mb-3">Agenda tu Cita</h3>
                <p className="text-gray-600">Reserva tu visita online o por WhatsApp. Elegí día y horario.</p>
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
                <p className="text-gray-600">Vení con un acompañante y probate todos los que quieras.</p>
              </div>
              <div className="hidden md:block absolute top-10 -right-4 w-8 h-0.5 bg-[#B4D8D8]"></div>
            </div>

            <div className="relative">
              <div className="text-center">
                <div className="mx-auto w-20 h-20 bg-gradient-to-br from-[#AB9072] to-[#967a5f] rounded-full flex items-center justify-center mb-6 relative">
                  <Check className="h-10 w-10 text-white" />
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-[#A1D0B2] rounded-full flex items-center justify-center text-gray-900 font-bold text-sm">3</div>
                </div>
                <h3 className="font-serif text-xl font-semibold text-gray-900 mb-3">Elegí y Reservá</h3>
                <p className="text-gray-600">Seleccioná tu favorito y dejá una seña para reservarlo.</p>
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
                  <DialogTitle className="font-serif text-2xl text-center">Reserva tu Cita</DialogTitle>
                  <DialogDescription className="text-center text-gray-600">
                    Agenda tu visita para probarte los vestidos que más te gusten
                  </DialogDescription>
                </DialogHeader>
                <AppointmentForm />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-br from-[#B4D8D8]/20 to-[#E0D7CE]/20">
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
      </section>

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
                a: "Sí, podés comprarlo siempre que no tenga reservas posteriores. Consultanos disponibilidad."
              }
            ].map((faq, index) => (
              <Card 
                key={index}
                className={`overflow-hidden transition-all duration-300 ${
                  expandedFaq === index ? 'border-2 border-[#128498] shadow-lg' : 'border-2 border-transparent hover:border-gray-200'
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
                  className={`overflow-hidden transition-all duration-300 ${
                    expandedFaq === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
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
            <h2 className="font-serif text-3xl md:text-5xl font-bold text-gray-900 mb-4">Contáctanos</h2>
            <p className="text-lg text-gray-600">Estamos aquí para hacer realidad el vestido de tus sueños</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center p-8">
              <MapPin className="h-12 w-12 text-[#128498] mx-auto mb-4" />
              <h3 className="font-serif text-xl font-semibold mb-2">Ubicación</h3>
              <p className="text-gray-600">
                Av. Elegancia 123
                <br />
                Centro, Ciudad
                <br />
                CP 12345
              </p>
            </Card>

            <Card className="text-center p-8">
              <Phone className="h-12 w-12 text-[#128498] mx-auto mb-4" />
              <h3 className="font-serif text-xl font-semibold mb-2">Teléfono</h3>
              <p className="text-gray-600">
                +1 (555) 123-4567
                <br />
                Lun - Sáb: 10:00 - 19:00
                <br />
                Dom: 12:00 - 17:00
              </p>
            </Card>

            <Card className="text-center p-8">
              <Mail className="h-12 w-12 text-[#128498] mx-auto mb-4" />
              <h3 className="font-serif text-xl font-semibold mb-2">Email</h3>
              <p className="text-gray-600">
                info@diazdeluca.com
                <br />
                reservas@diazdeluca.com
                <br />
                Respuesta en 24h
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
            Suscribite a nuestro newsletter y enterate de nuevos vestidos y promociones especiales
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
              <div className="flex items-center gap-3 mb-4">
                <img src="/diaz-deluca-logo.jpg" alt="Logo" className="h-12 w-12 rounded-lg" />
                <h3 className="font-serif text-2xl font-bold">
                  Díaz <span className="text-[#128498]">&</span> De Luca
                </h3>
              </div>
              <p className="text-gray-300 mb-6 max-w-md leading-relaxed">
                Más de 10 años creando momentos inolvidables. Tu elegancia es nuestra pasión. Vestidos de alta calidad para cada ocasión especial.
              </p>
              <div className="flex space-x-4">
                <a 
                  href="https://www.instagram.com/" 
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
                  href="https://wa.me/1234567890" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-800 p-3 rounded-full text-gray-300 hover:bg-green-500 hover:text-white transition-all"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
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
                    FAQ
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
                  <a href="https://wa.me/1234567890" className="hover:text-[#128498] transition-colors flex items-center gap-2">
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
