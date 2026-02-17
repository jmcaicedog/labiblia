import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import ChapterGrid from '@/components/ChapterGrid';
import { getBookById, allBooks } from '@/data/bible';

interface BookPageProps {
  params: Promise<{
    bookId: string;
  }>;
}

export async function generateStaticParams() {
  return allBooks.map(book => ({
    bookId: book.id,
  }));
}

export async function generateMetadata({ params }: BookPageProps) {
  const { bookId } = await params;
  const book = getBookById(bookId);
  
  if (!book) {
    return {
      title: 'Libro no encontrado',
    };
  }

  return {
    title: `${book.name} - La Biblia`,
    description: `Lee ${book.name} de la Biblia Católica. ${book.chapters} capítulos.`,
  };
}

export default async function BookPage({ params }: BookPageProps) {
  const { bookId } = await params;
  const book = getBookById(bookId);

  if (!book) {
    notFound();
  }

  const isOld = book.testament === 'old';
  const badgeBg = isOld 
    ? 'bg-amber-200 dark:bg-amber-800' 
    : 'bg-emerald-200 dark:bg-emerald-800';
  const badgeText = isOld 
    ? 'text-amber-900 dark:text-amber-100' 
    : 'text-emerald-900 dark:text-emerald-100';
  const gradientFrom = isOld ? 'from-amber-500' : 'from-emerald-500';
  const gradientTo = isOld ? 'to-orange-600' : 'to-teal-600';

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Header 
        backHref="/" 
        title={book.name}
        showSearch={true}
      />

      <main className="max-w-4xl mx-auto px-4 py-6 pb-20">
        {/* Book info card */}
        <div className="bg-[var(--background-card)] rounded-2xl p-6 mb-6 border border-[var(--border)]
                        shadow-sm animate-fade-in">
          <div className="flex items-center gap-4 mb-4">
            <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${gradientFrom} ${gradientTo}
                            flex items-center justify-center shadow-lg`}>
              <span className="text-white font-bold text-lg">{book.abbreviation}</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[var(--foreground)]">{book.name}</h1>
              <div className="flex items-center gap-2 mt-1">
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${badgeBg} ${badgeText}`}>
                  {book.testament === 'old' ? 'Antiguo Testamento' : 'Nuevo Testamento'}
                </span>
                <span className="text-sm text-[var(--foreground-muted)]">
                  {book.category}
                </span>
              </div>
            </div>
          </div>
          <p className="text-[var(--foreground-muted)]">
            {book.chapters} {book.chapters === 1 ? 'capítulo' : 'capítulos'}
          </p>
        </div>

        {/* Chapters grid */}
        <div className="animate-fade-in" style={{ animationDelay: '100ms' }}>
          <h2 className="text-lg font-semibold mb-4 text-[var(--foreground)]">
            Selecciona un capítulo
          </h2>
          <ChapterGrid book={book} />
        </div>
      </main>
    </div>
  );
}
