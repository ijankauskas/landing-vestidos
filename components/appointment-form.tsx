"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Check, ChevronDown, ChevronUp, Calendar as CalendarIcon } from "lucide-react"
import { crearLeadPublico, separarNombreCompleto, formatearFechaAPI } from "@/lib/api"

export interface AppointmentFormData {
  name: string
  phone: string
  email: string
  dni: string
  date: Date | undefined
  time: string
}

interface AppointmentFormProps {
  itemName?: string
  onSubmitSuccess?: () => void
}

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

export function AppointmentForm({ itemName, onSubmitSuccess }: AppointmentFormProps) {
  const [formData, setFormData] = useState<AppointmentFormData>({
    name: "",
    phone: "",
    email: "",
    dni: "",
    date: undefined,
    time: "",
  })
  const [formStep, setFormStep] = useState(1)
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [submittingForm, setSubmittingForm] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const availableTimeSlots = getAvailableTimeSlots(formData.date)

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
        
        // Llamar callback de éxito si existe
        if (onSubmitSuccess) {
          onSubmitSuccess()
        }
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
                    disabled={(date) => {
                      // Crear fecha de hoy a medianoche para comparar solo fechas
                      const today = new Date()
                      today.setHours(0, 0, 0, 0)
                      const dateToCompare = new Date(date)
                      dateToCompare.setHours(0, 0, 0, 0)
                      // Deshabilitar fechas pasadas (antes de hoy) y domingos
                      return dateToCompare < today || date.getDay() === 0
                    }}
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

