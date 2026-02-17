'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Book, categories } from '@/data/bible';

interface TestamentCardProps {
  id: 'old' | 'new';
  name: string;
  books: Book[];
}

export default function TestamentCard({ id, name, books }: TestamentCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const isOld = id === 'old';
  // Colores mejorados para mejor contraste
  const categoryBg = isOld 
    ? 'bg-amber-100 dark:bg-amber-900/50' 
    : 'bg-emerald-100 dark:bg-emerald-900/50';
  const categoryText = isOld 
    ? 'text-amber-800 dark:text-amber-200' 
    : 'text-emerald-800 dark:text-emerald-200';
  const badgeBg = isOld 
    ? 'bg-amber-200 dark:bg-amber-800' 
    : 'bg-emerald-200 dark:bg-emerald-800';
  const badgeText = isOld 
    ? 'text-amber-900 dark:text-amber-100' 
    : 'text-emerald-900 dark:text-emerald-100';
  const gradientFrom = isOld ? 'from-amber-500' : 'from-emerald-500';
  const gradientTo = isOld ? 'to-orange-600' : 'to-teal-600';

  const booksByCategory = categories[id].map(category => ({
    category,
    books: books.filter(book => book.category === category),
  }));

  return (
    <div className={`rounded-2xl overflow-hidden border border-[var(--border)] bg-[var(--background-card)]
                     shadow-sm hover:shadow-md transition-shadow duration-300`}>
      {/* Header del testamento */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-5 flex items-center gap-4 text-left"
      >
        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${gradientFrom} ${gradientTo}
                        flex items-center justify-center shadow-lg`}>
          {isOld ? (
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
          ) : (
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
            </svg>
          )}
        </div>
        
        <div className="flex-1">
          <h2 className="text-xl font-bold text-[var(--foreground)]">{name}</h2>
          <p className="text-sm text-[var(--foreground-muted)]">
            {books.length} libros
          </p>
        </div>
        
        <div className={`w-8 h-8 rounded-full ${categoryBg} flex items-center justify-center
                        transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
          <svg className={`w-5 h-5 ${categoryText}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Lista de libros por categoría */}
      <div className={`overflow-hidden transition-all duration-500 ease-out
                      ${isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="px-5 pb-5 space-y-3">
          {booksByCategory.map(({ category, books: categoryBooks }) => (
            <div key={category} className="border border-[var(--border)] rounded-xl overflow-hidden">
              <button
                onClick={() => setExpandedCategory(expandedCategory === category ? null : category)}
                className={`w-full px-4 py-3 flex items-center justify-between text-left
                           ${categoryBg} transition-colors`}
              >
                <span className={`font-semibold ${categoryText}`}>{category}</span>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-medium ${categoryText} opacity-75`}>
                    {categoryBooks.length} libros
                  </span>
                  <svg 
                    className={`w-4 h-4 ${categoryText} transition-transform duration-200
                               ${expandedCategory === category ? 'rotate-180' : ''}`}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>
              
              <div className={`transition-all duration-300 ease-out
                              ${expandedCategory === category ? 'max-h-[1000px]' : 'max-h-0'} overflow-hidden`}>
                <div className="p-2 grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {categoryBooks.map((book, index) => (
                    <Link
                      key={book.id}
                      href={`/libro/${book.id}`}
                      className="p-3 rounded-lg bg-[var(--background)] hover:bg-[var(--border)]
                                transition-all duration-200 group animate-fade-in"
                      style={{ animationDelay: `${index * 30}ms` }}
                    >
                      <div className="flex items-center gap-2">
                        <span className={`w-8 h-8 rounded-lg ${badgeBg} ${badgeText}
                                        flex items-center justify-center text-xs font-bold
                                        group-hover:scale-110 transition-transform`}>
                          {book.abbreviation}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-sm truncate text-[var(--foreground)]">
                            {book.name}
                          </p>
                          <p className="text-xs text-[var(--foreground-muted)]">
                            {book.chapters} cap.
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
