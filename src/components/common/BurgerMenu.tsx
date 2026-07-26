import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

interface BurgerMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onSearchClick?: () => void;
  onFilterClick?: () => void;
}

const navLinks = [
  { to: '/', label: 'Главная' },
  { to: '/low-calories', label: 'Низкокалорийные' },
  { to: '/raw', label: 'Живые (Raw)' },
  { to: '/vegan', label: 'Веганские' },
  { to: '/traditional', label: 'Традиционные' },
  { to: '/thematical', label: 'Тематические' },
  { to: '/chocolate', label: 'Шоколадные' },
];

export default function BurgerMenu({ isOpen, onClose, onSearchClick, onFilterClick }: BurgerMenuProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose();
  };

  const handleSearchClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onClose();
    if (onSearchClick) onSearchClick();
  };

  const handleFilterClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onClose();
    if (onFilterClick) onFilterClick();
  };

  return (
    <>
      <div
        ref={overlayRef}
        className={`menu-overlay ${isOpen ? 'menu-overlay--visible' : ''}`}
        onClick={handleOverlayClick}
      />
      <nav ref={navRef} className={`menu-nav ${isOpen ? 'menu-nav--open' : ''}`}>
        <ul className="menu-nav__list">
          {navLinks.map((link) => (
            <li key={link.to}>
              <Link to={link.to} onClick={onClose}>{link.label}</Link>
            </li>
          ))}
        </ul>
        <ul className="menu-nav__list menu-nav__list--bottom">
          <li>
            <a href="#" id="searchMenuBtn" className="menu-nav__link-icon" onClick={handleSearchClick}>
              <img src="/anich_cakes/img/search.svg" alt="Поиск" />
              <span>Поиск десерта</span>
            </a>
          </li>
          <li>
            <a href="#" id="filterMenuBtn" className="menu-nav__link-icon" onClick={handleFilterClick}>
              <img src="/anich_cakes/img/filter.svg" alt="Фильтр" />
              <span>Подобрать состав</span>
            </a>
          </li>
        </ul>
      </nav>
    </>
  );
}