import { NextRequest, NextResponse } from 'next/server';
import { getBookById } from '@/data/bible';

// Esta es una API de ejemplo. Reemplázala con tu propia API de la Biblia católica.
// El endpoint espera recibir el bookId y chapter como parámetros.

// Versículos de ejemplo (reemplazar con datos reales)
const sampleVerses: Record<string, Record<number, { verse: number; text: string }[]>> = {
  genesis: {
    1: [
      { verse: 1, text: "En el principio creó Dios los cielos y la tierra." },
      { verse: 2, text: "La tierra estaba desordenada y vacía, las tinieblas cubrían el abismo y el espíritu de Dios se cernía sobre las aguas." },
      { verse: 3, text: "Dijo Dios: «Haya luz». Y hubo luz." },
      { verse: 4, text: "Vio Dios que la luz era buena, y separó Dios la luz de las tinieblas." },
      { verse: 5, text: "Llamó Dios a la luz «día», y a las tinieblas llamó «noche». Y fue la tarde y fue la mañana del día primero." },
      { verse: 6, text: "Dijo Dios: «Haya un firmamento en medio de las aguas, que separe unas aguas de otras»." },
      { verse: 7, text: "Hizo Dios el firmamento, y separó las aguas que hay debajo del firmamento de las aguas que hay encima del firmamento. Y así fue." },
      { verse: 8, text: "Llamó Dios al firmamento «cielo». Y fue la tarde y fue la mañana del día segundo." },
      { verse: 9, text: "Dijo Dios: «Júntense las aguas de debajo del cielo en un solo lugar, y aparezca lo seco». Y así fue." },
      { verse: 10, text: "Llamó Dios a lo seco «tierra», y a la reunión de las aguas la llamó «mares». Y vio Dios que era bueno." },
    ],
  },
  juan: {
    1: [
      { verse: 1, text: "En el principio existía el Verbo, y el Verbo estaba junto a Dios, y el Verbo era Dios." },
      { verse: 2, text: "Él estaba en el principio junto a Dios." },
      { verse: 3, text: "Por medio de él se hizo todo, y sin él no se hizo nada de lo que se ha hecho." },
      { verse: 4, text: "En él estaba la vida, y la vida era la luz de los hombres." },
      { verse: 5, text: "La luz brilla en las tinieblas, y las tinieblas no la han recibido." },
      { verse: 6, text: "Surgió un hombre enviado por Dios, que se llamaba Juan." },
      { verse: 7, text: "Este venía como testigo, para dar testimonio de la luz, para que todos creyeran por medio de él." },
      { verse: 8, text: "No era él la luz, sino el que daba testimonio de la luz." },
      { verse: 9, text: "El Verbo era la luz verdadera, que ilumina a todo hombre, viniendo al mundo." },
      { verse: 10, text: "En el mundo estaba; el mundo se hizo por medio de él, y el mundo no lo conoció." },
    ],
  },
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
  const book = getBookById(bookId);

  if (!book) {
    return NextResponse.json(
      { error: 'Libro no encontrado' },
      { status: 404 }
    );
  }

  if (isNaN(chapterNum) || chapterNum < 1 || chapterNum > book.chapters) {
    return NextResponse.json(
      { error: 'Capítulo no válido' },
      { status: 400 }
    );
  }

  // Buscar versículos en los datos de ejemplo
  const verses = sampleVerses[bookId]?.[chapterNum];

  if (verses) {
    return NextResponse.json({
      book: book.name,
      chapter: chapterNum,
      verses,
    });
  }

  // Si no hay datos, generar versículos de placeholder
  const placeholderVerses = Array.from({ length: 25 }, (_, i) => ({
    verse: i + 1,
    text: `[Versículo ${i + 1}] Conecta tu API de la Biblia católica para ver el contenido real de ${book.name} capítulo ${chapterNum}.`,
  }));

  return NextResponse.json({
    book: book.name,
    chapter: chapterNum,
    verses: placeholderVerses,
    _note: 'Datos de ejemplo. Conecta tu API para contenido real.',
  });
}
