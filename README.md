# SteveGames — Frontend React + Vite

Frontend de la tienda de videojuegos **SteveGames**, construido con **React 19 + Vite**.

> ⚠️ **Código original preservado intacto.** Solo se agregaron archivos nuevos para nuevas funcionalidades y configuración de producción, sin modificar ningún archivo existente.

## 🛠️ Tecnologías

- **React 19** + **Vite 7**
- **React Router DOM 7** — enrutamiento
- **Axios** — llamadas HTTP al backend
- **React Icons** — iconografía

## ⚡ Instalación y Ejecución

### Pre-requisitos
- [Node.js 18+](https://nodejs.org/)
- Backend SteveGames API corriendo en `http://127.0.0.1:8000`

### Pasos

```bash
# 1. Clonar el repositorio
git clone <url-del-repositorio-frontend>
cd team-1

# 2. Instalar dependencias
npm install

# 3. Ejecutar en modo desarrollo
npm run dev
```

La aplicación estará en: **http://localhost:5173**

## 🌐 Páginas

| Ruta | Descripción |
|------|-------------|
| `/` | Catálogo con destacados, ofertas y búsqueda |
| `/juego/:id` | Detalle del juego + Reseñas ⭐ |
| `/login` | Iniciar sesión |
| `/registro` | Crear cuenta |
| `/perfil` | Perfil, lista de deseos, historial de compras |
| `/cart` | Carrito de compras y checkout |
| `/admin` | Panel de gestión (vendedor) + Estadísticas ⭐ |

## 🔧 Configuración del Entorno

El archivo `.env` controla la URL del backend:

```bash
# Desarrollo (.env)
VITE_API_BASE=http://127.0.0.1:8000

# Producción (.env.production) — actualizar antes de hacer build
VITE_API_BASE=https://tu-backend.azurewebsites.net
```

## 🚀 Build para Producción

```bash
# Editar .env.production con la URL real del backend
# Luego:
npm run build
```

Los archivos estáticos quedan en `dist/` — subir a Azure Static Web Apps, AWS S3 + CloudFront, Netlify, etc.

## ✨ Nuevas Funcionalidades

### 1. Reseñas y Valoraciones (`/juego/:id`)
- Sección de estrellas (1-5 ★) al final de la página de cada juego
- Los usuarios logueados pueden dejar una reseña + comentario
- Se muestra el promedio de valoraciones y todas las reseñas existentes

### 2. Dashboard de Estadísticas (`/admin` → pestaña "Estadísticas")
- Tarjetas KPI: clientes, pedidos, ingresos, productos
- Barras de progreso por estado de pedidos
- Producto más vendido destacado

## 🗂️ Estructura de Nuevos Archivos (Adiciones)

```
src/
├── config/
│   └── api.js              ← URL base configurable via Vite env vars
├── components/
│   ├── ReviewSection.jsx   ← Funcionalidad #1: Reseñas
│   └── AdminStats.jsx      ← Funcionalidad #2: Estadísticas
.env                        ← Variables de entorno desarrollo
.env.production             ← Variables de entorno producción
```
