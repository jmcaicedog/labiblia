'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import { Book } from '@/data/bible';
import VerseShareModal from './VerseShareModal';

interface Verse {
  verse: number;
  text: string;
}

interface VerseDisplayProps {
  book: Book;
  chapter: number;
}

interface VerseRange {
  start: number;
  end: number;
}

function parseVerseRange(value: string | null): VerseRange | null {
  if (!value) return null;

  if (/^\d+$/.test(value)) {
    const verse = Number(value);
    return verse > 0 ? { start: verse, end: verse } : null;
  }

  const rangeMatch = value.match(/^(\d+)-(\d+)$/);
  if (!rangeMatch) return null;

  const start = Number(rangeMatch[1]);
  const end = Number(rangeMatch[2]);

  if (start <= 0 || end <= 0) return null;

  return {
    start: Math.min(start, end),
    end: Math.max(start, end),
  };
}

function formatVerseRange(range: VerseRange): string {
  return range.start === range.end ? String(range.start) : `${range.start}-${range.end}`;
}

export default function VerseDisplay({ book, chapter }: VerseDisplayProps) {
  const [verses, setVerses] = useState<Verse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [anchorVerse, setAnchorVerse] = useState<number | null>(null);
  const [selectedParam, setSelectedParam] = useState<string | null>(null);
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'error'>('idle');
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const copyStatusTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const selectedRange = useMemo(() => parseVerseRange(selectedParam), [selectedParam]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const syncSelectionFromUrl = () => {
      const url = new URL(window.location.href);
      setSelectedParam(url.searchParams.get('v'));
    };

    syncSelectionFromUrl();
    window.addEventListener('popstate', syncSelectionFromUrl);

    return () => window.removeEventListener('popstate', syncSelectionFromUrl);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    setShareUrl(window.location.href);
  }, [selectedParam, book.id, chapter]);

  useEffect(() => {
    return () => {
      if (copyStatusTimeoutRef.current) {
        clearTimeout(copyStatusTimeoutRef.current);
      }
    };
  }, []);

  const setSelectionInUrl = (range: VerseRange | null) => {
    if (typeof window === 'undefined') return;

    const url = new URL(window.location.href);
    const params = url.searchParams;

    if (range) {
      params.set('v', formatVerseRange(range));
    } else {
      params.delete('v');
    }

    const nextUrl = `${url.pathname}${url.search}`;
    window.history.replaceState(null, '', nextUrl);
    setSelectedParam(params.get('v'));
  };

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

  useEffect(() => {
    setAnchorVerse(selectedRange?.start ?? null);
  }, [selectedRange]);

  useEffect(() => {
    if (!selectedRange) {
      setIsShareModalOpen(false);
    }
  }, [selectedRange]);

  useEffect(() => {
    if (!selectedRange || verses.length === 0) return;

    const selectedVerseElement = document.getElementById(`verse-${selectedRange.start}`);
    if (!selectedVerseElement) return;

    selectedVerseElement.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }, [selectedRange, verses.length]);

  const handleVerseClick = (verseNumber: number, isShiftPressed: boolean) => {
    if (isShiftPressed && anchorVerse !== null) {
      setSelectionInUrl({
        start: Math.min(anchorVerse, verseNumber),
        end: Math.max(anchorVerse, verseNumber),
      });
      return;
    }

    if (!selectedRange) {
      setAnchorVerse(verseNumber);
      setSelectionInUrl({ start: verseNumber, end: verseNumber });
      return;
    }

    if (selectedRange.start === selectedRange.end) {
      if (selectedRange.start === verseNumber) {
        setAnchorVerse(null);
        setSelectionInUrl(null);
      } else {
        setSelectionInUrl({
          start: Math.min(selectedRange.start, verseNumber),
          end: Math.max(selectedRange.end, verseNumber),
        });
      }
      return;
    }

    setAnchorVerse(verseNumber);
    setSelectionInUrl({ start: verseNumber, end: verseNumber });
  };

  const isVerseSelected = (verseNumber: number) => {
    if (!selectedRange) return false;
    return verseNumber >= selectedRange.start && verseNumber <= selectedRange.end;
  };

  const selectedReference = useMemo(() => {
    if (!selectedRange) return '';
    const verseRangeText =
      selectedRange.start === selectedRange.end
        ? `${selectedRange.start}`
        : `${selectedRange.start}-${selectedRange.end}`;

    return `${book.name} ${chapter},${verseRangeText}`;
  }, [book.name, chapter, selectedRange]);

  const selectedQuoteText = useMemo(() => {
    if (!selectedRange) return '';

    return verses
      .filter((verse) => verse.verse >= selectedRange.start && verse.verse <= selectedRange.end)
      .map((verse) => verse.text.trim())
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim();
  }, [selectedRange, verses]);

  const handleCopyLink = async () => {
    if (!selectedRange || typeof window === 'undefined') return;

    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopyStatus('copied');
    } catch {
      setCopyStatus('error');
    }

    if (copyStatusTimeoutRef.current) {
      clearTimeout(copyStatusTimeoutRef.current);
    }

    copyStatusTimeoutRef.current = setTimeout(() => {
      setCopyStatus('idle');
    }, 1800);
  };

  const handleClearSelection = () => {
    if (copyStatusTimeoutRef.current) {
      clearTimeout(copyStatusTimeoutRef.current);
    }

    setCopyStatus('idle');
    setAnchorVerse(null);
    setSelectionInUrl(null);
  };

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

      {selectedRange && (
        <div className="mb-4 p-3 rounded-xl border border-[var(--border)] bg-[var(--background)]
                        flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between animate-fade-in
                        sticky top-[calc(env(safe-area-inset-top)+5.25rem)] sm:top-[5.25rem] z-30
                        backdrop-blur supports-[backdrop-filter]:bg-[var(--background)]/95">
          <p className="text-xs text-[var(--foreground-muted)] sm:hidden">Acciones de cita</p>
          <p className="text-sm text-[var(--foreground)]">
            Selección: <span className="font-semibold">{selectedReference}</span>
          </p>
          <div className="flex items-center gap-2 sm:ml-auto">
            <button
              type="button"
              onClick={() => setIsShareModalOpen(true)}
              aria-label="Compartir cita"
              title="Compartir cita"
              className="inline-flex items-center justify-center w-10 h-10 rounded-lg
                         border border-[var(--border)] bg-[var(--background-card)]
                         hover:bg-[var(--border)] transition-colors text-sm"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l5-5m0 0l5 5m-5-5v12M5 21h14" />
              </svg>
            </button>
            <button
              type="button"
              onClick={handleClearSelection}
              aria-label="Limpiar selección"
              title="Limpiar selección"
              className="inline-flex items-center justify-center w-10 h-10 rounded-lg
                         border border-[var(--border)] bg-[var(--background-card)]
                         hover:bg-[var(--border)] transition-colors text-sm"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <button
              type="button"
              onClick={handleCopyLink}
              aria-label={copyStatus === 'copied' ? 'Enlace copiado' : copyStatus === 'error' ? 'Error al copiar enlace' : 'Copiar enlace'}
              title={copyStatus === 'copied' ? 'Enlace copiado' : copyStatus === 'error' ? 'Error al copiar enlace' : 'Copiar enlace'}
              className={`inline-flex items-center justify-center w-10 h-10 rounded-lg
                         border border-[var(--border)] bg-[var(--background-card)]
                         hover:bg-[var(--border)] transition-colors text-sm
                         ${copyStatus === 'copied' ? 'text-emerald-500' : ''}
                         ${copyStatus === 'error' ? 'text-rose-500' : ''}`}
            >
              {copyStatus === 'copied' ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : copyStatus === 'error' ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v4m0 4h.01M5.07 19h13.86c1.54 0 2.5-1.67 1.73-3L13.73 4c-.77-1.33-2.69-1.33-3.46 0L3.34 16c-.77 1.33.19 3 1.73 3z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2M10 18h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      )}
      
      {verses.map((verse, index) => (
        <p
          id={`verse-${verse.verse}`}
          key={verse.verse}
          onClick={(event) => handleVerseClick(verse.verse, event.shiftKey)}
          className={`py-2 px-3 rounded-lg cursor-pointer transition-all duration-200
                     ${isVerseSelected(verse.verse)
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

      <VerseShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        reference={selectedReference}
        quoteText={selectedQuoteText}
        shareUrl={shareUrl}
      />
    </div>
  );
}
