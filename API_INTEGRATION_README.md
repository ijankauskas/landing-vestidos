# 🔌 Integración API de Artículos

Esta documentación explica cómo usar la integración con la API de artículos en el proyecto.

---

## 📦 Archivos Creados

```
├── types/
│   └── articulo.ts          # Tipos TypeScript para la API
├── lib/
│   └── api.ts               # Funciones para consumir la API
├── hooks/
│   └── use-articulos.ts     # React hooks personalizados
└── components/
    └── articulos-section.tsx # Componente de ejemplo
```

---

## ⚙️ Configuración Inicial

### 1. Variables de Entorno

**Crea un archivo `.env.local`** en la raíz del proyecto:

```bash
# Para desarrollo local
NEXT_PUBLIC_API_URL=http://localhost:8080
```

**Para producción**, crea `.env.production`:

```bash
# Para producción
NEXT_PUBLIC_API_URL=https://servicios.ecomsolver.com.ar
```

⚠️ **Importante**: No commitees estos archivos al repositorio. Ya están en `.gitignore`.

---

## 🚀 Uso Básico

### Opción 1: Usar el Componente Listo

Importa el componente `ArticulosSection` en tu página:

```tsx
import ArticulosSection from "@/components/articulos-section"

export default function Page() {
  return (
    <div>
      {/* Tu contenido aquí */}
      
      <ArticulosSection />
      
      {/* Más contenido */}
    </div>
  )
}
```

### Opción 2: Usar Funciones API Directamente

```tsx
import { getArticulosPublicos } from "@/lib/api"

// Obtener artículos
const response = await getArticulosPublicos(1, 10)
console.log(response.data)        // Array de artículos
console.log(response.pagination)  // Info de paginación
```

### Opción 3: Usar Hook Personalizado

```tsx
"use client"

import { useArticulos } from "@/hooks/use-articulos"

export default function MiComponente() {
  const { articulos, loading, error, pagination } = useArticulos(1, 10)
  
  if (loading) return <div>Cargando...</div>
  if (error) return <div>Error: {error}</div>
  
  return (
    <div>
      {articulos.map(art => (
        <div key={art.id}>{art.descripcion}</div>
      ))}
    </div>
  )
}
```

---

## 📚 API Reference

### `getArticulosPublicos(page, limit)`

Obtiene artículos públicos con paginación.

```typescript
const response = await getArticulosPublicos(1, 10)
// response.data: Articulo[]
// response.pagination: { total, page, limit, totalPages }
```

### `getArticuloById(id)`

Obtiene un artículo específico por ID.

```typescript
const articulo = await getArticuloById(1)
```

### `getArticulosDestacados()`

Obtiene solo artículos destacados.

```typescript
const destacados = await getArticulosDestacados()
```

### `getArticulosPorCategoria(categoria)`

Filtra artículos por categoría.

```typescript
const vestidos = await getArticulosPorCategoria("Vestidos")
```

### `convertirArticuloAProducto(articulo)`

Convierte un artículo de la API al formato usado en los componentes.

```typescript
const producto = convertirArticuloAProducto(articulo)
```

---

## 🎨 Integración en page.tsx

Para integrar en tu componente `page.tsx` actual:

```tsx
"use client"

import { useEffect, useState } from "react"
import { getArticulosPublicos, convertirArticuloAProducto } from "@/lib/api"

export default function DressRentalPage() {
  const [articulosAPI, setArticulosAPI] = useState<any[]>([])
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getArticulosPublicos(1, 10)
        const productos = response.data.map(convertirArticuloAProducto)
        setArticulosAPI(productos)
      } catch (error) {
        console.error("Error:", error)
      }
    }
    
    fetchData()
  }, [])
  
  // Combinar con tus productos estáticos actuales
  const allProducts = [...dresses, ...shoes, ...articulosAPI]
  
  // ... resto del código
}
```

---

## 🔄 Estructura de Respuesta API

```json
{
  "data": [
    {
      "id": 1,
      "codigo": "ART001",
      "descripcion": "Vestido Elegante",
      "precioVenta": "25000",
      "imagenPrincipal": "url-imagen.jpg",
      "categoria": "Vestidos",
      "esDestacado": true
      // ... más campos
    }
  ],
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "totalPages": 10
  }
}
```

---

## 🛠️ Testing

### Probar en Local

1. Asegúrate que tu API backend esté corriendo en `http://localhost:8080`
2. Ejecuta el proyecto Next.js:
   ```bash
   npm run dev
   ```
3. Navega a la página con el componente

### Verificar Conexión

Abre la consola del navegador (F12) y busca logs como:
```
Artículos cargados: 10
```

---

## 🐛 Troubleshooting

### Error: "Failed to fetch"

- ✅ Verifica que la API esté corriendo
- ✅ Verifica la URL en `.env.local`
- ✅ Verifica que no haya problemas de CORS

### Error: "NEXT_PUBLIC_API_URL is not defined"

- ✅ Asegúrate de haber creado `.env.local`
- ✅ Reinicia el servidor de desarrollo (`npm run dev`)

### Imágenes no cargan

- ✅ Verifica que las URLs de imágenes en la API sean válidas
- ✅ El componente tiene fallback a `/placeholder.jpg`

---

## 📝 Ejemplo Completo

```tsx
"use client"

import { useEffect, useState } from "react"
import { getArticulosPublicos } from "@/lib/api"
import type { Articulo } from "@/types/articulo"

export default function ArticulosPage() {
  const [articulos, setArticulos] = useState<Articulo[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchArticulos = async () => {
      try {
        const response = await getArticulosPublicos(1, 20)
        setArticulos(response.data)
      } catch (error) {
        console.error("Error:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchArticulos()
  }, [])

  if (loading) return <div>Cargando...</div>

  return (
    <div className="grid grid-cols-3 gap-4">
      {articulos.map((articulo) => (
        <div key={articulo.id} className="border p-4 rounded">
          <img 
            src={articulo.imagenPrincipal || "/placeholder.jpg"} 
            alt={articulo.descripcion}
            className="w-full h-48 object-cover"
          />
          <h3 className="font-bold mt-2">{articulo.descripcion}</h3>
          <p className="text-gray-600">${articulo.precioVenta}</p>
          <span className="text-sm text-gray-500">{articulo.categoria}</span>
        </div>
      ))}
    </div>
  )
}
```

---

## 🎯 Próximos Pasos

1. ✅ Configurar variables de entorno
2. ✅ Probar el componente `ArticulosSection`
3. ✅ Integrar con tu página principal
4. ✅ Personalizar estilos según tu diseño
5. ✅ Agregar manejo de errores personalizado

---

**¿Preguntas?** Consulta la documentación de Next.js: https://nextjs.org/docs

