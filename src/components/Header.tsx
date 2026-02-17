'use client';

import Link from 'next/link';
import SearchBar from './SearchBar';
import ThemeToggle from './ThemeToggle';

interface HeaderProps {
  showSearch?: boolean;
  title?: string;
  backHref?: string;
}

export default function Header({ showSearch = true, title, backHref }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-[var(--background)]/80 backdrop-blur-lg border-b border-[var(--border)]">
      <div className="max-w-4xl mx-auto px-4 py-3">
        <div className="flex items-center gap-4">
          {backHref ? (
            <Link 
              href={backHref}
              className="flex items-center justify-center w-10 h-10 rounded-full 
                         hover:bg-[var(--border)] transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
          ) : (
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <div className="w-10 h-10 bg-gradient-to-br from-[var(--primary-400)] to-[var(--primary-600)] 
                              rounded-xl flex items-center justify-center shadow-md">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <span className="font-semibold text-lg hidden sm:block">La Biblia</span>
            </Link>
          )}
          
          {title && (
            <h1 className="font-semibold text-lg truncate flex-1">{title}</h1>
          )}
          
          {showSearch && (
            <div className="flex-1 flex justify-end items-center gap-2">
              <SearchBar />
              <ThemeToggle />
            </div>
          )}
          
          {!showSearch && <ThemeToggle />}
        </div>
      </div>
    </header>
  );
}
