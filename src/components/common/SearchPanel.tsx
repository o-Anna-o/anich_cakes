import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import allCards from '../../data/cards';
import type { CardData } from '../../types';
import Carousel from './Carousel';

interface SearchPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const MAX_RESULTS = 20;

/** Список уникальных карточек (по имени) */
const uniqueCards = allCards.filter(
  (card, i, arr) =>
    arr.findIndex((c) => c.name.toLowerCase() === card.name.toLowerCase()) === i
);

export default function SearchPanel({ isOpen, onClose }: SearchPanelProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<CardData[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setResults(uniqueCards.slice(0, MAX_RESULTS));
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    const trimmed = val.trim().toLowerCase();
    if (trimmed === '') {
      setResults(uniqueCards.slice(0, MAX_RESULTS));
      return;
    }
    const filtered = allCards.filter((card) =>
      card.name.toLowerCase().includes(trimmed)
    );
    const unique = filtered.filter((card, i, arr) =>
      arr.findIndex((c) => c.name.toLowerCase() === card.name.toLowerCase()) === i
    );
    setResults(unique.slice(0, MAX_RESULTS));
  }, []);

  const handleDetail = useCallback((cardName: string) => {
    onClose();
    navigate(`/detail?name=${encodeURIComponent(cardName)}`);
  }, [navigate, onClose]);

  return (
    <>
      <div className={`search-overlay ${isOpen ? 'search-overlay--visible' : ''}`} onClick={onClose} />
      <div className={`search-panel ${isOpen ? 'search-panel--open' : ''}`}>
        <div className="search-panel__input-wrapper">
          <img className="search-panel__input-icon" src="/anich_cakes/img/search.svg" alt="" />
          <input
            ref={inputRef}
            className="search-panel__input"
            type="text"
            placeholder="Поиск десертов..."
            value={query}
            onChange={handleInput}
            autoComplete="off"
          />
          <span className="search-panel__close-icon" onClick={onClose} aria-label="Закрыть поиск">×</span>
        </div>
        <div className="search-panel__results">
          {results.length === 0 ? (
            <div className="search-panel__empty">Ничего не найдено</div>
          ) : (
            results.map((card, i) => (
              <article key={`${card.name}-${i}`} className="global__card search-result-card">
                <Carousel images={card.images} name={card.name} />
                <div className="global__card-body">
                  <div className="global__card-name" onClick={() => handleDetail(card.name)}>
                    {card.name}
                  </div>
                  <div className="global__card-calories">{card.calories}</div>
                  <button className="detail-card__button" type="button" onClick={() => handleDetail(card.name)}>
                    Подробнее
                  </button>
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    </>
  );
}
