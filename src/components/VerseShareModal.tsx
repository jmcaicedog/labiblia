'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import NextImage from 'next/image';
import { createPortal } from 'react-dom';

interface VerseShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  reference: string;
  quoteText: string;
  shareUrl: string;
}

const SHARE_BACKGROUNDS = Array.from({ length: 10 }, (_, i) => `/images/social/share-${String(i + 1).padStart(2, '0')}.jpg`);

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function wrapLines(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = '';

  for (const word of words) {
    const test = current ? `${current} ${word}` : word;
    if (ctx.measureText(test).width <= maxWidth) {
      current = test;
    } else {
      if (current) lines.push(current);
      current = word;
    }
  }

  if (current) lines.push(current);
  return lines;
}

export default function VerseShareModal({
  isOpen,
  onClose,
  reference,
  quoteText,
  shareUrl,
}: VerseShareModalProps) {
  const [selectedBackground, setSelectedBackground] = useState(SHARE_BACKGROUNDS[0]);
  const [textPosition, setTextPosition] = useState(48);
  const [fontScale, setFontScale] = useState(54);
  const [status, setStatus] = useState<'idle' | 'working' | 'copied' | 'error'>('idle');
  const modalRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen || typeof document === 'undefined') return;

    const previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    requestAnimationFrame(() => {
      modalRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });

    return () => {
      document.body.style.overflow = previousBodyOverflow;
    };
  }, [isOpen]);

  const previewStyle = useMemo(
    () => ({
      backgroundImage: `linear-gradient(to top, rgba(0,0,0,.7), rgba(0,0,0,.25) 45%, rgba(0,0,0,.55)), url('${selectedBackground}')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }),
    [selectedBackground],
  );

  const composeImageBlob = async (): Promise<Blob> => {
    const width = 1080;
    const height = 1920;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('No se pudo inicializar el canvas');
    }

    const image = await loadImage(selectedBackground);
    ctx.drawImage(image, 0, 0, width, height);

    const overlay = ctx.createLinearGradient(0, 0, 0, height);
    overlay.addColorStop(0, 'rgba(0, 0, 0, 0.55)');
    overlay.addColorStop(0.45, 'rgba(0, 0, 0, 0.25)');
    overlay.addColorStop(1, 'rgba(0, 0, 0, 0.78)');
    ctx.fillStyle = overlay;
    ctx.fillRect(0, 0, width, height);

    const textBoxWidth = width - 180;
    const startY = (height * textPosition) / 100;
    const lineHeight = fontScale * 1.34;
    const text = `"${quoteText}"`;

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = 'rgba(0,0,0,0.45)';
    ctx.shadowBlur = 12;

    ctx.font = `600 ${fontScale}px Georgia, 'Times New Roman', serif`;
    let lines = wrapLines(ctx, text, textBoxWidth);
    const maxLines = 11;

    if (lines.length > maxLines) {
      lines = lines.slice(0, maxLines);
      const lastLine = lines[maxLines - 1] || '';
      lines[maxLines - 1] = lastLine.replace(/[.,;:!?]?$/, '...');
    }

    const totalHeight = lines.length * lineHeight;
    let y = startY - totalHeight / 2;

    for (const line of lines) {
      ctx.fillText(line, width / 2, y, textBoxWidth);
      y += lineHeight;
    }

    ctx.shadowBlur = 0;
    ctx.font = '600 42px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = '#f7f7f7';
    ctx.fillText(reference, width / 2, height - 190, width - 180);

    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('No se pudo exportar la imagen'));
            return;
          }
          resolve(blob);
        },
        'image/jpeg',
        0.82,
      );
    });
  };

  const handleDownload = async () => {
    try {
      setStatus('working');
      const blob = await composeImageBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${reference.replace(/\s+/g, '-').toLowerCase()}.jpg`;
      a.click();
      URL.revokeObjectURL(url);
      setStatus('copied');
    } catch {
      setStatus('error');
    }
  };

  const handleNativeShare = async () => {
    try {
      setStatus('working');
      const blob = await composeImageBlob();
      const file = new File([blob], `${reference.replace(/\s+/g, '-').toLowerCase()}.jpg`, {
        type: 'image/jpeg',
      });

      const hasShare = typeof navigator !== 'undefined' && typeof navigator.share === 'function';
      const hasCanShare = typeof navigator !== 'undefined' && typeof navigator.canShare === 'function';
      const canShareFile = hasCanShare ? navigator.canShare({ files: [file] }) : false;

      if (hasShare && canShareFile) {
        await navigator.share({
          title: reference,
          text: `${reference}\n${shareUrl}`,
          files: [file],
        });
        setStatus('copied');
        return;
      }

      await handleDownload();
    } catch {
      setStatus('error');
    }
  };

  const handleWhatsApp = () => {
    const text = encodeURIComponent(`${reference}\n${shareUrl}`);
    window.open(`https://wa.me/?text=${text}`, '_blank', 'noopener,noreferrer');
  };

  if (!isOpen || typeof document === 'undefined') return null;

  const modalContent = (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-3 sm:p-4">
      <div className="absolute inset-0 bg-black/65" onClick={onClose} />

      <div
        ref={modalRef}
        className="relative w-full max-w-2xl max-h-[92vh] bg-[var(--background-card)] border border-[var(--border)]
                      rounded-2xl shadow-xl overflow-hidden animate-scale-in"
      >
        <div className="p-4 border-b border-[var(--border)] flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-[var(--foreground)]">Compartir cita</h3>
            <p className="text-xs text-[var(--foreground-muted)]">Fondo + posición del texto</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full hover:bg-[var(--border)] transition-colors"
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>

        <div className="px-5 py-4 sm:px-6 overflow-y-auto max-h-[66vh] sm:max-h-[72vh]">
          <div
            ref={previewRef}
            className="relative mx-auto w-[calc(100%-1.5rem)] sm:w-[calc(100%-2rem)] aspect-[9/16] rounded-xl overflow-hidden border border-[var(--border)]"
            style={previewStyle}
          >
            <div className="absolute inset-0 px-6 text-center text-white" style={{ top: `${textPosition}%`, transform: 'translateY(-50%)' }}>
              <p className="font-semibold drop-shadow-lg" style={{ fontSize: `${Math.round(fontScale / 4)}px`, lineHeight: 1.35 }}>
                {`"${quoteText}"`}
              </p>
              <p className="mt-3 text-sm font-medium opacity-95">{reference}</p>
            </div>

            <div className="absolute inset-x-3 bottom-3 z-20 rounded-xl border border-white/20 bg-black/45 p-3 text-white shadow-lg backdrop-blur-md">
              <div className="space-y-3">
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-wide text-white/85">Fondo</p>
                  <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
                    {SHARE_BACKGROUNDS.map((bg) => (
                      <button
                        key={bg}
                        type="button"
                        onClick={() => setSelectedBackground(bg)}
                        className={`relative h-16 w-10 shrink-0 rounded-md border overflow-hidden ${selectedBackground === bg ? 'border-white ring-2 ring-white/60' : 'border-white/30'}`}
                        aria-label="Seleccionar fondo"
                      >
                        <NextImage src={bg} alt="Fondo para cita" fill className="object-cover" sizes="40px" />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <div className="flex items-center justify-between text-[11px] font-medium text-white/85">
                      <span>Posición</span>
                      <span>{textPosition}%</span>
                    </div>
                    <input
                      type="range"
                      min={30}
                      max={72}
                      value={textPosition}
                      onChange={(e) => setTextPosition(Number(e.target.value))}
                      className="w-full accent-white"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-[11px] font-medium text-white/85">
                      <span>Tamaño</span>
                      <span>{fontScale}</span>
                    </div>
                    <input
                      type="range"
                      min={42}
                      max={66}
                      value={fontScale}
                      onChange={(e) => setFontScale(Number(e.target.value))}
                      className="w-full accent-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-[var(--border)]">
          <div className="flex items-center justify-center gap-3">
            <div className="relative group">
              <button
                type="button"
                onClick={handleNativeShare}
                aria-label="Compartir (Instagram/WhatsApp)"
                title="Compartir (Instagram/WhatsApp)"
                className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-[var(--primary-500)] text-white hover:opacity-90 transition"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l5-5m0 0l5 5m-5-5v12M5 21h14" />
                </svg>
              </button>
              <span className="hidden sm:block pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-black/80 px-2 py-1 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity">
                Compartir
              </span>
            </div>

            <div className="relative group">
              <button
                type="button"
                onClick={handleWhatsApp}
                aria-label="WhatsApp (texto + enlace)"
                title="WhatsApp (texto + enlace)"
                className="inline-flex items-center justify-center w-11 h-11 rounded-full border border-[var(--border)] hover:bg-[var(--border)] transition"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.5 10.5h.01M12 10.5h.01M15.5 10.5h.01M7 18l-3 2 1.2-3.6A8 8 0 1119 6a8 8 0 01-12 12z" />
                </svg>
              </button>
              <span className="hidden sm:block pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-black/80 px-2 py-1 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity">
                WhatsApp
              </span>
            </div>

            <div className="relative group">
              <button
                type="button"
                onClick={handleDownload}
                aria-label="Descargar imagen"
                title="Descargar imagen"
                className="inline-flex items-center justify-center w-11 h-11 rounded-full border border-[var(--border)] hover:bg-[var(--border)] transition"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v12m0 0l-4-4m4 4l4-4M5 21h14" />
                </svg>
              </button>
              <span className="hidden sm:block pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-black/80 px-2 py-1 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity">
                Descargar
              </span>
            </div>
          </div>
        </div>

        {status !== 'idle' && (
          <div className="px-4 pb-4 text-xs text-[var(--foreground-muted)]">
            {status === 'working' && 'Preparando imagen...'}
            {status === 'copied' && 'Acción completada.'}
            {status === 'error' && 'No se pudo completar la acción. Intenta de nuevo.'}
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
