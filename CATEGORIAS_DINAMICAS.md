# 📂 Sistema de Categorías Dinámicas

El sistema ahora carga y agrupa automáticamente los productos según las categorías que vienen de la API.

---

## 🎯 **Cómo funciona**

### **1. Normalización de Categorías**

La función `normalizarCategoria()` en `lib/api.ts` mapea las categorías de la API a categorías estándar:

```typescript
// Ejemplo de mapeo:
"VESTIDO" → "Largos"
"VESTIDO CORTO" → "Cortos"
"ZAPATO" → "Zapatos"
"ABRIGO" → "Abrigos"
// Cualquier otra → "Otros"
```

### **2. Extracción Dinámica**

Las categorías se extraen automáticamente de los artículos:

```typescript
const categoriasDisponibles = [
  "Todos", 
  ...Array.from(new Set(allProducts.map(p => p.category)))
]
```

### **3. Agrupación por Categoría**

Los productos se agrupan en un objeto:

```typescript
productosPorCategoria = {
  "Largos": [producto1, producto2, ...],
  "Zapatos": [producto3, producto4, ...],
  "Otros": [producto5, ...]
}
```

---

## 📊 **Mapeo de Categorías de la API**

| Categoría API | Categoría Normalizada | Color |
|--------------|----------------------|-------|
| `VESTIDO` | Largos | #128498 (Teal) |
| `VESTIDOS` | Largos | #128498 |
| `VESTIDO LARGO` | Largos | #128498 |
| `VESTIDO CORTO` | Cortos | #AB9072 (Brown) |
| `ZAPATO` | Zapatos | #A1D0B2 (Green) |
| `ZAPATOS` | Zapatos | #A1D0B2 |
| `CALZADO` | Zapatos | #A1D0B2 |
| `ABRIGO` | Abrigos | #D4A574 (Tan) |
| `ABRIGOS` | Abrigos | #D4A574 |
| `ACCESORIO` | Accesorios | #C4B5A0 (Beige) |
| `ACCESORIOS` | Accesorios | #C4B5A0 |
| *Cualquier otra* | Otros | #9CA3AF (Gray) |

---

## 🎨 **Características Visuales**

### **Botones de Categoría con Contador**

```tsx
Todos (15)  Largos (8)  Cortos (4)  Zapatos (3)
```

- Muestra el número de productos en cada categoría
- Solo aparecen categorías con productos disponibles
- Se actualiza automáticamente

### **Secciones Agrupadas**

Cada categoría tiene su propia sección con:
- **Header con color distintivo**
- **Título de la categoría**
- **Contador de productos**
- **Grid de productos**

---

## 🔧 **Agregar Nuevas Categorías**

### **Opción 1: Mapeo Automático**

Si agregas una categoría en la API que ya existe en el mapeo, se mostrará automáticamente:

```typescript
// API envía:
{
  "categoria": "VESTIDO"  // Ya mapeado → "Largos"
}
```

### **Opción 2: Nueva Categoría Personalizada**

Para agregar una nueva categoría con mapeo específico:

1. **Edita `lib/api.ts`:**

```typescript
export function normalizarCategoria(categoria: string): string {
  const mapeoCategories: { [key: string]: string } = {
    // ... categorías existentes ...
    "PANTALON": "Pantalones",  // ← Nueva categoría
    "PANTALONES": "Pantalones",
  }
  
  return mapeoCategories[categoriaNormalizada] || "Otros"
}
```

2. **Opcionalmente, agrega color en `app/page.tsx`:**

```typescript
const coloresPorCategoria: { [key: string]: string } = {
  "Abrigos": "#D4A574",
  "Accesorios": "#C4B5A0",
  "Pantalones": "#8B7355",  // ← Nuevo color
  "Otros": "#9CA3AF"
}
```

### **Opción 3: Categoría Sin Mapeo**

Si no mapeas la categoría, se mostrará automáticamente en "Otros".

---

## 📝 **Ejemplo de Respuesta API**

```json
{
  "data": [
    {
      "id": 1,
      "descripcion": "Vestido Elegante",
      "categoria": "VESTIDO",  // ← Se normaliza a "Largos"
      "imagenPrincipal": "https://...",
      "precioVenta": "25000"
    },
    {
      "id": 2,
      "descripcion": "Zapatos de Gala",
      "categoria": "ZAPATO",  // ← Se normaliza a "Zapatos"
      "imagenPrincipal": "https://...",
      "precioVenta": "15000"
    },
    {
      "id": 3,
      "descripcion": "Cartera Clutch",
      "categoria": "ACCESORIO",  // ← Se normaliza a "Accesorios"
      "imagenPrincipal": "https://...",
      "precioVenta": "8000"
    }
  ]
}
```

