import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import allCards from '../../data/cards';
import type { CardData } from '../../types';
import Carousel from './Carousel';

interface FiltersPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

function getAllUniqueFilters(): string[] {
  const filterSet = new Set<string>();
  allCards.forEach((card) => {
    card.filters?.forEach((f) => filterSet.add(f));
  });
  return Array.from(filterSet).sort();
}

export default function FiltersPanel({ isOpen, onClose }: FiltersPanelProps) {
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [results, setResults] = useState<CardData[]>([]);
  const navigate = useNavigate();

  const allFilters = getAllUniqueFilters();

  useEffect(() => {
    if (isOpen) {
      setActiveFilters([]);
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

  const toggleFilter = useCallback((filterName: string) => {
    setActiveFilters((prev) => {
      const idx = prev.indexOf(filterName);
      const next = idx === -1 ? [...prev, filterName] : prev.filter((f) => f !== filterName);
      return next;
    });
  }, []);

  useEffect(() => {
    if (activeFilters.length === 0) {
      setResults([]);
      return;
    }
    const filtered = allCards.filter((card) => {
      if (!card.filters) return false;
      return activeFilters.every((f) => card.filters!.includes(f));
    });
    const unique = filtered.filter((card, i, arr) =>
      arr.findIndex((c) => c.name.toLowerCase() === card.name.toLowerCase()) === i
    );
    setResults(unique);
  }, [activeFilters]);

  const handleDetail = useCallback((cardName: string) => {
    onClose();
    navigate(`/detail?name=${encodeURIComponent(cardName)}`);
  }, [navigate, onClose]);

  return (
    <>
      <div className={`filters-search-overlay ${isOpen ? 'filters-search-overlay--visible' : ''}`} onClick={onClose} />
      <div className={`filters-search-panel ${isOpen ? 'filters-search-panel--open' : ''}`}>
        <div className="filters-search-panel__header">
          <span className="filters-search-panel__title">Подобрать состав</span>
          <span className="filters-search-panel__close-icon" onClick={onClose} aria-label="Закрыть фильтры">×</span>
        </div>
        <div className="filters-search-panel__filters">
          {allFilters.map((filter) => (
            <button
              key={filter}
              className={`filters-search-panel__filter-btn ${activeFilters.includes(filter) ? 'filters-search-panel__filter-btn--active' : ''}`}
              type="button"
              onClick={() => toggleFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>
        <div className="filters-search-panel__results">
          {results.length === 0 && activeFilters.length > 0 ? (
            <div className="filters-search-panel__empty">Ничего не найдено</div>
          ) : (
            results.map((card, i) => (
              <article key={`${card.name}-${i}`} className="global__card filters-search-result-card">
                <Carousel images={card.images} name={card.name} />
                <div className="global__card-body">
                  <div className="global__card-name">{card.name}</div>
                  <div className="global__card-calories">{card.calories}</div>
                  <div className="global__card-description">{card.description}</div>
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