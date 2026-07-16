/**
 * Поиск по карточкам десертов
 * Открывается по клику на search.svg, закрывается по клику вне панели или по Escape
 */
(function () {
  'use strict';

  var searchPanel = null;
  var searchInput = null;
  var searchResults = null;
  var searchOverlay = null;
  var isOpen = false;

  /**
   * Создаёт DOM-структуру поисковой панели
   */
  function createSearchPanel() {
    // Оверлей
    searchOverlay = document.createElement('div');
    searchOverlay.className = 'search-overlay';

    // Панель
    searchPanel = document.createElement('div');
    searchPanel.className = 'search-panel';

    // Контейнер для поля ввода с иконкой
    var inputWrapper = document.createElement('div');
    inputWrapper.className = 'search-panel__input-wrapper';

    // Иконка поиска внутри поля
    var searchIcon = document.createElement('img');
    searchIcon.className = 'search-panel__input-icon';
    searchIcon.src = 'anich_cakes/img/search.svg';
    searchIcon.alt = '';

    // Поле ввода
    searchInput = document.createElement('input');
    searchInput.className = 'search-panel__input';
    searchInput.type = 'text';
    searchInput.placeholder = 'Поиск десертов...';
    searchInput.setAttribute('autocomplete', 'off');

    inputWrapper.appendChild(searchIcon);
    inputWrapper.appendChild(searchInput);

    // Контейнер результатов
    searchResults = document.createElement('div');
    searchResults.className = 'search-panel__results';

    searchPanel.appendChild(inputWrapper);
    searchPanel.appendChild(searchResults);
    document.body.appendChild(searchOverlay);
    document.body.appendChild(searchPanel);

    // События
    searchInput.addEventListener('input', onSearchInput);
    searchInput.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        closeSearch();
      }
    });

    searchOverlay.addEventListener('click', function () {
      closeSearch();
    });

    // Закрытие по Escape глобально
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && isOpen) {
        closeSearch();
      }
    });
  }

  /**
   * Открыть поисковую панель
   */
  function openSearch() {
    if (!searchPanel) {
      createSearchPanel();
    }
    searchPanel.classList.add('search-panel--open');
    searchOverlay.classList.add('search-overlay--visible');
    isOpen = true;
    // Показываем все карточки при открытии
    renderResults(allCards);
    setTimeout(function () {
      searchInput.focus();
    }, 100);
  }

  /**
   * Закрыть поисковую панель
   */
  function closeSearch() {
    if (!searchPanel) return;
    searchPanel.classList.remove('search-panel--open');
    searchOverlay.classList.remove('search-overlay--visible');
    isOpen = false;
    searchInput.value = '';
    searchResults.innerHTML = '';
  }

  /**
   * Обработчик ввода текста
   */
  function onSearchInput() {
    var query = searchInput.value.trim().toLowerCase();
    if (query === '') {
      renderResults(allCards);
      return;
    }

    var filtered = allCards.filter(function (card) {
      return card.name.toLowerCase().indexOf(query) !== -1;
    });

    renderResults(filtered);
  }

  /**
   * Создаёт HTML для карусели изображений карточки
   */
  function createCarouselHTML(images) {
    if (!images || images.length === 0) return '';

    var slidesHTML = '';
    var dotsHTML = '';
    images.forEach(function (img, i) {
      slidesHTML += '<div class="low-calories__carousel-slide"><img src="' + img + '" alt="Фото"></div>';
      dotsHTML += '<button class="low-calories__carousel-dot' + (i === 0 ? ' low-calories__carousel-dot--active' : '') + '" type="button"></button>';
    });

    var prevBtn = images.length > 1 ? '<button class="low-calories__carousel-btn low-calories__carousel-btn--prev" type="button">‹</button>' : '';
    var nextBtn = images.length > 1 ? '<button class="low-calories__carousel-btn low-calories__carousel-btn--next" type="button">›</button>' : '';

    return '<div class="low-calories__carousel" data-current="0">' +
      '<div class="low-calories__carousel-track">' + slidesHTML + '</div>' +
      prevBtn + nextBtn +
      '<div class="low-calories__carousel-dots">' + dotsHTML + '</div>' +
      '</div>';
  }

  /**
   * Отрисовка результатов поиска в формате карточек как на странице
   * с уникальными названиями (без дубликатов)
   */
  function renderResults(cards) {
    searchResults.innerHTML = '';

    if (cards.length === 0) {
      searchResults.innerHTML = '<div class="search-panel__empty">Ничего не найдено</div>';
      return;
    }

    // Фильтр уникальных названий: оставляем только первую карточку с каждым названием
    var seenNames = {};
    var uniqueCards = cards.filter(function (card) {
      var nameLower = card.name.toLowerCase();
      if (seenNames[nameLower]) {
        return false;
      }
      seenNames[nameLower] = true;
      return true;
    });

    uniqueCards.forEach(function (card) {
      var cardEl = document.createElement('article');
      cardEl.className = 'low-calories__card search-result-card';

      // Карусель
      var carouselHTML = createCarouselHTML(card.images);
      var carouselDiv = document.createElement('div');
      carouselDiv.innerHTML = carouselHTML;
      cardEl.appendChild(carouselDiv.firstElementChild);

      // Body карточки
      var bodyDiv = document.createElement('div');
      bodyDiv.className = 'low-calories__card-body';

      var nameDiv = document.createElement('div');
      nameDiv.className = 'low-calories__card-name';
      nameDiv.textContent = card.name;

      var caloriesDiv = document.createElement('div');
      caloriesDiv.className = 'low-calories__card-calories';
      caloriesDiv.textContent = card.calories;

      var descDiv = document.createElement('div');
      descDiv.className = 'low-calories__card-description';
      descDiv.textContent = card.description;

      bodyDiv.appendChild(nameDiv);
      bodyDiv.appendChild(caloriesDiv);
      bodyDiv.appendChild(descDiv);
      cardEl.appendChild(bodyDiv);

      // Кнопка перехода на страницу категории (стиль product-card__button)
      var link = document.createElement('a');
      link.href = card.page;
      link.className = 'product-card__button search-result-card__link';
      link.textContent = 'Перейти в «' + card.category + '»';
      cardEl.appendChild(link);

      searchResults.appendChild(cardEl);
    });

    // Инициализация каруселей для созданных карточек
    initSearchCarousels();
  }

  /**
   * Инициализация каруселей в результатах поиска
   */
  function initSearchCarousels() {
    searchResults.querySelectorAll('.low-calories__carousel').forEach(function (carousel) {
      var track = carousel.querySelector('.low-calories__carousel-track');
      var slides = carousel.querySelectorAll('.low-calories__carousel-slide');
      var dots = carousel.querySelectorAll('.low-calories__carousel-dot');
      var prevBtn = carousel.querySelector('.low-calories__carousel-btn--prev');
      var nextBtn = carousel.querySelector('.low-calories__carousel-btn--next');
      var current = 0;

      if (slides.length <= 1) {
        if (prevBtn) prevBtn.style.display = 'none';
        if (nextBtn) nextBtn.style.display = 'none';
        return;
      }

      function updateCarousel() {
        track.style.transform = 'translateX(-' + (current * 100) + '%)';
        dots.forEach(function (dot, i) {
          dot.classList.toggle('low-calories__carousel-dot--active', i === current);
        });
      }

      if (prevBtn) {
        prevBtn.addEventListener('click', function () {
          current = (current - 1 + slides.length) % slides.length;
          updateCarousel();
        });
      }

      if (nextBtn) {
        nextBtn.addEventListener('click', function () {
          current = (current + 1) % slides.length;
          updateCarousel();
        });
      }

      dots.forEach(function (dot, i) {
        dot.addEventListener('click', function () {
          current = i;
          updateCarousel();
        });
      });
    });
  }

  // Инициализация: навешиваем обработчик на иконку поиска
  document.addEventListener('DOMContentLoaded', function () {
    var searchBtn = document.getElementById('searchBtn');
    if (searchBtn) {
      searchBtn.addEventListener('click', function (e) {
        e.preventDefault();
        toggleSearch();
      });
    }

    // Обработчик для кнопки "Поиск десерта" в меню
    var searchMenuBtn = document.getElementById('searchMenuBtn');
    if (searchMenuBtn) {
      searchMenuBtn.addEventListener('click', function (e) {
        e.preventDefault();
        // Закрываем меню
        var menuNav = document.getElementById('menuNav');
        var menuOverlay = document.getElementById('menuOverlay');
        var header = document.querySelector('.banner__header');
        if (menuNav) {
          menuNav.classList.remove('low-calories__menu--open');
        }
        if (menuOverlay) {
          menuOverlay.classList.remove('low-calories__menu-overlay--visible');
        }
        document.body.style.overflow = '';
        if (header) header.classList.remove('banner__header--hidden');
        // Открываем поиск
        toggleSearch();
      });
    }
  });

  function toggleSearch() {
    if (isOpen) {
      closeSearch();
    } else {
      openSearch();
    }
  }

})();