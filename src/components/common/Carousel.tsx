import { useState, useRef, useEffect, useCallback } from 'react';

interface CarouselProps {
  images: string[];
  name?: string;
  className?: string;
}

export default function Carousel({ images, name = '', className = '' }: CarouselProps) {
  const [current, setCurrent] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const isSwiping = useRef(false);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const slides = images;
  const hasMultiple = slides.length > 1;

  const updateCarousel = useCallback((index: number) => {
    if (trackRef.current) {
      trackRef.current.style.transform = `translateX(-${index * 100}%)`;
    }
  }, []);

  const manageVideos = useCallback((activeIndex: number) => {
    videoRefs.current.forEach((video, i) => {
      if (!video) return;
      if (i === activeIndex) {
        video.currentTime = 0;
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
  }, []);

  const goTo = useCallback((index: number) => {
    const newIndex = ((index % slides.length) + slides.length) % slides.length;
    setCurrent(newIndex);
    updateCarousel(newIndex);
    manageVideos(newIndex);
  }, [slides.length, updateCarousel, manageVideos]);

  const goPrev = useCallback(() => goTo(current - 1), [current, goTo]);
  const goNext = useCallback(() => goTo(current + 1), [current, goTo]);

  useEffect(() => {
    updateCarousel(current);
    manageVideos(current);
  }, [current, updateCarousel, manageVideos]);

  useEffect(() => {
    // Запуск видео на первом слайде при монтировании
    manageVideos(0);
  }, [manageVideos]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.changedTouches[0].screenX;
    isSwiping.current = true;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isSwiping.current) return;
    touchEndX.current = e.changedTouches[0].screenX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isSwiping.current) return;
    isSwiping.current = false;
    touchEndX.current = e.changedTouches[0].screenX;
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 30) {
      if (diff > 0) goNext();
      else goPrev();
    }
  };

  return (
    <div className={`global__carousel ${className}`} data-current={current}>
      <div
        className="global__carousel-track"
        ref={trackRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {slides.map((src, i) => (
          <div className="global__carousel-slide" key={i}>
            {src.endsWith('.mp4') ? (
              <video
                ref={(el) => { videoRefs.current[i] = el; }}
                src={src}
                muted
                loop
                playsInline
                autoPlay
              />
            ) : (
              <img src={src} alt={`${name} фото ${i + 1}`} loading="lazy" decoding="async" />
            )}
          </div>
        ))}
      </div>
      {hasMultiple && (
        <>
          <button className="global__carousel-btn global__carousel-btn--prev" type="button" onClick={goPrev}>‹</button>
          <button className="global__carousel-btn global__carousel-btn--next" type="button" onClick={goNext}>›</button>
        </>
      )}
      <div className="global__carousel-dots">
        {slides.map((_, i) => (
          <button
            key={i}
            className={`global__carousel-dot ${i === current ? 'global__carousel-dot--active' : ''}`}
            type="button"
            onClick={() => goTo(i)}
          />
        ))}
      </div>
    </div>
  );
}