'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { searchBooks, Book } from '@/data/bible';

interface SearchResult {
  type: 'book';
  book: Book;
}

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (query.trim().length > 0) {
      const books = searchBooks(query);
      setResults(books.slice(0, 8).map(book => ({ type: 'book', book })));
      setIsOpen(true);
      setSelectedIndex(-1);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || results.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => (prev < results.length - 1 ? prev + 1 : 0));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : results.length - 1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleSelect(results[selectedIndex]);
        } else if (results.length > 0) {
          handleSelect(results[0]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        inputRef.current?.blur();
        break;
    }
  };

  const handleSelect = (result: SearchResult) => {
    router.push(`/libro/${result.book.id}`);
    setQuery('');
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--foreground-muted)]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => query.trim() && setIsOpen(true)}
          placeholder="Buscar libro..."
          className="w-full pl-10 pr-4 py-2.5 bg-[var(--background-card)] border border-[var(--border)] 
                     rounded-xl text-[var(--foreground)] placeholder:text-[var(--foreground-muted)]
                     focus:outline-none focus:ring-2 focus:ring-[var(--primary-400)] focus:border-transparent
                     transition-all duration-200"
        />
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-[var(--background-card)] 
                        border border-[var(--border)] rounded-xl shadow-lg overflow-hidden z-50
                        animate-scale-in">
          {results.map((result, index) => (
            <button
              key={result.book.id}
              onClick={() => handleSelect(result)}
              className={`w-full px-4 py-3 flex items-center gap-3 text-left transition-colors
                         ${selectedIndex === index 
                           ? 'bg-[var(--primary-100)] dark:bg-[var(--primary-900)]' 
                           : 'hover:bg-[var(--border)]'}`}
            >
              <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium
                               ${result.book.testament === 'old' 
                                 ? 'bg-[var(--accent-old-light)] text-[var(--accent-old)]' 
                                 : 'bg-[var(--accent-new-light)] text-[var(--accent-new)]'}`}>
                {result.book.abbreviation}
              </span>
              <div>
                <p className="font-medium text-[var(--foreground)]">{result.book.name}</p>
                <p className="text-xs text-[var(--foreground-muted)]">
                  {result.book.chapters} capítulos · {result.book.category}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}

      {isOpen && query.trim() && results.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 p-4 bg-[var(--background-card)] 
                        border border-[var(--border)] rounded-xl shadow-lg text-center
                        text-[var(--foreground-muted)] animate-scale-in">
          No se encontraron resultados
        </div>
      )}
    </div>
  );
}
