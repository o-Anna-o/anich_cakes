import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Header from '../common/Header';
import BurgerMenu from '../common/BurgerMenu';
import SearchPanel from '../common/SearchPanel';
import FiltersPanel from '../common/FiltersPanel';
import allCards from '../../data/cards';

const pageNames: Record<string, string> = {
  '/low-calories': 'Низкокалорийные',
  '/raw': 'Живые (Raw)',
  '/vegan': 'Веганские',
  '/traditional': 'Традиционные',
  '/thematical': 'Тематические',
  '/chocolate': 'Шоколадные',
};

export default function DetailPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const trackRef = useRef<HTMLDivElement>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const cardName = searchParams.get('name');
  const fromPage = searchParams.get('from');

  const cardData = useMemo(() => {
    if (!cardName) return null;
    return allCards.find((c) => c.name === cardName) || null;
  }, [cardName]);

  const handleSearchToggle = useCallback(() => {
    setFiltersOpen(false);
    setSearchOpen(true);
  }, []);

  const handleFilterToggle = useCallback(() => {
    setSearchOpen(false);
    setFiltersOpen(true);
  }, []);

  const slides = cardData?.images || [];
  const hasMultiple = slides.length > 1;

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
    setCurrentSlide(newIndex);
    if (trackRef.current) {
      trackRef.current.style.transform = `translateX(-${newIndex * 100}%)`;
    }
    manageVideos(newIndex);
  }, [slides.length, manageVideos]);

  useEffect(() => {
    goTo(0);
  }, [goTo]);

  if (!cardData) {
    return (
      <div className="global page--detail">
        <Header
          onBurgerClick={() => setMenuOpen(true)}
          onSearchClick={handleSearchToggle}
          onFilterClick={handleFilterToggle}
        />
        <BurgerMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} onSearchClick={handleSearchToggle} onFilterClick={handleFilterToggle} />
        <section className="detail-card" id="detailCard">
          <div className="detail-global__text">
            <div className="detail-global__card-name">Десерт не найден</div>
          </div>
        </section>
      </div>
    );
  }

  const breadcrumbPage = fromPage || cardData.page;
  const breadcrumbCategory = pageNames[breadcrumbPage] || cardData.category;

  return (
    <div className="global page--detail">
      <Header
        breadcrumb={
          <nav className="global__breadcrumbs" aria-label="Breadcrumb">
            <a href="/" onClick={(e) => { e.preventDefault(); navigate('/'); }}>Главная</a>
            <span className="global__breadcrumbs-sep">/</span>
            <a href={breadcrumbPage} onClick={(e) => { e.preventDefault(); navigate(breadcrumbPage); }}>
              {breadcrumbCategory}
            </a>
          </nav>
        }
        onBurgerClick={() => setMenuOpen(true)}
        onSearchClick={handleSearchToggle}
        onFilterClick={handleFilterToggle}
      />

      <BurgerMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} onSearchClick={handleSearchToggle} onFilterClick={handleFilterToggle} />
      <SearchPanel isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <FiltersPanel isOpen={filtersOpen} onClose={() => setFiltersOpen(false)} />

      <section className="detail-card" id="detailCard">
        <div className="detail-global__carousel" id="detailCarousel">
          <div className="global__carousel-track" ref={trackRef} id="detailCarouselTrack">
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
                  <img src={src} alt={`${cardData.name} фото ${i + 1}`} />
                )}
              </div>
            ))}
          </div>
          {hasMultiple && (
            <>
              <button className="global__carousel-btn global__carousel-btn--prev" type="button" onClick={() => goTo(currentSlide - 1)}>‹</button>
              <button className="global__carousel-btn global__carousel-btn--next" type="button" onClick={() => goTo(currentSlide + 1)}>›</button>
            </>
          )}
          <div className="global__carousel-dots" id="detailCarouselDots">
            {slides.map((_, i) => (
              <button
                key={i}
                className={`global__carousel-dot ${i === currentSlide ? 'global__carousel-dot--active' : ''}`}
                type="button"
                onClick={() => goTo(i)}
              />
            ))}
          </div>
        </div>

        <div className="detail-global__text">
          <div className="detail-global__card-name" id="detailCardName">{cardData.name}</div>
          <div className="detail-global__card-calories" id="detailCardCalories">{cardData.calories}</div>

          {cardData.filters && cardData.filters.length > 0 && (
            <div className="detail-filters" id="detailFilters">
              {cardData.filters.map((filter, i) => (
                <button key={i} className="detail-filter" type="button">{filter}</button>
              ))}
            </div>
          )}

          <div className="detail-card__info">
            <div className="detail-global__card-description" id="detailCardDescription">
              {cardData.description}
            </div>
          </div>
          <div className="detail-card__content">
            <div className="detail-global__card-content-title">Состав</div>
            <div className="detail-global__card-content" id="detailCardContent">
              {cardData.content || cardData.description}
            </div>
          </div>
        </div>
      </section>

      <footer className="global__footer">
        <p className="global__footer-copyright">© 2026 Anich Cakes</p>
      </footer>
    </div>
  );
}
