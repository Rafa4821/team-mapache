# E-commerce para Team Mapache

Este es un e-commerce completo construido con Next.js, Tailwind CSS y Supabase para la venta de productos.

## Características

- **Framework:** Next.js
- **Base de Datos:** Supabase (PostgreSQL)
- **Autenticación:** Supabase Auth
- **Almacenamiento de Archivos:** Supabase Storage
- **Envío de Correos:** Resend
- **Gestión de Estado:** React Context API
- **UI y Estilos:** Tailwind CSS & shadcn/ui

### Funcionalidades Públicas
- Página de inicio con listado de productos.
- Filtros por categoría de anime.
- Página de detalle de producto con galería, descripción y precio.
- Carrito de compras funcional con persistencia en `localStorage`.
- SEO básico con meta-tags dinámicos en las páginas de producto.

### Panel de Administración
- Ruta protegida (`/admin`) solo para administradores.
- Login con email y contraseña.
- CRUD completo de productos (Crear, Leer, Actualizar, Eliminar).
- Subida de imágenes a Firebase Storage.

---

## Guía de Instalación y Despliegue

### 1. Configuración de Supabase

1.  Ve a [Supabase](https://supabase.com/), crea una cuenta y un nuevo proyecto.
2.  **Obtén tus claves de API**: En el dashboard de tu proyecto, ve a **Settings** -> **API**. Necesitarás la **URL del Proyecto** y la clave `anon` **pública**.
3.  **Crea las tablas**: Ve al **Table Editor** y crea las tablas necesarias para `products`, `orders`, `order_items`, etc. Asegúrate de configurar las políticas de seguridad (Row Level Security) para proteger tus datos.
4.  **Configura el Almacenamiento (Storage)**: Ve a **Storage** y crea un *bucket* para las imágenes de tus productos (por ejemplo, `products`). Asegúrate de que las políticas del bucket permitan el acceso público para lectura (`SELECT`).

### 2. Configuración de Resend

1.  Ve a [Resend](https://resend.com/), crea una cuenta.
2.  **Añade y verifica tu dominio**: Sigue las instrucciones para añadir tu dominio y configurar los registros DNS necesarios (DKIM, SPF).
3.  **Crea una clave de API**: Ve a la sección **API Keys** y crea una nueva clave. Necesitarás este valor para enviar correos.

### 3. Variables de Entorno

En la raíz de este proyecto, crea un archivo llamado `.env.local` y añade las siguientes variables con tus propias claves:

```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=URL_DE_TU_PROYECTO_SUPABASE
NEXT_PUBLIC_SUPABASE_ANON_KEY=CLAVE_ANON_PUBLICA_DE_SUPABASE
SUPABASE_SERVICE_KEY=CLAVE_SERVICE_ROLE_DE_SUPABASE

# Resend
RESEND_API_KEY=CLAVE_API_DE_RESEND

# Admin
ADMIN_SECRET=UNA_CLAVE_SECRETA_PARA_PROTEGER_ENDPOINTS_DE_ADMIN
NEXT_PUBLIC_ADMIN_SECRET=LA_MISMA_CLAVE_SECRETA_PARA_EL_CLIENTE

# App
NEXT_PUBLIC_APP_URL=localhost:3000
```

**Importante**: Para producción, `NEXT_PUBLIC_APP_URL` debe ser el dominio de tu aplicación en Vercel (ej: `tu-tienda.vercel.app`).

### 4. Instalación Local

```bash
# Instalar dependencias
npm install

# Ejecutar el servidor de desarrollo
npm run dev
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000).

### 5. Despliegue en Vercel

1.  Sube tu proyecto a un repositorio de GitHub, GitLab o Bitbucket.
2.  Crea una cuenta en [Vercel](https://vercel.com/) e importa tu repositorio.
3.  Vercel detectará automáticamente que es un proyecto de Next.js.
4.  Ve a la configuración del proyecto en Vercel (**Settings** -> **Environment Variables**) y añade las mismas variables de entorno que configuraste en tu archivo `.env.local`.
5.  ¡Despliega! Vercel se encargará del resto.

¡Y eso es todo! Tu e-commerce estará online.
