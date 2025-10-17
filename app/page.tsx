"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mail, Phone, MapPin, Instagram, Facebook, Heart, Star, Menu } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

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

  const availableTimeSlots = ["10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00"]

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Aquí se integraría con el ERP externo
    console.log("Datos del formulario:", formData)
    alert("¡Solicitud de cita enviada! Te contactaremos pronto.")
    setFormData({ name: "", phone: "", email: "", dni: "", date: undefined, time: "" })
  }

  const dresses = [
    {
      id: 1,
      name: "Vestido Celestial",
      description: "Elegante vestido largo con bordados dorados y escote en V",
      image: "/golden-embroidered-gown.png",
      category: "Largos",
    },
    {
      id: 2,
      name: "Vestido Aurora",
      description: "Vestido de gala con falda amplia y detalles de pedrería",
      image: "/sequined-ball-gown.png",
      category: "Largos",
    },
    {
      id: 3,
      name: "Vestido Serenidad",
      description: "Diseño minimalista con corte sirena y tela satinada",
      image: "/minimalist-mermaid-dress.png",
      category: "Largos",
    },
    {
      id: 4,
      name: "Vestido Majestuoso",
      description: "Vestido de noche con mangas de encaje y cola desmontable",
      image: "/majestic-lace-dress.png",
      category: "Largos",
    },
    {
      id: 5,
      name: "Vestido Radiante",
      description: "Vestido corto con lentejuelas y escote halter",
      image: "/sequined-halter-dress.png",
      category: "Cortos",
    },
    {
      id: 6,
      name: "Vestido Encanto",
      description: "Vestido midi con flores bordadas y cintura marcada",
      image: "/embroidered-floral-midi-dress.png",
      category: "Cortos",
    },
  ]

  const shoes = [
    {
      id: 1,
      name: "Stilettos Dorados",
      description: "Elegantes tacones altos dorados, perfectos para eventos especiales",
      image: "/elegant-heels-gold.jpg",
      category: "Zapatos",
    },
    {
      id: 2,
      name: "Pumps Clásicos",
      description: "Zapatos nude de tacón alto, ideales para cualquier vestido",
      image: "/classic-pumps-nude.png",
      category: "Zapatos",
    },
    {
      id: 3,
      name: "Sandalias Plateadas",
      description: "Sandalias con tiras plateadas, elegantes y cómodas",
      image: "/strappy-sandals-silver.jpg",
      category: "Zapatos",
    },
    {
      id: 4,
      name: "Tacones Negros",
      description: "Zapatos negros de punta, clásicos y sofisticados",
      image: "/pointed-toe-heels-black.png",
      category: "Zapatos",
    },
  ]

  const allProducts = [...dresses, ...shoes]
  const filteredProducts =
    selectedCategory === "Todos" ? allProducts : allProducts.filter((product) => product.category === selectedCategory)

  const longDresses = filteredProducts.filter((product) => product.category === "Largos")
  const shortDresses = filteredProducts.filter((product) => product.category === "Cortos")
  const shoesProducts = filteredProducts.filter((product) => product.category === "Zapatos")

  const AppointmentForm = ({ itemName }: { itemName?: string }) => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Nombre y Apellido</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>
      <div>
        <Label htmlFor="phone">Teléfono</Label>
        <Input
          id="phone"
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          required
        />
      </div>
      <div>
        <Label htmlFor="email">Mail</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
      </div>
      <div>
        <Label htmlFor="dni">DNI</Label>
        <Input
          id="dni"
          value={formData.dni}
          onChange={(e) => setFormData({ ...formData, dni: e.target.value })}
          required
        />
      </div>
      <div>
        <Label>Fecha de la Cita</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
              <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 11a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm6 0a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm6 0a2 2 0 1 1 0-4 2 2 0 0 1 0 4z" />
              </svg>
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
      </div>
      <div>
        <Label htmlFor="time">Horario Disponible</Label>
        <select
          id="time"
          value={formData.time}
          onChange={(e) => setFormData({ ...formData, time: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-600"
          required
        >
          <option value="">Selecciona un horario</option>
          {availableTimeSlots.map((slot) => (
            <option key={slot} value={slot}>
              {slot}
            </option>
          ))}
        </select>
      </div>
      <Button type="submit" className="w-full bg-[#128498] hover:bg-[#0f6a7a] text-white">
        {itemName ? `Reservar ${itemName}` : "Enviar Solicitud"}
      </Button>
    </form>
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
                Díaz <span className="text-[#128498]">&</span> <span className="text-[#128498]">De Luca</span>
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
      <section id="inicio" className="relative bg-gradient-to-br from-[#B4D8D8] to-[#E0D7CE] py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <h2 className="font-serif text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                Tu
                <span className="italic block">look</span>
                <span className="text-[#128498] block">ideal</span>
              </h2>
              <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
                Descubre nuestra exclusiva colección de vestidos de fiesta para alquiler. Elegancia, sofisticación y
                estilo para cada ocasión especial.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="lg" className="bg-[#128498] hover:bg-[#0f6a7a] text-white px-8 py-3 text-lg">
                      <svg className="mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 11a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm6 0a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm6 0a2 2 0 1 1 0-4 2 2 0 0 1 0 4z" />
                      </svg>
                      Reservar Cita
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle className="font-serif text-2xl text-center">Reserva tu Cita</DialogTitle>
                    </DialogHeader>
                    <AppointmentForm />
                  </DialogContent>
                </Dialog>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-[#128498] text-[#128498] hover:bg-[#128498]/10 px-8 py-3 text-lg bg-transparent"
                >
                  Ver Catálogo
                </Button>
              </div>
            </div>
            <div className="relative">
              <img
                src="/elegant-woman-evening-dress.png"
                alt="Mujer elegante en vestido de fiesta"
                className="w-full h-auto rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-lg">
                <div className="flex items-center space-x-2">
                  <Star className="h-5 w-5 text-yellow-500 fill-current" />
                  <span className="font-semibold">4.9/5</span>
                  <span className="text-gray-500">+200 clientas felices</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#128498] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="font-serif text-2xl md:text-3xl text-white mb-2">¿Tienes una fiesta?</h3>
          <p className="text-xl text-white/90 italic">¿Querés estar divina?</p>
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
                className={`px-6 py-2 rounded-full font-medium transition-colors ${
                  selectedCategory === category
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
                        className="group hover:shadow-xl transition-all duration-300 overflow-hidden"
                      >
                        <div className="relative overflow-hidden">
                          <img
                            src={dress.image || "/placeholder.svg"}
                            alt={dress.name}
                            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                            <Heart className="h-5 w-5 text-gray-600 hover:text-red-500 cursor-pointer" />
                          </div>
                        </div>
                        <CardContent className="p-4">
                          <h4 className="font-serif text-lg font-semibold text-gray-900 mb-1">{dress.name}</h4>
                          <p className="text-gray-600 text-sm mb-3">{dress.description}</p>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="w-full border-[#128498] text-[#128498] hover:bg-[#128498]/10 bg-transparent"
                              >
                                Reservar
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md">
                              <DialogHeader>
                                <DialogTitle className="font-serif text-2xl text-center">
                                  Reservar {dress.name}
                                </DialogTitle>
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
                        className="group hover:shadow-xl transition-all duration-300 overflow-hidden"
                      >
                        <div className="relative overflow-hidden">
                          <img
                            src={dress.image || "/placeholder.svg"}
                            alt={dress.name}
                            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                            <Heart className="h-5 w-5 text-gray-600 hover:text-red-500 cursor-pointer" />
                          </div>
                        </div>
                        <CardContent className="p-4">
                          <h4 className="font-serif text-lg font-semibold text-gray-900 mb-1">{dress.name}</h4>
                          <p className="text-gray-600 text-sm mb-3">{dress.description}</p>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="w-full border-[#128498] text-[#128498] hover:bg-[#128498]/10 bg-transparent"
                              >
                                Reservar
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md">
                              <DialogHeader>
                                <DialogTitle className="font-serif text-2xl text-center">
                                  Reservar {dress.name}
                                </DialogTitle>
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
                      <Card key={shoe.id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
                        <div className="relative overflow-hidden">
                          <img
                            src={shoe.image || "/placeholder.svg"}
                            alt={shoe.name}
                            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                            <Heart className="h-5 w-5 text-gray-600 hover:text-red-500 cursor-pointer" />
                          </div>
                        </div>
                        <CardContent className="p-4">
                          <h4 className="font-serif text-lg font-semibold text-gray-900 mb-1">{shoe.name}</h4>
                          <p className="text-gray-600 text-sm mb-3">{shoe.description}</p>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="w-full border-[#128498] text-[#128498] hover:bg-[#128498]/10 bg-transparent"
                              >
                                Reservar
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md">
                              <DialogHeader>
                                <DialogTitle className="font-serif text-2xl text-center">
                                  Reservar {shoe.name}
                                </DialogTitle>
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

      <section id="faq" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-5xl font-bold text-gray-900 mb-4">Preguntas Frecuentes</h2>
            <p className="text-lg text-gray-600">Todo lo que necesitas saber sobre nuestro servicio</p>
          </div>

          <div className="space-y-8">
            <Card className="p-6">
              <h3 className="font-serif text-xl font-semibold text-gray-900 mb-3">
                ¿Puedo ir a probarme los vestidos?
              </h3>
              <p className="text-gray-600">
                Sí, siempre con cita previa y un acompañante por persona. Podés agendarla en el calendario o
                contactándote por WhatsApp. La cita dura 1 hora aprox. y pedimos puntualidad para no perjudicar a las
                demás.
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="font-serif text-xl font-semibold text-gray-900 mb-3">¿Cuánto dura el alquiler?</h3>
              <p className="text-gray-600">
                Retirás el vestido 2 días antes de tu evento y lo devolvés entre 2 a 3 días posteriores.
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="font-serif text-xl font-semibold text-gray-900 mb-3">
                ¿Qué pasa si lo retiro o devuelvo tarde?
              </h3>
              <p className="text-gray-600">
                Podés retirar hasta el mismo día del evento. La devolución debe hacerse en la fecha pactada, para no
                afectar reservas siguientes.
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="font-serif text-xl font-semibold text-gray-900 mb-3">
                ¿Con cuánta anticipación puedo reservar el vestido?
              </h3>
              <p className="text-gray-600">Podés reservar cuando quieras, no hay un mínimo de anticipación.</p>
            </Card>

            <Card className="p-6">
              <h3 className="font-serif text-xl font-semibold text-gray-900 mb-3">Cancelaciones</h3>
              <p className="text-gray-600">
                (Texto a mejorar luego: aclarar que el saldo queda a favor del cliente para usar cuando desee).
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="font-serif text-xl font-semibold text-gray-900 mb-3">
                ¿Se le pueden hacer arreglos al vestido?
              </h3>
              <p className="text-gray-600">
                Sí, siempre que no dañe la confección. Solo ruedos y pinzas, con costo adicional.
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="font-serif text-xl font-semibold text-gray-900 mb-3">Tintorería</h3>
              <p className="text-gray-600">Nosotras nos encargamos.</p>
            </Card>

            <Card className="p-6">
              <h3 className="font-serif text-xl font-semibold text-gray-900 mb-3">¿Hacen envíos?</h3>
              <p className="text-gray-600">Sí, a cargo del cliente.</p>
            </Card>

            <Card className="p-6">
              <h3 className="font-serif text-xl font-semibold text-gray-900 mb-3">
                ¿Puedo comprar el vestido que alquilé?
              </h3>
              <p className="text-gray-600">Sí, siempre que no tenga reservas posteriores.</p>
            </Card>

            <Card className="p-6">
              <h3 className="font-serif text-xl font-semibold text-gray-900 mb-3">¿Cómo llegar?</h3>
              <p className="text-gray-600">(Pendiente, lo agregamos cuando tengamos el dto.)</p>
            </Card>

            <Card className="p-6 bg-[#B4D8D8] border-[#128498]">
              <h3 className="font-serif text-xl font-semibold text-[#128498] mb-3">¡Te esperamos!</h3>
              <p className="text-gray-700">Estamos aquí para hacer de tu evento algo inolvidable.</p>
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

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <h3 className="font-serif text-2xl font-bold mb-4">
                Díaz <span className="text-[#128498]">&</span> <span className="text-[#128498]">De Luca</span>
              </h3>
              <p className="text-gray-300 mb-6 max-w-md">
                Más de 10 años creando momentos inolvidables. Tu elegancia es nuestra pasión.
              </p>
              <div className="flex space-x-4">
                <a href="https://www.instagram.com/" className="text-gray-300 hover:text-[#128498] transition-colors">
                  <Instagram className="h-6 w-6" />
                </a>
                <a href="https://www.facebook.com/" className="text-gray-300 hover:text-[#128498] transition-colors">
                  <Facebook className="h-6 w-6" />
                </a>
                <a href="https://www.tiktok.com/" className="text-gray-300 hover:text-[#128498] transition-colors">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.321 7.5a5.5 5.5 0 0 1-1.5-3.5V3h-3v11a4 4 0 1 1-4-4V7a7 7 0 1 1 7 7h-3a4 4 0 0 1-4-4V3a4 4 0 0 1 4-4 4 4 0 0 1 4 4v4.5z"/>
                  </svg>
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Enlaces Rápidos</h4>
              <ul className="space-y-2 text-gray-300">
                <li>
                  <a href="#inicio" className="hover:text-[#128498] transition-colors">
                    Inicio
                  </a>
                </li>
                <li>
                  <a href="#catalogo" className="hover:text-[#128498] transition-colors">
                    Catálogo
                  </a>
                </li>
                <li>
                  <a href="#faq" className="hover:text-[#128498] transition-colors">
                    FAQ
                  </a>
                </li>
                <li>
                  <a href="#contacto" className="hover:text-[#128498] transition-colors">
                    Contacto
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Información</h4>
              <ul className="space-y-2 text-gray-300">
                <li>
                  <a href="#" className="hover:text-[#128498] transition-colors">
                    Términos y Condiciones
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#128498] transition-colors">
                    Política de Privacidad
                  </a>
                </li>
                <li>
                  <a href="#faq" className="hover:text-[#128498] transition-colors">
                    Preguntas Frecuentes
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Díaz & De Luca. Todos los derechos reservados. Desarrollado por Ecomsolver.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
