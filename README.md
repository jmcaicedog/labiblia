# La Biblia - Aplicación Web

Una aplicación web moderna y responsiva para leer la Biblia Católica en español, construida con Next.js y diseñada para desplegarse en Vercel.

## Características

- 📱 **Mobile First**: Diseño pensado primero para dispositivos móviles
- 🎨 **Interfaz Minimalista**: Diseño limpio y moderno con paleta de colores elegante
- 🔍 **Búsqueda Rápida**: Encuentra libros fácilmente
- 📖 **Navegación Intuitiva**: Testamentos → Libros → Capítulos → Versículos
- 🌙 **Modo Oscuro**: Soporte automático para tema claro/oscuro
- ⚡ **Rendimiento**: Optimizado con Next.js App Router

## Estructura de la Biblia

- **Antiguo Testamento**: 46 libros
- **Nuevo Testamento**: 27 libros
- **Total**: 73 libros (versión católica)

## Instalación

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Construir para producción
npm run build

# Iniciar servidor de producción
npm start
```

## API de la Biblia

La aplicación consume [API Biblia Católica](https://apibiblia.vercel.app/) (Biblia de Jerusalén, canon católico de 73 libros, sobre MongoDB). La URL base se configura en `.env.local`:

```env
NEXT_PUBLIC_BIBLE_API_URL=https://apibiblia.vercel.app
```

El cliente (`src/lib/bibleApi.ts`) consume los endpoints REST `v1` de esa API:

- `GET /api/v1/books` — catálogo de los 73 libros
- `GET /api/v1/books/{book}/chapters` — capítulos de un libro
- `GET /api/v1/books/{book}/chapters/{chapter}` — capítulo completo con versículos
- `GET /api/v1/books/{book}/chapters/{chapter}/verses/{verse}` — versículo o rango
- `GET /api/v1/search` — búsqueda de texto completo
- `GET /api/v1/random`, `/api/v1/verse-of-the-day`, `/api/v1/stats`

El componente `VerseDisplay` obtiene los versículos a través de la ruta interna `GET /api/proxy/{bookId}/{chapter}` (evita CORS y normaliza la respuesta), que a su vez llama a `getChapter()` en `bibleApi.ts`. El `bookId` usado en las rutas de la app coincide con el `slug` de la API (p. ej. `1-samuel`, `cantar-de-los-cantares`, `hechos-de-los-apostoles`).

## Desplegar en Vercel

1. Conecta tu repositorio a Vercel
2. Configura las variables de entorno si usas una API externa
3. ¡Despliega!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

## Estructura del Proyecto

```
src/
├── app/
│   ├── page.tsx              # Página principal
│   ├── layout.tsx            # Layout global
│   ├── not-found.tsx         # Página 404
│   ├── libro/
│   │   └── [bookId]/
│   │       ├── page.tsx      # Página de libro
│   │       └── [chapter]/
│   │           └── page.tsx  # Página de capítulo
│   └── api/
│       └── proxy/            # Proxy interno hacia la API de la Biblia
├── components/
│   ├── Header.tsx            # Cabecera con navegación
│   ├── SearchBar.tsx         # Buscador
│   ├── TestamentCard.tsx     # Tarjeta de testamento
│   ├── ChapterGrid.tsx       # Grid de capítulos
│   ├── VerseDisplay.tsx      # Visualización de versículos
│   └── QuickNav.tsx          # Navegación rápida flotante
├── data/
│   └── bible.ts              # Catálogo local de libros (slugs, capítulos)
└── lib/
    ├── bibleApi.ts           # Cliente de la API Biblia Católica
    └── config.ts             # Configuración de la app
```

## Tecnologías

- [Next.js 15](https://nextjs.org/) - Framework React
- [TypeScript](https://www.typescriptlang.org/) - Tipado estático
- [Tailwind CSS](https://tailwindcss.com/) - Estilos
- [Vercel](https://vercel.com/) - Despliegue

## Licencia

MIT
