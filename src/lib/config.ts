// Configuración de la aplicación
// Modifica estas variables para conectar con tu API de la Biblia

export const config = {
  // URL base de tu API de la Biblia
  // Cambia esto a la URL de tu API real
  apiBaseUrl: process.env.NEXT_PUBLIC_BIBLE_API_URL || '/api',
  
  // Nombre de la aplicación
  appName: 'La Biblia',
  
  // Versión de la Biblia
  bibleVersion: 'Católica',
  
  // Idioma
  language: 'es',
};

// Función helper para construir URLs de la API
export function getBibleApiUrl(bookId: string, chapter: number): string {
  return `${config.apiBaseUrl}/bible/${bookId}/${chapter}`;
}
