// Configuración de la aplicación

export const config = {
  // URL base de la API Biblia Católica (https://apibiblia.vercel.app)
  apiBaseUrl: process.env.NEXT_PUBLIC_BIBLE_API_URL || 'https://apibiblia.vercel.app',
  
  // Nombre de la aplicación
  appName: 'La Biblia',
  
  // Versión de la Biblia
  bibleVersion: 'Católica',
  
  // Idioma
  language: 'es',
};

