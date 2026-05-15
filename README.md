# SteveGames — Frontend

## Tabla de Contenidos

- [Descripción General](#descripción-general)
- [Stack Tecnológico](#stack-tecnológico)
- [Nota de Integridad del Código](#-nota-de-integridad-del-código)
- [Requisitos Previos](#requisitos-previos)
- [Instalación Local](#instalación-local)
- [Configuración de Entorno](#configuración-de-entorno)
- [Configuración de Producción](#configuración-de-producción)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Nuevas Funcionalidades Añadidas](#nuevas-funcionalidades-añadidas)
- [Scripts Disponibles](#scripts-disponibles)
- [Despliegue](#despliegue)

---

##  Descripción General

SteveGames Frontend es una SPA desarrollada en **React con Vite** que provee al usuario final una experiencia de tienda moderna: catálogo de videojuegos, búsqueda, carrito de compras, proceso de pago mediante **Stripe Checkout**, historial de órdenes, lista de deseos, reseñas de productos y un panel estadístico para administradores.

La aplicación se comunica exclusivamente con la **API de .NET 8** a través de la variable de entorno `VITE_API_BASE`, lo que permite apuntar al servidor correcto según el entorno (desarrollo o producción) sin modificar ninguna línea de código.

---

## Stack Tecnológico

| Tecnología | Uso |
|---|---|
| React 18 | Librería de UI principal |
| Vite | Bundler y servidor de desarrollo |
| React Router DOM | Enrutamiento del lado del cliente |
| Axios / Fetch API | Comunicación con el backend |
| Stripe.js | Redirección a Stripe Checkout |
| CSS Modules / Vanilla CSS | Estilos de los componentes |

---

##  Nota de Integridad del Código

> **Esta sección es parte oficial de la documentación del proyecto.**

El código base original del frontend **no ha sido modificado**. Todos los archivos, componentes, servicios y estilos preexistentes permanecen intactos y sin alteraciones.

Las contribuciones realizadas en esta fase consistieron **exclusivamente en la adición de nuevo código**, siguiendo la estructura y convenciones ya establecidas en el proyecto:

| Archivo / Componente | Tipo de cambio | Descripción |
|---|---|---|
| `src/services/paymentService.js` | ➕ Nuevo archivo | Lógica de integración con Stripe Checkout |
| `src/pages/PaymentSuccess.jsx` | ➕ Nuevo archivo | Página de confirmación de pago exitoso |
| `src/pages/PaymentCancel.jsx` | ➕ Nuevo archivo | Página de cancelación de pago |
| `src/components/ReviewSection.jsx` | ➕ Nuevo archivo | Sección de reseñas en el detalle de producto |
| `src/components/AdminStats.jsx` | ➕ Nuevo archivo | Panel de estadísticas para administradores |

Ningún archivo original fue renombrado, eliminado ni refactorizado.

---

##  Requisitos Previos

- [Node.js](https://nodejs.org/) v18 o superior
- npm v9 o superior (incluido con Node.js)
- El **Backend de SteveGames** en ejecución (local o remoto)
- Una cuenta de [Stripe](https://stripe.com) con las claves correspondientes

---

##  Instalación Local

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/stevegames.git
cd stevegames/Frontend/team-1
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno para desarrollo

Crea un archivo `.env` en la raíz del proyecto Frontend:

```env
# URL base del Backend en .NET 8 (desarrollo local)
VITE_API_BASE=http://localhost:5000

# Clave pública de Stripe (para el cliente)
VITE_STRIPE_PUBLIC_KEY=pk_test_XXXXXXXXXXXXXXXXXXXXXXXX
```

### 4. Iniciar el servidor de desarrollo

```bash
npm run dev
```

La aplicación estará disponible en: `http://localhost:5173`

---

##  Configuración de Entorno

### Archivo `.env` (Desarrollo)

```env
VITE_API_BASE=http://localhost:5000
VITE_STRIPE_PUBLIC_KEY=pk_test_XXXXXXXXXXXXXXXXXXXXXXXX
```

### Archivo `.env.production` (Producción)

```env
VITE_API_BASE=https://api.tu-dominio.com
VITE_STRIPE_PUBLIC_KEY=pk_live_XXXXXXXXXXXXXXXXXXXXXXXX
```

>  **Importante:** Vite expone únicamente las variables que comienzan con el prefijo `VITE_`. No incluyas claves secretas de Stripe ni credenciales sensibles en estos archivos. La clave pública (`pk_...`) es la única que debe estar en el frontend.

### Uso en el código

Las variables de entorno se consumen de la siguiente manera:

```javascript
const API_BASE = import.meta.env.VITE_API_BASE;
const STRIPE_KEY = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
```

---

##  Configuración de Producción

Al momento de construir para producción, Vite leerá automáticamente el archivo `.env.production`. Solo debes:

1. Crear `.env.production` con las URLs y claves reales (ver arriba).
2. Ejecutar el comando de build:

```bash
npm run build
```

3. Servir la carpeta `dist/` generada desde tu servidor web (Nginx, Apache, etc.) o plataforma de hosting (Netlify, Vercel, etc.).

### Ejemplo de configuración Nginx para SPA

```nginx
server {
    listen 80;
    server_name tu-dominio.com;
    root /var/www/stevegames/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

> El bloque `try_files` es **esencial** para que React Router funcione correctamente en producción.

---

##  Estructura del Proyecto

```
Frontend/team-1/
├── public/                  # Archivos estáticos públicos
├── src/
│   ├── assets/              # Imágenes, íconos y recursos
│   ├── components/          # Componentes reutilizables
│   │   ├── ...              # Componentes originales (sin modificar)
│   │   ├── ReviewSection.jsx   # ➕ NUEVO — Reseñas de productos
│   │   └── AdminStats.jsx      # ➕ NUEVO — Dashboard de estadísticas
│   ├── pages/               # Páginas de la aplicación
│   │   ├── ...              # Páginas originales (sin modificar)
│   │   ├── PaymentSuccess.jsx  # ➕ NUEVO — Confirmación de pago
│   │   └── PaymentCancel.jsx   # ➕ NUEVO — Cancelación de pago
│   ├── services/            # Capa de comunicación con la API
│   │   ├── ...              # Servicios originales (sin modificar)
│   │   └── paymentService.js   # ➕ NUEVO — Integración con Stripe
│   ├── App.jsx              # Componente raíz y rutas (sin modificar)
│   └── main.jsx             # Punto de entrada (sin modificar)
├── .env                     # Variables de entorno (desarrollo)
├── .env.production          # Variables de entorno (producción)
├── index.html               # HTML raíz (sin modificar)
├── vite.config.js           # Configuración de Vite (sin modificar)
└── package.json
```

---

##  Nuevas Funcionalidades Añadidas

###  Integración de Stripe Checkout

**Archivo:** `src/services/paymentService.js`

Contiene la función que solicita al backend la creación de una sesión de pago y redirige al usuario a la pasarela de Stripe:

```javascript
// Flujo simplificado
const session = await paymentService.createCheckoutSession(cartItems);
window.location.href = session.url; // Redirige a Stripe
```

El carrito **ya no procesa el pago internamente**: delega completamente el flujo de pago a Stripe Checkout, mejorando la seguridad y el cumplimiento PCI.

### Página de Pago Exitoso

**Archivo:** `src/pages/PaymentSuccess.jsx`

Se muestra cuando Stripe redirige al usuario de vuelta con un pago confirmado. Informa al usuario que su compra fue procesada y enlaza al historial de órdenes.

###  Página de Pago Cancelado

**Archivo:** `src/pages/PaymentCancel.jsx`

Se muestra cuando el usuario cancela el proceso en Stripe. Ofrece la opción de regresar al carrito e intentarlo nuevamente.

###  Sección de Reseñas

**Archivo:** `src/components/ReviewSection.jsx`

Integrado en la página de detalle de producto. Permite:
- Ver todas las reseñas existentes con puntuación (1–5 estrellas) y comentario.
- Ver la puntuación promedio del producto.
- Usuarios autenticados: enviar su propia reseña.

###  Panel de Estadísticas para Admin

**Archivo:** `src/components/AdminStats.jsx`

Visible únicamente para usuarios con rol `Admin`. Muestra:
- Ventas totales e ingresos acumulados.
- Ranking de productos más vendidos.
- Gráfico de ingresos por período.

Consume los endpoints `/api/stats/*` del backend.

---

##  Scripts Disponibles

| Comando | Descripción |
|---|---|
| `npm run dev` | Inicia el servidor de desarrollo en `localhost:5173` |
| `npm run build` | Genera el bundle optimizado para producción en `./dist` |
| `npm run preview` | Previsualiza el build de producción localmente |
| `npm run lint` | Ejecuta el linter (ESLint) sobre el código fuente |

---

##  Despliegue

### Checklist de Producción

- [ ] Crear `.env.production` con `VITE_API_BASE` apuntando al dominio real del backend
- [ ] Usar `VITE_STRIPE_PUBLIC_KEY` con la clave `pk_live_...` de Stripe
- [ ] Ejecutar `npm run build` y verificar que la carpeta `dist/` se genera sin errores
- [ ] Subir el contenido de `dist/` al servidor web o plataforma de hosting
- [ ] Configurar el servidor para redirigir todas las rutas a `index.html` (necesario para React Router)
- [ ] Verificar que las URLs de retorno de Stripe (`success_url` y `cancel_url`) coincidan con las rutas del frontend en producción


