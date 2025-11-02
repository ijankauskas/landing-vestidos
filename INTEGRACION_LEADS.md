# 📝 Integración de Leads y Reservas de Citas

El formulario de reserva de citas ahora está completamente integrado con el backend para crear leads automáticamente.

---

## 🎯 **Funcionalidad Implementada**

### **¿Qué hace?**

Cuando un usuario completa el formulario de reserva:

1. ✅ Captura todos los datos del formulario
2. ✅ Separa nombre y apellido automáticamente
3. ✅ Formatea la fecha al formato requerido (YYYY-MM-DD)
4. ✅ Envía los datos al endpoint `/lead/public`
5. ✅ Muestra estado de carga mientras envía
6. ✅ Notifica éxito o error al usuario
7. ✅ Limpia el formulario después de enviar

---

## 📊 **Flujo de Datos**

```
Usuario completa formulario
         ↓
handleSubmit (page.tsx)
         ↓
separarNombreCompleto()  → "María González" → { nombre: "María", apellido: "González" }
formatearFechaAPI()      → Date(2025-03-15) → "2025-03-15"
         ↓
crearLeadPublico() (lib/api.ts)
         ↓
POST /lead/public
         ↓
Backend guarda lead + crea cita
         ↓
Respuesta al usuario
```

---

## 🔧 **Funciones en `lib/api.ts`**

### **1. `crearLeadPublico(leadData)`**

Envía los datos del lead al backend.

```typescript
const response = await crearLeadPublico({
  nombre: "María",
  apellido: "González",
  email: "maria@example.com",
  telefono: "+54 9 11 1234-5678",
  dni: "12345678",
  crearCita: true,
  fecha: "2025-03-15",
  horario: "15:00"
})
```

**Respuesta:**
```typescript
{
  success: boolean
  message: string
  data?: any
}
```

### **2. `separarNombreCompleto(nombreCompleto)`**

Divide el nombre completo en nombre y apellido.

```typescript
separarNombreCompleto("María González") 
// → { nombre: "María", apellido: "González" }

separarNombreCompleto("Juan Pablo García López")
// → { nombre: "Juan", apellido: "Pablo García López" }

separarNombreCompleto("Ana")
// → { nombre: "Ana", apellido: undefined }
```

### **3. `formatearFechaAPI(fecha)`**

Convierte un objeto Date a string YYYY-MM-DD.

```typescript
formatearFechaAPI(new Date(2025, 2, 15))  // → "2025-03-15"
formatearFechaAPI(new Date(2025, 11, 5))  // → "2025-12-05"
```

---

## 📝 **Estructura del DTO**

### **CreateLeadPublicDto**

```typescript
{
  nombre: string           // REQUERIDO
  apellido?: string        // Opcional
  email: string            // REQUERIDO
  telefono?: string        // Opcional
  dni?: string             // Opcional (CUIT/DNI)
  crearCita?: boolean      // Opcional (default: false)
  fecha?: string           // REQUERIDO si crearCita = true (YYYY-MM-DD)
  horario?: string         // REQUERIDO si crearCita = true (HH:MM)
}
```

### **Ejemplo de Request**

```json
{
  "nombre": "María",
  "apellido": "González",
  "email": "maria.gonzalez@example.com",
  "telefono": "+54 9 11 1234-5678",
  "dni": "12345678",
  "crearCita": true,
  "fecha": "2025-03-15",
  "horario": "15:00"
}
```

---

## 🎨 **Estados del Formulario**

### **Estados de UI**

1. **Normal**: Formulario listo para completar
2. **Enviando**: Muestra spinner y deshabilita botones
3. **Éxito**: Alert de confirmación + limpia formulario
4. **Error**: Muestra mensaje de error en rojo

### **Variables de Estado**

```typescript
const [submittingForm, setSubmittingForm] = useState(false)  // Loading
const [submitError, setSubmitError] = useState<string | null>(null)  // Error
```

### **Botón de Submit**

```tsx
<Button disabled={submittingForm}>
  {submittingForm ? (
    <>
      <Spinner />
      Enviando...
    </>
  ) : (
    <>
      <Check />
      Confirmar Cita
    </>
  )}
</Button>
```

---

## ✅ **Validaciones**

### **Frontend (Antes de enviar)**

```typescript
if (!formData.name || !formData.email || !formData.date || !formData.time) {
  setSubmitError("Por favor completa todos los campos requeridos")
  return
}
```

### **Campos Requeridos**

- ✅ Nombre completo
- ✅ Email
- ✅ Fecha de la cita
- ✅ Horario de la cita

### **Campos Opcionales**

- Teléfono (WhatsApp)
- DNI

---

## 🔐 **Autenticación**

La API usa API Key para autenticación:

```typescript
headers: {
  "Content-Type": "application/json",
  "X-API-Key": "ecom_1_919f89353fb94505252c3e084fbf7c46"
}
```

**Nota**: La API Key está hardcodeada en `lib/api.ts`. En producción, considera usar variables de entorno.

---

## 📱 **Experiencia de Usuario**

### **Flujo de Reserva**

1. **Paso 1**: Usuario ingresa datos personales
   - Nombre y Apellido
   - Teléfono (WhatsApp)
   - Email

2. **Paso 2**: Usuario selecciona fecha y horario
   - Fecha (calendario)
   - Horario (dropdown)
   - DNI (opcional)

3. **Submit**: Usuario confirma
   - Se muestra "Enviando..."
   - Botones deshabilitados
   - Spinner visible

