import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../common/Header';
import BurgerMenu from '../common/BurgerMenu';
import SearchPanel from '../common/SearchPanel';
import FiltersPanel from '../common/FiltersPanel';
import Footer from '../common/Footer';

const categories = [
  { title: 'НИЗКОКАЛОРИЙНЫЕ', desc: 'Полезные десерты без белой муки и сахара', img: '/anich_cakes/img/card-img-1.jpg', link: '/low-calories', white: false },
  { title: 'ЖИВЫЕ', desc: 'Raw десерты без термической обработки', img: '/anich_cakes/img/card-img-2.jpg', link: '/raw', white: true },
  { title: 'ВЕГАНСКИЕ', desc: 'Без продуктов животного происхождения', img: '/anich_cakes/img/card-img-3.jpg', link: '/vegan', white: true },
  { title: 'ТРАДИЦИОННЫЕ', desc: 'Знакомые с детства вкусы', img: '/anich_cakes/img/card-img-4.jpg', link: '/traditional', white: true },
  { title: 'ТЕМАТИЧЕСКИЕ', desc: 'Десерты с украшением к праздникам', img: '/anich_cakes/img/card-img-5.jpg', link: '/thematical', white: true },
  { title: 'ШОКОЛАДНЫЕ', desc: 'Для любителей шоколада', img: '/anich_cakes/img/card-img-6.jpg', link: '/chocolate', white: true },
];

export default function HomePage() {
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

  return (
    <main className="page">
      <Header
        bannerImg="/anich_cakes/img/berry_header.jpg"
        bannerAlt="Berry dessert background"
        onBurgerClick={() => setMenuOpen(true)}
        onSearchClick={handleSearchToggle}
        onFilterClick={handleFilterToggle}
      />

      <BurgerMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} onSearchClick={handleSearchToggle} onFilterClick={handleFilterToggle} />
      <SearchPanel isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <FiltersPanel isOpen={filtersOpen} onClose={() => setFiltersOpen(false)} />

      <section className="intro">
        <div className="intro__inner">
          <h1 className="intro__title">Десерты с полезным составом</h1>
          <p className="global__intro-text">Десерты, которые несут максимум пользы благодаря полностью натуральному составу и подходят тем, кто избирательно подходит к питанию</p>
        </div>
      </section>

      <section className="products">
        <div className="products__grid">
          {categories.map((cat) => (
            <article className="product-card" key={cat.title}>
              <img className="product-card__img" src={cat.img} alt="" />
              <div className={`product-card__body ${cat.white ? 'title-white' : ''}`}>
                <div className="product-card__title">{cat.title}</div>
                <div className="product-card__description">{cat.desc}</div>
                <button className="product-card__button" type="button" onClick={() => navigate(cat.link)}>
                  Выбрать
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="global__intro">
        <div className="global__intro-inner">
          <p className="global__intro-text">Здесь вы найдете десерты, которые подходят аллергикам, постящимся, вегетарианцам и веганам, да и просто тем, кто придерживается здорового питания. При этом каждый десерт обладает полноценным сбалансированным вкусом</p>
        </div>
      </section>

      <Footer />
    </main>
  );
}
