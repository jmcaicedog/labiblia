'use client';

import Link from 'next/link';
import { Book } from '@/data/bible';

interface ChapterGridProps {
  book: Book;
}

export default function ChapterGrid({ book }: ChapterGridProps) {
  const isOld = book.testament === 'old';
  const accentBg = isOld ? 'bg-amber-500' : 'bg-emerald-500';
  const hoverBg = isOld ? 'hover:bg-amber-50 dark:hover:bg-amber-950' : 'hover:bg-emerald-50 dark:hover:bg-emerald-950';
  const hoverText = isOld ? 'hover:text-amber-700 dark:hover:text-amber-400' : 'hover:text-emerald-700 dark:hover:text-emerald-400';

  const chapters = Array.from({ length: book.chapters }, (_, i) => i + 1);

  return (
    <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
      {chapters.map((chapter, index) => (
        <Link
          key={chapter}
          href={`/libro/${book.id}/${chapter}`}
          className={`aspect-square flex items-center justify-center rounded-xl
                     border border-[var(--border)] bg-[var(--background-card)]
                     font-medium text-[var(--foreground)] ${hoverBg} ${hoverText}
                     transition-all duration-200 hover:scale-105 hover:shadow-md
                     animate-fade-in`}
          style={{ animationDelay: `${Math.min(index * 15, 500)}ms` }}
        >
          {chapter}
        </Link>
      ))}
    </div>
  );
}
