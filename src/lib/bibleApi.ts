// Servicio para conectar con la API de la Biblia Católica
// API: https://apibiblia.vercel.app/

const API_BASE_URL = process.env.NEXT_PUBLIC_BIBLE_API_URL || '';

export interface ApiVerse {
  id?: number;
  numero?: number;
  verse?: number;
  texto?: string;
  text?: string;
}

export interface ApiChapter {
  id: number;
  numero: number;
  libro_id?: number;
}

export interface ApiBook {
  id: number;
  nombre: string;
  abreviatura: string;
  capitulos?: number;
  testamento?: string;
}

// Obtener todos los libros
export async function getBooks(): Promise<ApiBook[]> {
  const response = await fetch(`${API_BASE_URL}api/libros`);
  if (!response.ok) throw new Error('Error al obtener libros');
  return response.json();
}

// Obtener un libro por ID
export async function getBook(bookId: string | number): Promise<ApiBook> {
  const response = await fetch(`${API_BASE_URL}api/libros/${bookId}`);
  if (!response.ok) throw new Error('Error al obtener libro');
  return response.json();
}

// Obtener capítulos de un libro
export async function getChapters(bookId: string | number): Promise<ApiChapter[]> {
  const response = await fetch(`${API_BASE_URL}api/libros/${bookId}/capitulos`);
  if (!response.ok) throw new Error('Error al obtener capítulos');
  return response.json();
}

// Obtener versículos de un capítulo por ID de capítulo
export async function getVersesByChapterId(chapterId: number): Promise<ApiVerse[]> {
  const response = await fetch(`${API_BASE_URL}api/capitulos/${chapterId}/versiculos`);
  if (!response.ok) throw new Error('Error al obtener versículos');
  return response.json();
}

// Mapeo de IDs de libros de nuestra app a IDs de la API
// Este mapeo puede necesitar ajustarse según tu API
export const bookIdMapping: Record<string, number> = {
  // Antiguo Testamento
  'genesis': 1,
  'exodo': 2,
  'levitico': 3,
  'numeros': 4,
  'deuteronomio': 5,
  'josue': 6,
  'jueces': 7,
  'rut': 8,
  '1samuel': 9,
  '2samuel': 10,
  '1reyes': 11,
  '2reyes': 12,
  '1cronicas': 13,
  '2cronicas': 14,
  'esdras': 15,
  'nehemias': 16,
  'tobias': 17,
  'judit': 18,
  'ester': 19,
  '1macabeos': 20,
  '2macabeos': 21,
  'job': 22,
  'salmos': 23,
  'proverbios': 24,
  'eclesiastes': 25,
  'cantar': 26,
  'sabiduria': 27,
  'eclesiastico': 28,
  'isaias': 29,
  'jeremias': 30,
  'lamentaciones': 31,
  'baruc': 32,
  'ezequiel': 33,
  'daniel': 34,
  'oseas': 35,
  'joel': 36,
  'amos': 37,
  'abdias': 38,
  'jonas': 39,
  'miqueas': 40,
  'nahum': 41,
  'habacuc': 42,
  'sofonias': 43,
  'ageo': 44,
  'zacarias': 45,
  'malaquias': 46,
  // Nuevo Testamento
  'mateo': 47,
  'marcos': 48,
  'lucas': 49,
  'juan': 50,
  'hechos': 51,
  'romanos': 52,
  '1corintios': 53,
  '2corintios': 54,
  'galatas': 55,
  'efesios': 56,
  'filipenses': 57,
  'colosenses': 58,
  '1tesalonicenses': 59,
  '2tesalonicenses': 60,
  '1timoteo': 61,
  '2timoteo': 62,
  'tito': 63,
  'filemon': 64,
  'hebreos': 65,
  'santiago': 66,
  '1pedro': 67,
  '2pedro': 68,
  '1juan': 69,
  '2juan': 70,
  '3juan': 71,
  'judas': 72,
  'apocalipsis': 73,
};

// Función principal para obtener versículos por libro y capítulo
export async function getVerses(bookId: string, chapterNumber: number): Promise<{ verse: number; text: string }[]> {
  try {
    // Obtener el ID numérico del libro
    const apiBookId = bookIdMapping[bookId];
    
    if (!apiBookId) {
      throw new Error(`Libro no encontrado: ${bookId}`);
    }

    // Obtener los capítulos del libro
    const chapters = await getChapters(apiBookId);
    
    // Buscar el capítulo por número
    const chapter = chapters.find(c => c.numero === chapterNumber);
    
    if (!chapter) {
      throw new Error(`Capítulo ${chapterNumber} no encontrado`);
    }

    // Obtener los versículos del capítulo
    const verses = await getVersesByChapterId(chapter.id);

    // Normalizar el formato de los versículos
    return verses.map(v => ({
      verse: v.numero || v.verse || 0,
      text: v.texto || v.text || '',
    }));
  } catch (error) {
    console.error('Error al obtener versículos:', error);
    throw error;
  }
}

// Búsqueda de texto
export async function searchBible(query: string): Promise<ApiVerse[]> {
  const response = await fetch(`${API_BASE_URL}api/buscar?q=${encodeURIComponent(query)}`);
  if (!response.ok) throw new Error('Error en la búsqueda');
  return response.json();
}
