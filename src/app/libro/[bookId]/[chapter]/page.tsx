import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import VerseDisplay from '@/components/VerseDisplay';
import QuickNav from '@/components/QuickNav';
import { getBookById, allBooks } from '@/data/bible';

interface ChapterPageProps {
  params: Promise<{
    bookId: string;
    chapter: string;
  }>;
}

export async function generateStaticParams() {
  const paths: { bookId: string; chapter: string }[] = [];
  
  allBooks.forEach(book => {
    for (let i = 1; i <= book.chapters; i++) {
      paths.push({
        bookId: book.id,
        chapter: i.toString(),
      });
    }
  });
  
  return paths;
}

export async function generateMetadata({ params }: ChapterPageProps) {
  const { bookId, chapter } = await params;
  const book = getBookById(bookId);
  const chapterNum = parseInt(chapter, 10);
  
  if (!book || isNaN(chapterNum) || chapterNum < 1 || chapterNum > book.chapters) {
    return {
      title: 'Capítulo no encontrado',
    };
  }

  return {
    title: `${book.name} ${chapterNum} - La Biblia`,
    description: `Lee ${book.name} capítulo ${chapterNum} de la Biblia Católica.`,
  };
}

export default async function ChapterPage({ params }: ChapterPageProps) {
  const { bookId, chapter } = await params;
  const book = getBookById(bookId);
  const chapterNum = parseInt(chapter, 10);

  if (!book || isNaN(chapterNum) || chapterNum < 1 || chapterNum > book.chapters) {
    notFound();
  }

  const isOld = book.testament === 'old';
  const badgeBg = isOld 
    ? 'bg-amber-200 dark:bg-amber-800' 
    : 'bg-emerald-200 dark:bg-emerald-800';
  const badgeText = isOld 
    ? 'text-amber-900 dark:text-amber-100' 
    : 'text-emerald-900 dark:text-emerald-100';

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Header 
        backHref={`/libro/${book.id}`}
        title={`${book.name} ${chapterNum}`}
        showSearch={true}
      />

      <main className="max-w-3xl mx-auto px-4 py-6 pb-24">
        {/* Chapter info */}
        <div className="mb-6 animate-fade-in">
          <div className="flex items-center gap-3 mb-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${badgeBg} ${badgeText}`}>
              {book.abbreviation}
            </span>
            <h1 className="text-xl font-bold text-[var(--foreground)]">
              Capítulo {chapterNum}
            </h1>
          </div>
          <p className="text-sm text-[var(--foreground-muted)]">
            {book.name} · {book.testament === 'old' ? 'Antiguo Testamento' : 'Nuevo Testamento'}
          </p>
        </div>

        {/* Verses */}
        <div className="bg-[var(--background-card)] rounded-2xl p-4 sm:p-6 border border-[var(--border)]
                        shadow-sm animate-fade-in" style={{ animationDelay: '100ms' }}>
          <VerseDisplay book={book} chapter={chapterNum} />
        </div>
      </main>

      {/* Quick navigation */}
      <QuickNav book={book} currentChapter={chapterNum} />
    </div>
  );
}
