import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[var(--background)] flex items-center justify-center p-4">
      <div className="text-center max-w-md animate-fade-in">
        <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-[var(--primary-400)] to-[var(--primary-600)] 
                        rounded-2xl flex items-center justify-center shadow-lg">
          <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        
        <h1 className="text-4xl font-bold text-[var(--foreground)] mb-2">404</h1>
        <h2 className="text-xl font-semibold text-[var(--foreground)] mb-4">
          Página no encontrada
        </h2>
        <p className="text-[var(--foreground-muted)] mb-8">
          El libro o capítulo que buscas no existe. Verifica la dirección o vuelve al inicio.
        </p>
        
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[var(--primary-500)] 
                     to-[var(--primary-600)] text-white font-medium rounded-xl shadow-lg
                     hover:shadow-xl hover:scale-105 transition-all duration-200"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
