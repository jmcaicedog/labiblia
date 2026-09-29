// Cliente de la API Biblia Católica (v2, MongoDB)
// Documentación: https://apibiblia.vercel.app/

const API_BASE_URL = (process.env.NEXT_PUBLIC_BIBLE_API_URL || 'https://apibiblia.vercel.app').replace(/\/+$/, '');

export type Testament = 'AT' | 'NT';

export interface ApiBook {
  slug: string;
  name: string;
  abbrev: string;
  testament: Testament;
  order: number;
  deuterocanonical: boolean;
  deuterocanonicalAdditions: boolean;
  chapterCount: number;
  firstChapter: number;
  lastChapter: number;
  verseCount: number;
  sourceUrl: string | null;
}

export interface ApiVerse {
  number: number;
  text: string;
}

export interface ApiChapterSummary {
  bookSlug: string;
  bookName: string;
  bookAbbrev: string;
  testament: Testament;
  chapter: number;
  isPrologue: boolean;
  verseCount: number;
  sourceUrl: string | null;
}

export interface ApiChapter extends ApiChapterSummary {
  verses: ApiVerse[];
}

export interface ApiVerseRange {
  bookSlug: string;
  bookName: string;
  bookAbbrev: string;
  testament: Testament;
  chapter: number;
  reference: string;
  verses: ApiVerse[];
}

export interface ApiSearchResult {
  bookSlug: string;
  bookName: string;
  bookAbbrev: string;
  testament: Testament;
  chapter: number;
  verse: number;
  reference: string;
  text: string;
}

export interface ApiSearchMeta {
  query: string;
  mode: 'text' | 'contains';
  total: number;
  limit: number;
  offset: number;
}

export interface ApiStats {
  version: string;
  canon: string;
  books: number;
  chapters: number;
  verses: number;
  deuterocanonical: number;
  testaments: { testament: Testament; books: number; chapters: number; verses: number }[];
}

export class BibleApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'BibleApiError';
    this.status = status;
  }
}

type QueryParams = Record<string, string | number | boolean | undefined>;

async function apiFetch<T>(path: string, params?: QueryParams): Promise<T> {
  const url = new URL(`${API_BASE_URL}${path}`);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) url.searchParams.set(key, String(value));
    });
  }

  const response = await fetch(url.toString(), {
    // Los textos bíblicos no cambian: se puede cachear de forma agresiva
    next: { revalidate: 60 * 60 * 24 },
  });

  if (!response.ok) {
    let message = `Error ${response.status} al consultar la API de la Biblia`;
    try {
      const body = await response.json();
      if (body?.error?.message) message = body.error.message;
    } catch {
      // el cuerpo no era JSON, se usa el mensaje por defecto
    }
    throw new BibleApiError(message, response.status);
  }

  return response.json();
}

// Listar los 73 libros del canon, opcionalmente filtrados por testamento
export async function getBooks(testament?: Testament): Promise<ApiBook[]> {
  const { data } = await apiFetch<{ data: ApiBook[] }>('/api/v1/books', { testament });
  return data;
}

// Obtener un libro por slug, nombre o abreviatura
export async function getBook(book: string): Promise<ApiBook> {
  const { data } = await apiFetch<{ data: ApiBook }>(`/api/v1/books/${encodeURIComponent(book)}`);
  return data;
}

// Listar los capítulos de un libro (sin el texto de los versículos)
export async function getChapters(book: string): Promise<ApiChapterSummary[]> {
  const { data } = await apiFetch<{ data: ApiChapterSummary[] }>(`/api/v1/books/${encodeURIComponent(book)}/chapters`);
  return data;
}

// Obtener un capítulo completo con todos sus versículos
export async function getChapter(book: string, chapter: number): Promise<ApiChapter> {
  const { data } = await apiFetch<{ data: ApiChapter }>(
    `/api/v1/books/${encodeURIComponent(book)}/chapters/${chapter}`
  );
  return data;
}

// Obtener un versículo (`3`) o un rango inclusivo (`3-7`, máximo 200 versículos)
export async function getVerseRange(book: string, chapter: number, verse: string | number): Promise<ApiVerseRange> {
  const { data } = await apiFetch<{ data: ApiVerseRange }>(
    `/api/v1/books/${encodeURIComponent(book)}/chapters/${chapter}/verses/${verse}`
  );
  return data;
}

export interface SearchOptions {
  mode?: 'text' | 'contains';
  testament?: Testament;
  book?: string;
  limit?: number;
  offset?: number;
}

// Búsqueda de texto completo en español (modo `text`) o por subcadena (modo `contains`)
export async function searchBible(
  query: string,
  options: SearchOptions = {}
): Promise<{ results: ApiSearchResult[]; meta: ApiSearchMeta }> {
  const { data, meta } = await apiFetch<{ data: ApiSearchResult[]; meta: ApiSearchMeta }>('/api/v1/search', {
    q: query,
    ...options,
  });
  return { results: data, meta };
}

// Versículo al azar
export async function getRandomVerse(): Promise<ApiSearchResult> {
  const { data } = await apiFetch<{ data: ApiSearchResult }>('/api/v1/random');
  return data;
}

// Versículo del día (selección determinista por fecha, formato YYYY-MM-DD)
export async function getVerseOfTheDay(date?: string): Promise<{ date: string; verse: ApiSearchResult }> {
  const { data } = await apiFetch<{ data: { date: string; verse: ApiSearchResult } }>('/api/v1/verse-of-the-day', {
    date,
  });
  return data;
}

// Estadísticas globales del corpus
export async function getStats(): Promise<ApiStats> {
  const { data } = await apiFetch<{ data: ApiStats }>('/api/v1/stats');
  return data;
}