4. **Éxito**:
   - Alert: "¡Solicitud de cita enviada exitosamente!"
   - Formulario se limpia
   - Vuelve al paso 1

5. **Error**:
   - Mensaje en rojo mostrando el error
   - Usuario puede corregir e intentar nuevamente
   - Alert con mensaje de error

---

## 🐛 **Manejo de Errores**

### **Tipos de Errores**

1. **Error de Validación**:
   ```
   "Por favor completa todos los campos requeridos"
   ```

2. **Error de Conexión**:
   ```
   "Error de conexión. Por favor intenta nuevamente."
   ```

3. **Error del Backend**:
   ```
   Mensaje personalizado desde el backend
   ```

### **Logs en Consola**

```javascript
// Al enviar
console.log("Enviando lead:", leadData)

// En caso de error
console.error("Error al enviar formulario:", error)
```

---

## 🧪 **Testing**

### **Caso 1: Envío Exitoso**

**Input:**
```
Nombre: María González
Email: maria@example.com
Teléfono: +54 9 11 1234-5678
DNI: 12345678
Fecha: 15/03/2025
Horario: 15:00
```

**Comportamiento Esperado:**
- ✅ Botón muestra "Enviando..."
- ✅ Alert de éxito
- ✅ Formulario se limpia
- ✅ Vuelve al paso 1

### **Caso 2: Error de Validación**

**Input:**
```
Nombre: María González
Email: (vacío)
```

**Comportamiento Esperado:**
- ❌ Mensaje: "Por favor completa todos los campos requeridos"
- ❌ No se envía nada al backend

### **Caso 3: Backend No Disponible**

**Comportamiento Esperado:**
- ❌ Mensaje: "Error de conexión. Por favor intenta nuevamente."
- ❌ Alert con error
- ✅ Usuario puede intentar nuevamente

### **Caso 4: Error del Backend**

**Backend responde:**
```json
{
  "statusCode": 400,
  "message": "Email ya registrado"
}
```

**Comportamiento Esperado:**
- ❌ Mensaje: "Email ya registrado"
- ❌ Alert con el mensaje
- ✅ Usuario puede corregir

---

## 🔄 **Formato de Datos**

### **Transformaciones Automáticas**

| Campo Formulario | Transformación | Campo API |
|-----------------|----------------|-----------|
| `name: "María González"` | `separarNombreCompleto()` | `nombre: "María"`, `apellido: "González"` |
| `date: Date(2025-03-15)` | `formatearFechaAPI()` | `fecha: "2025-03-15"` |
| `time: "15:00"` | Ninguna | `horario: "15:00"` |
| `phone: "+54..."` | Ninguna | `telefono: "+54..."` |
| `email: "..."` | Ninguna | `email: "..."` |
| `dni: "..."` | Ninguna | `dni: "..."` |
| - | Hardcoded | `crearCita: true` |

---

## 📁 **Archivos Modificados**

- ✅ `lib/api.ts` - Funciones de lead y helpers
- ✅ `app/page.tsx` - Integración con formulario
- 📄 `INTEGRACION_LEADS.md` - Esta documentación

---

## 🚀 **Uso en Otros Componentes**

Si quieres usar el mismo formulario en otro lugar:

```tsx
import { crearLeadPublico, separarNombreCompleto, formatearFechaAPI } from "@/lib/api"

const handleSubmit = async (data) => {
  const { nombre, apellido } = separarNombreCompleto(data.nombreCompleto)
  const fecha = formatearFechaAPI(data.fecha)
  
  const response = await crearLeadPublico({
    nombre,
    apellido,
    email: data.email,
    telefono: data.telefono,
    crearCita: true,
    fecha,
    horario: data.horario,
  })
  
  if (response.success) {
    // Éxito
  } else {
    // Error
  }
}
```

---

## 🎯 **Próximas Mejoras Opcionales**

1. **Toast Notifications**: Usar `sonner` en lugar de `alert()`
2. **Validación Email**: Validar formato antes de enviar
3. **Validación Teléfono**: Validar formato de teléfono
4. **Confirmación Visual**: Modal de confirmación más elegante
5. **Envío Asíncrono**: Cerrar dialog y enviar en background
6. **Retry Logic**: Reintentar automáticamente en caso de error
7. **Analytics**: Trackear conversiones de citas
8. **WhatsApp Integration**: Enviar confirmación por WhatsApp

---

## 🔍 **Debugging**

### **Ver datos antes de enviar**

```javascript
console.log("Enviando lead:", leadData)
```

### **Ver respuesta del backend**

```javascript
console.log("Respuesta:", response)
```

### **Ver errores**

```javascript
console.error("Error:", error)
```

### **Network Tab**

Abre DevTools → Network → Busca `lead/public`
- Ver request body
- Ver response
- Ver status code
- Ver headers

---

## 📞 **Endpoints**

### **Crear Lead**

```
POST /lead/public
```

**Headers:**
```
Content-Type: application/json
X-API-Key: ecom_1_919f89353fb94505252c3e084fbf7c46
```

**Body:**
```json
{
  "nombre": "María",
  "apellido": "González",
  "email": "maria@example.com",
  "telefono": "+54 9 11 1234-5678",
  "dni": "12345678",
  "crearCita": true,
  "fecha": "2025-03-15",
  "horario": "15:00"
}
```

---

**¡El sistema de reservas está completamente integrado!** 🎉

Los usuarios ahora pueden reservar citas y los datos se guardan automáticamente en el backend.

