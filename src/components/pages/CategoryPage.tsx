import { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../common/Header';
import BurgerMenu from '../common/BurgerMenu';
import SearchPanel from '../common/SearchPanel';
import FiltersPanel from '../common/FiltersPanel';
import Carousel from '../common/Carousel';
import allCards from '../../data/cards';
import type { CardData } from '../../types';

interface CategoryPageProps {
  title: string;
  description: string;
  bannerImg: string;
  breadcrumbLabel: string;
  categoryPage: string;
  thematical?: boolean;
}

export default function CategoryPage({
  title,
  description,
  bannerImg,
  breadcrumbLabel,
  categoryPage,
  thematical = false,
}: CategoryPageProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearchToggle = useCallback(() => {
    setFiltersOpen(false);
    setSearchOpen(true);
  }, []);

  const handleFilterToggle = useCallback(() => {
    setSearchOpen(false);
    setFiltersOpen(true);
  }, []);

  const cards = useMemo(
    () => allCards.filter((card) => card.page === categoryPage),
    [categoryPage]
  );

  const handleDetail = useCallback((cardName: string) => {
    navigate(`/detail?name=${encodeURIComponent(cardName)}&from=${encodeURIComponent(categoryPage)}`);
  }, [navigate, categoryPage]);

  const pageClass = thematical ? 'page thematical' : 'page';

  return (
    <div className={pageClass}>
      <Header
        bannerImg={bannerImg}
        bannerAlt={`${title} background`}
        breadcrumb={
          <nav className="global__breadcrumbs" aria-label="Breadcrumb">
            <a href="/" onClick={(e) => { e.preventDefault(); navigate('/'); }}>Главная</a>
            <span className="global__breadcrumbs-sep">/</span>
            <span>{breadcrumbLabel}</span>
          </nav>
        }
        onBurgerClick={() => setMenuOpen(true)}
        onSearchClick={handleSearchToggle}
        onFilterClick={handleFilterToggle}
      />

      <BurgerMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} onSearchClick={handleSearchToggle} onFilterClick={handleFilterToggle} />
      <SearchPanel isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <FiltersPanel isOpen={filtersOpen} onClose={() => setFiltersOpen(false)} />

      <section className="global__intro">
        <div className="global__intro-inner">
          <h2 className="global__intro-title">{title}</h2>
          <p className="global__intro-text">{description}</p>
        </div>
      </section>

      <section className="global__cards">
        {cards.map((card, i) => (
          <CategoryCard key={`${card.name}-${i}`} card={card} onDetail={handleDetail} />
        ))}
      </section>

      <footer className="global__footer">
        <p className="global__footer-copyright">© 2026 Anich Cakes</p>
      </footer>
    </div>
  );
}

function CategoryCard({ card, onDetail }: { card: CardData; onDetail: (name: string) => void }) {
  return (
    <article className="global__card">
      <Carousel images={card.images} name={card.name} />
      <div className="global__card-body">
        <div className="global__card-name" dangerouslySetInnerHTML={{ __html: card.name.replace(/\n/g, '<br>') }} />
        <div className="global__card-calories">{card.calories}</div>
        <div className="global__card-description">{card.description}</div>
        <button className="detail-card__button" type="button" onClick={() => onDetail(card.name)}>
          Подробнее
        </button>
      </div>
    </article>
  );
}
