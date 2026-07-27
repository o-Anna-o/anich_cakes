import { Link } from 'react-router-dom';
import { useStickyHeader } from '../../hooks/useStickyHeader';

interface HeaderProps {
  bannerImg?: string;
  bannerAlt?: string;
  breadcrumb?: React.ReactNode;
  onBurgerClick: () => void;
  onSearchClick: () => void;
  onFilterClick: () => void;
}

export default function Header({
  bannerImg,
  bannerAlt = 'Hero image',
  breadcrumb,
  onBurgerClick,
  onSearchClick,
  onFilterClick,
}: HeaderProps) {
  const { setHeaderRef, setBannerRef } = useStickyHeader();

  return (
    <section className="banner" aria-label="Hero image" ref={setBannerRef}>
      {bannerImg && (
        <div className="banner__image">
          <picture>
            {/* На экранах >= 601px показываем berry_header_wide.jpg на всех страницах */}
            <source media="(min-width: 601px)" srcSet="/anich_cakes/img/berry_header_wide.jpg" />
            {/* На экранах < 601px показываем баннер категории */}
            <img className="banner__img" src={bannerImg} alt={bannerAlt} />
          </picture>
        </div>
      )}
      <header className="banner__header" ref={setHeaderRef}>
        <div className="left-icons">
          <a href="#" className="banner__burger" id="burgerBtn" onClick={(e) => { e.preventDefault(); onBurgerClick(); }}>
            <img className="banner__logo" src="/anich_cakes/img/burger.svg" alt="menu" />
          </a>
          {breadcrumb}
        </div>
        <div className="right-icons">
          <a href="#" className="banner__header-icon" id="searchBtn" aria-label="Поиск" onClick={(e) => { e.preventDefault(); onSearchClick(); }}>
            <img src="/anich_cakes/img/search.svg" alt="Поиск" />
          </a>
          <a href="#" className="banner__header-icon" id="filterBtn" aria-label="Фильтр" onClick={(e) => { e.preventDefault(); onFilterClick(); }}>
            <img src="/anich_cakes/img/filter.svg" alt="Фильтр" />
          </a>
          <Link to="/">
            <h1 className="banner__title">Anich Cakes</h1>
          </Link>
        </div>
      </header>
    </section>
  );
}
