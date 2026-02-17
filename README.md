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

## Conectar tu API

La aplicación está preparada para conectarse con tu API de la Biblia. Configura la URL en el archivo `.env.local`:

```env
NEXT_PUBLIC_BIBLE_API_URL=https://tu-api-de-la-biblia.com/api
```

### Formato esperado de la API

El endpoint debe responder en el formato:

```
GET /api/bible/{bookId}/{chapter}
```

Respuesta esperada:
```json
{
  "book": "Génesis",
  "chapter": 1,
  "verses": [
    { "verse": 1, "text": "En el principio creó Dios los cielos y la tierra." },
    { "verse": 2, "text": "..." }
  ]
}
```

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
│       └── bible/            # API de ejemplo
├── components/
│   ├── Header.tsx            # Cabecera con navegación
│   ├── SearchBar.tsx         # Buscador
│   ├── TestamentCard.tsx     # Tarjeta de testamento
│   ├── ChapterGrid.tsx       # Grid de capítulos
│   ├── VerseDisplay.tsx      # Visualización de versículos
│   └── QuickNav.tsx          # Navegación rápida flotante
├── data/
│   └── bible.ts              # Datos de libros de la Biblia
└── lib/
    └── config.ts             # Configuración de la app
```

## Tecnologías

- [Next.js 15](https://nextjs.org/) - Framework React
- [TypeScript](https://www.typescriptlang.org/) - Tipado estático
- [Tailwind CSS](https://tailwindcss.com/) - Estilos
- [Vercel](https://vercel.com/) - Despliegue

## Licencia

MIT