**Resultado en la página:**
- Botones: `Todos (3)` `Largos (1)` `Zapatos (1)` `Accesorios (1)`
- 3 secciones agrupadas mostrando cada producto

---

## 🎭 **Visualización en la UI**

### **Categorías Predefinidas (Con diseño personalizado)**

- **Largos**: Fondo #128498 (Teal), diseño de tarjeta especial
- **Cortos**: Fondo #AB9072 (Brown), diseño de tarjeta especial
- **Zapatos**: Fondo #A1D0B2 (Green), diseño de tarjeta especial

### **Categorías Dinámicas (Con diseño genérico)**

- **Cualquier otra categoría**: Se muestra automáticamente con:
  - Color de fondo configurable
  - Badge mostrando la categoría original de la API
  - Diseño consistente con las demás secciones

---

## 🔍 **Debugging**

### **Ver categorías disponibles**

Abre la consola del navegador y escribe:

```javascript
console.log(categoriasDisponibles)
// Output: ["Todos", "Largos", "Zapatos", "Accesorios"]
```

### **Ver productos por categoría**

```javascript
console.log(productosPorCategoria)
// Output: { "Largos": [...], "Zapatos": [...], ... }
```

### **Ver artículos sin procesar**

```javascript
console.log(articulosAPI)
// Muestra los artículos tal como vienen de la API
```

---

## 📦 **Estructura de Datos**

### **Artículo de la API (Input)**

```typescript
{
  id: number
  categoria: string  // ← Campo importante
  descripcion: string
  imagenPrincipal: string
  precioVenta: string
  // ... más campos
}
```

### **Producto Normalizado (Output)**

```typescript
{
  id: number
  name: string
  category: string              // ← Categoría normalizada
  categoriaOriginal: string     // ← Categoría de la API (guardada)
  image: string
  price: string
  badges: string[]
  // ... más campos
}
```

---

## ✅ **Ventajas del Sistema**

1. ✨ **Completamente automático**: No necesitas modificar código para agregar productos
2. 🔄 **Dinámico**: Las categorías aparecen automáticamente según lo que devuelva la API
3. 📊 **Organizado**: Los productos se agrupan visualmente por categoría
4. 🎨 **Flexible**: Puedes personalizar colores y diseños por categoría
5. 🔍 **Filtrable**: Los usuarios pueden filtrar por categoría fácilmente
6. 📈 **Escalable**: Soporta cualquier número de categorías

---

## 🛠️ **Archivos Modificados**

- ✅ `lib/api.ts` - Función `normalizarCategoria()` y `convertirArticuloAProducto()`
- ✅ `app/page.tsx` - Sistema de agrupación y renderizado dinámico
- ✅ `types/articulo.ts` - Types existentes (sin cambios)

---

## 🚀 **Uso**

No necesitas hacer nada especial. El sistema funciona automáticamente:

1. La API devuelve artículos con campo `categoria`
2. Se normalizan a categorías estándar
3. Se agrupan automáticamente
4. Se muestran en secciones organizadas
5. Los botones de filtro se generan dinámicamente

**¡Todo funciona sin intervención manual!** 🎉

---

## 📞 **Agregar Categoría Nueva (Paso a Paso)**

### **Ejemplo: Agregar "CAMISA"**

1. **En la API, agrega artículos:**
```json
{
  "categoria": "CAMISA",
  "descripcion": "Camisa Elegante"
}
```

2. **Opción A - Dejar que se agrupe en "Otros":**
   - No hagas nada, se mostrará automáticamente

3. **Opción B - Crear categoría específica:**

**En `lib/api.ts`:**
```typescript
const mapeoCategories: { [key: string]: string } = {
  // ... existentes ...
  "CAMISA": "Camisas",
  "CAMISAS": "Camisas",
}
```

**En `app/page.tsx` (opcional):**
```typescript
const coloresPorCategoria: { [key: string]: string } = {
  // ... existentes ...
  "Camisas": "#8B9DC3",  // Azul suave
}
```

4. **¡Listo!** La nueva categoría aparecerá automáticamente.

---

**El sistema está listo para cualquier categoría que agregues en la API.** 🎊

