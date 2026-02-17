'use client';

import { useRef, useEffect } from 'react';

export default function ThemeToggle() {
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // Mostrar el botón después del montaje
    if (buttonRef.current) {
      buttonRef.current.style.visibility = 'visible';
    }
  }, []);

  const toggleTheme = () => {
    const isDark = document.documentElement.classList.contains('dark');
    const newTheme = isDark ? 'light' : 'dark';
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  return (
    <button
      ref={buttonRef}
      onClick={toggleTheme}
      style={{ visibility: 'hidden' }}
      className="flex items-center justify-center w-10 h-10 rounded-full 
                 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
      aria-label="Cambiar tema"
      title="Cambiar tema"
    >
      {/* Icono sol - visible en modo oscuro */}
      <svg 
        className="w-5 h-5 text-amber-400 hidden dark:block" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" 
        />
      </svg>
      {/* Icono luna - visible en modo claro */}
      <svg 
        className="w-5 h-5 text-slate-600 block dark:hidden" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" 
        />
      </svg>
    </button>
  );
}
