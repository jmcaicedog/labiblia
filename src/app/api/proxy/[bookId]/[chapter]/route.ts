import { NextRequest, NextResponse } from 'next/server';
import { BibleApiError, getChapter } from '@/lib/bibleApi';

interface RouteParams {
  params: Promise<{
    bookId: string;
    chapter: string;
  }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { bookId, chapter } = await params;
  const chapterNum = Number(chapter);

  if (!Number.isInteger(chapterNum) || chapterNum < 0) {
    return NextResponse.json({ error: 'Capítulo no válido' }, { status: 400 });
  }

  try {
    const data = await getChapter(bookId, chapterNum);

    return NextResponse.json({
      book: data.bookName,
      bookSlug: data.bookSlug,
      chapter: data.chapter,
      verses: data.verses.map((v) => ({ verse: v.number, text: v.text })),
    });
  } catch (error) {
    console.error('Error en proxy de la Biblia:', error);

    if (error instanceof BibleApiError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    return NextResponse.json({ error: 'Error al obtener los versículos' }, { status: 500 });
  }
}

