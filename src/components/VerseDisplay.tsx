'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Book } from '@/data/bible';

interface Verse {
  verse: number;
  text: string;
}

interface VerseDisplayProps {
  book: Book;
  chapter: number;
}

export default function VerseDisplay({ book, chapter }: VerseDisplayProps) {
  const [verses, setVerses] = useState<Verse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVerse, setSelectedVerse] = useState<number | null>(null);

  useEffect(() => {
    const fetchVerses = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Usar proxy local para evitar CORS
        const response = await fetch(`/api/proxy/${book.id}/${chapter}`);
        
        if (!response.ok) {
          throw new Error('Error al cargar versículos');
        }
        
        const data = await response.json();
        setVerses(data.verses || []);
      } catch (err) {
        console.error('Error fetching verses:', err);
        setError('No se pudieron cargar los versículos. Verifica la conexión con la API.');
        setVerses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchVerses();
  }, [book.id, chapter]);

  const isOld = book.testament === 'old';
  const accentText = isOld ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400';

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="animate-pulse flex gap-3">
            <div className="w-8 h-6 bg-[var(--border)] rounded" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-[var(--border)] rounded w-full" />
              <div className="h-4 bg-[var(--border)] rounded w-3/4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {error && (
        <div className="mb-4 p-3 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 
                        rounded-lg text-amber-700 dark:text-amber-300 text-sm">
          <p className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </p>
        </div>
      )}
      
      {verses.map((verse, index) => (
        <p
          key={verse.verse}
          onClick={() => setSelectedVerse(selectedVerse === verse.verse ? null : verse.verse)}
          className={`py-2 px-3 rounded-lg cursor-pointer transition-all duration-200
                     ${selectedVerse === verse.verse 
                       ? 'bg-[var(--primary-100)] dark:bg-[var(--primary-900)]' 
                       : 'hover:bg-[var(--border)]'}
                     animate-fade-in`}
          style={{ animationDelay: `${Math.min(index * 20, 400)}ms` }}
        >
          <span className={`font-bold ${accentText} mr-2 select-none`}>
            {verse.verse}
          </span>
          <span className="text-[var(--foreground)] leading-relaxed">
            {verse.text}
          </span>
        </p>
      ))}

      {/* Navegación entre capítulos */}
      <div className="flex justify-between items-center pt-6 mt-6 border-t border-[var(--border)]">
        {chapter > 1 ? (
          <Link
            href={`/libro/${book.id}/${chapter - 1}`}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--background-card)]
                       border border-[var(--border)] hover:bg-[var(--border)] transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Capítulo {chapter - 1}
          </Link>
        ) : (
          <div />
        )}
        
        {chapter < book.chapters ? (
          <Link
            href={`/libro/${book.id}/${chapter + 1}`}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--background-card)]
                       border border-[var(--border)] hover:bg-[var(--border)] transition-colors"
          >
            Capítulo {chapter + 1}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
}
