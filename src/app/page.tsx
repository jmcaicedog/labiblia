import Header from '@/components/Header';
import TestamentCard from '@/components/TestamentCard';
import { bibleData } from '@/data/bible';

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 py-6 pb-20">
        {/* Hero section */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-3xl sm:text-4xl font-bold text-[var(--foreground)] mb-2">
            La Santa Biblia
          </h1>
          <p className="text-[var(--foreground-muted)]">
            Versión Católica en Español
          </p>
          <p className="text-[var(--foreground-muted)]">
            Emaús - Cristo Rey
          </p>
        </div>

        {/* Testamentos */}
        <div className="space-y-4">
          {bibleData.map((testament, index) => (
            <div 
              key={testament.id} 
              className="animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <TestamentCard
                id={testament.id}
                name={testament.name}
                books={testament.books}
              />
            </div>
          ))}
        </div>

        {/* Footer info */}
        <div className="mt-12 text-center text-sm text-[var(--foreground-muted)]">
          <p>73 libros · 46 del Antiguo Testamento · 27 del Nuevo Testamento</p>
        </div>
      </main>
    </div>
  );
}

