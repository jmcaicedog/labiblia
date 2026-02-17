'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Book } from '@/data/bible';

interface QuickNavProps {
  book: Book;
  currentChapter: number;
}

export default function QuickNav({ book, currentChapter }: QuickNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const chapters = Array.from({ length: book.chapters }, (_, i) => i + 1);
  const isOld = book.testament === 'old';
  const accentBg = isOld ? 'bg-amber-500' : 'bg-emerald-500';
  const accentBgLight = isOld ? 'bg-amber-100 dark:bg-amber-900' : 'bg-emerald-100 dark:bg-emerald-900';
  const accentText = isOld ? 'text-amber-700 dark:text-amber-300' : 'text-emerald-700 dark:text-emerald-300';

  return (
    <>
      {/* Botón flotante */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 w-14 h-14 ${accentBg} text-white rounded-full 
                   shadow-lg hover:scale-110 transition-transform duration-200 z-40
                   flex items-center justify-center`}
        aria-label="Navegación rápida"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M4 6h16M4 10h16M4 14h16M4 18h16" />
        </svg>
      </button>

      {/* Modal de navegación */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Content */}
          <div className="relative w-full max-w-lg max-h-[80vh] m-4 bg-[var(--background-card)] 
                          rounded-2xl shadow-xl overflow-hidden animate-scale-in">
            {/* Header */}
            <div className="sticky top-0 p-4 border-b border-[var(--border)] bg-[var(--background-card)]
                            flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg">{book.name}</h3>
                <p className="text-sm text-[var(--foreground-muted)]">
                  Selecciona un capítulo
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-10 h-10 rounded-full hover:bg-[var(--border)] 
                           flex items-center justify-center transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Grid de capítulos */}
            <div className="p-4 overflow-y-auto max-h-[60vh]">
              <div className="grid grid-cols-5 sm:grid-cols-6 gap-2">
                {chapters.map(chapter => (
                  <Link
                    key={chapter}
                    href={`/libro/${book.id}/${chapter}`}
                    onClick={() => setIsOpen(false)}
                    className={`aspect-square flex items-center justify-center rounded-xl
                               font-medium transition-all duration-200
                               ${chapter === currentChapter 
                                 ? `${accentBg} text-white shadow-md` 
                                 : `${accentBgLight} ${accentText} hover:scale-105`}`}
                  >
                    {chapter}
                  </Link>
                ))}
              </div>
            </div>
            
            {/* Footer con enlaces rápidos */}
            <div className="sticky bottom-0 p-4 border-t border-[var(--border)] bg-[var(--background-card)]
                            flex gap-2">
              <Link
                href={`/libro/${book.id}`}
                onClick={() => setIsOpen(false)}
                className="flex-1 py-2 px-4 bg-[var(--border)] rounded-lg text-center
                           hover:bg-[var(--foreground-muted)]/20 transition-colors"
              >
                Ver todos los capítulos
              </Link>
              <Link
                href="/"
                onClick={() => setIsOpen(false)}
                className="flex-1 py-2 px-4 bg-[var(--border)] rounded-lg text-center
                           hover:bg-[var(--foreground-muted)]/20 transition-colors"
              >
                Inicio
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
