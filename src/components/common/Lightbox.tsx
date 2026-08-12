import { useCallback, useEffect, useState, useRef } from 'react';

interface LightboxProps {
  isOpen: boolean;
  images: string[];
  startIndex: number;
  name?: string;
  onClose: () => void;
}

export default function Lightbox({ isOpen, images, startIndex, name = '', onClose }: LightboxProps) {
  const [index, setIndex] = useState(startIndex);
  const touchStartX = useRef(0);
  const isSwiping = useRef(false);

  useEffect(() => {
    if (isOpen) {
      setIndex(startIndex);
    }
  }, [isOpen, startIndex]);

  const length = images.length;
  const hasMultiple = length > 1;

  const goTo = useCallback((i: number) => {
    setIndex(((i % length) + length) % length);
  }, [length]);

  const goPrev = useCallback(() => goTo(index - 1), [index, goTo]);
  const goNext = useCallback(() => goTo(index + 1), [index, goTo]);

  // Закрытие по Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'ArrowRight') goNext();
    };
    document.addEventListener('keydown', handleKeyDown);
    // Блокировка прокрутки фона
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, onClose, goPrev, goNext]);

  if (!isOpen) return null;

  const src = images[index];
  const isVideo = src.endsWith('.mp4');

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.changedTouches[0].screenX;
    isSwiping.current = true;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isSwiping.current) return;
    isSwiping.current = false;
    const diff = touchStartX.current - e.changedTouches[0].screenX;
    if (Math.abs(diff) > 30) {
      if (diff > 0) goNext();
      else goPrev();
    }
  };

  return (
    <div className="lightbox" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
      <div className="lightbox__overlay" onClick={onClose} />
      <button className="lightbox__close" type="button" onClick={onClose} aria-label="Закрыть">×</button>

      {hasMultiple && (
        <>
          <button className="lightbox__btn lightbox__btn--prev" type="button" onClick={goPrev} aria-label="Предыдущее фото">‹</button>
          <button className="lightbox__btn lightbox__btn--next" type="button" onClick={goNext} aria-label="Следующее фото">›</button>
        </>
      )}

      <div className="lightbox__stage">
        {isVideo ? (
          <video src={src} controls autoPlay muted loop playsInline />
        ) : (
          <img src={src} alt={`${name} фото ${index + 1}`} />
        )}
      </div>

      {hasMultiple && (
        <div className="lightbox__counter">
          {index + 1} / {length}
        </div>
      )}
    </div>
  );
}