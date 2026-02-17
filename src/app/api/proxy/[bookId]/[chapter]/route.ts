import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_BIBLE_API_URL || 'https://apibiblia.vercel.app/';

// Mapeo de IDs de libros de nuestra app a IDs de la API
const bookIdMapping: Record<string, number> = {
  'genesis': 1, 'exodo': 2, 'levitico': 3, 'numeros': 4, 'deuteronomio': 5,
  'josue': 6, 'jueces': 7, 'rut': 8, '1samuel': 9, '2samuel': 10,
  '1reyes': 11, '2reyes': 12, '1cronicas': 13, '2cronicas': 14, 'esdras': 15,
  'nehemias': 16, 'tobias': 17, 'judit': 18, 'ester': 19, '1macabeos': 20,
  '2macabeos': 21, 'job': 22, 'salmos': 23, 'proverbios': 24, 'eclesiastes': 25,
  'cantar': 26, 'sabiduria': 27, 'eclesiastico': 28, 'isaias': 29, 'jeremias': 30,
  'lamentaciones': 31, 'baruc': 32, 'ezequiel': 33, 'daniel': 34, 'oseas': 35,
  'joel': 36, 'amos': 37, 'abdias': 38, 'jonas': 39, 'miqueas': 40,
  'nahum': 41, 'habacuc': 42, 'sofonias': 43, 'ageo': 44, 'zacarias': 45,
  'malaquias': 46, 'mateo': 47, 'marcos': 48, 'lucas': 49, 'juan': 50,
  'hechos': 51, 'romanos': 52, '1corintios': 53, '2corintios': 54, 'galatas': 55,
  'efesios': 56, 'filipenses': 57, 'colosenses': 58, '1tesalonicenses': 59,
  '2tesalonicenses': 60, '1timoteo': 61, '2timoteo': 62, 'tito': 63, 'filemon': 64,
  'hebreos': 65, 'santiago': 66, '1pedro': 67, '2pedro': 68, '1juan': 69,
  '2juan': 70, '3juan': 71, 'judas': 72, 'apocalipsis': 73,
};

interface RouteParams {
  params: Promise<{
    bookId: string;
    chapter: string;
  }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { bookId, chapter } = await params;
  const chapterNum = parseInt(chapter, 10);

  try {
    // Obtener el ID numérico del libro
    const apiBookId = bookIdMapping[bookId];
    
    if (!apiBookId) {
      return NextResponse.json({ error: 'Libro no encontrado' }, { status: 404 });
    }

    // Obtener los capítulos del libro desde la API externa
    const chaptersResponse = await fetch(`${API_BASE_URL}api/libros/${apiBookId}/capitulos`);
    
    if (!chaptersResponse.ok) {
      throw new Error('Error al obtener capítulos');
    }
    
    const chapters = await chaptersResponse.json();
    
    // Buscar el capítulo por número
    const chapterData = chapters.find((c: { numero: number }) => c.numero === chapterNum);
    
    if (!chapterData) {
      return NextResponse.json({ error: 'Capítulo no encontrado' }, { status: 404 });
    }

    // Obtener los versículos del capítulo
    const versesResponse = await fetch(`${API_BASE_URL}api/capitulos/${chapterData.id}/versiculos`);
    
    if (!versesResponse.ok) {
      throw new Error('Error al obtener versículos');
    }
    
    const verses = await versesResponse.json();

    // Normalizar el formato de respuesta
    const normalizedVerses = verses.map((v: { numero?: number; texto?: string }) => ({
      verse: v.numero || 0,
      text: v.texto || '',
    }));

    return NextResponse.json({
      book: bookId,
      chapter: chapterNum,
      verses: normalizedVerses,
    });
  } catch (error) {
    console.error('Error en proxy de la Biblia:', error);
    return NextResponse.json(
      { error: 'Error al obtener los versículos' },
      { status: 500 }
    );
  }
}
