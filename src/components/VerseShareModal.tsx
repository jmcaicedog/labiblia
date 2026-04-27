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

    ctx.font = '500 30px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    ctx.fillText('labiblia.app', width / 2, height - 120, width - 180);

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

        <div className="p-4 space-y-4 overflow-y-auto max-h-[72vh]">
          <div
            ref={previewRef}
            className="relative w-full aspect-[9/16] rounded-xl overflow-hidden border border-[var(--border)]"
            style={previewStyle}
          >
            <div className="absolute inset-0 px-6 text-center text-white" style={{ top: `${textPosition}%`, transform: 'translateY(-50%)' }}>
              <p className="font-semibold drop-shadow-lg" style={{ fontSize: `${Math.round(fontScale / 4)}px`, lineHeight: 1.35 }}>
                {`"${quoteText}"`}
              </p>
              <p className="mt-3 text-sm font-medium opacity-95">{reference}</p>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Fondo</label>
            <div className="grid grid-cols-5 gap-2">
              {SHARE_BACKGROUNDS.map((bg) => (
                <button
                  key={bg}
                  type="button"
                  onClick={() => setSelectedBackground(bg)}
                  className={`relative aspect-[9/16] rounded-md border overflow-hidden ${selectedBackground === bg ? 'border-[var(--primary-500)] ring-2 ring-[var(--primary-300)]' : 'border-[var(--border)]'}`}
                >
                  <NextImage src={bg} alt="Fondo para cita" fill className="object-cover" sizes="80px" />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Posición del texto</label>
            <input
              type="range"
              min={30}
              max={72}
              value={textPosition}
              onChange={(e) => setTextPosition(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Tamaño del texto</label>
            <input
              type="range"
              min={42}
              max={66}
              value={fontScale}
              onChange={(e) => setFontScale(Number(e.target.value))}
              className="w-full"
            />
          </div>
        </div>

        <div className="p-4 border-t border-[var(--border)] grid grid-cols-1 sm:grid-cols-3 gap-2">
          <button
            type="button"
            onClick={handleNativeShare}
            className="px-3 py-2 rounded-lg bg-[var(--primary-500)] text-white hover:opacity-90 transition"
          >
            Compartir (Instagram/WhatsApp)
          </button>
          <button
            type="button"
            onClick={handleWhatsApp}
            className="px-3 py-2 rounded-lg border border-[var(--border)] hover:bg-[var(--border)] transition"
          >
            WhatsApp (texto + enlace)
          </button>
          <button
            type="button"
            onClick={handleDownload}
            className="px-3 py-2 rounded-lg border border-[var(--border)] hover:bg-[var(--border)] transition"
          >
            Descargar imagen
          </button>
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
