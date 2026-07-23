/**
 * Поиск по карточкам десертов и детальная карточка десерта на raw-странице
 */
(function () {
  'use strict';

  var searchPanel = null;
  var searchInput = null;
  var searchResults = null;
  var searchOverlay = null;
  var isOpen = false;
  var dessertModal = null;
  var dessertModalOverlay = null;
  var isDessertModalOpen = false;

  function createSearchPanel() {
    searchOverlay = document.createElement('div');
    searchOverlay.className = 'search-overlay';

    searchPanel = document.createElement('div');
    searchPanel.className = 'search-panel';

    var inputWrapper = document.createElement('div');
    inputWrapper.className = 'search-panel__input-wrapper';

    var searchIcon = document.createElement('img');
    searchIcon.className = 'search-panel__input-icon';
    searchIcon.src = 'anich_cakes/img/search.svg';
    searchIcon.alt = '';

    searchInput = document.createElement('input');
    searchInput.className = 'search-panel__input';
    searchInput.type = 'text';
    searchInput.placeholder = 'Поиск десертов...';
    searchInput.setAttribute('autocomplete', 'off');

    var closeIcon = document.createElement('span');
    closeIcon.className = 'search-panel__close-icon';
    closeIcon.textContent = '×';
    closeIcon.setAttribute('aria-label', 'Закрыть поиск');
    closeIcon.addEventListener('click', function () {
      closeSearch();
    });

    inputWrapper.appendChild(searchIcon);
    inputWrapper.appendChild(searchInput);
    inputWrapper.appendChild(closeIcon);

    searchResults = document.createElement('div');
    searchResults.className = 'search-panel__results';

    searchPanel.appendChild(inputWrapper);
    searchPanel.appendChild(searchResults);
    document.body.appendChild(searchOverlay);
    document.body.appendChild(searchPanel);

    searchInput.addEventListener('input', onSearchInput);
    searchInput.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        closeSearch();
      }
    });

    searchOverlay.addEventListener('click', function () {
      closeSearch();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && isOpen) {
        closeSearch();
      }
    });
  }

  function openSearch() {
    if (!searchPanel) {
      createSearchPanel();
    }
    searchPanel.classList.add('search-panel--open');
    searchOverlay.classList.add('search-overlay--visible');
    isOpen = true;
    renderResults(allCards);
    setTimeout(function () {
      if (searchInput) {
        searchInput.focus();
      }
    }, 100);
  }

  function closeSearch() {
    if (!searchPanel) return;
    searchPanel.classList.remove('search-panel--open');
    searchOverlay.classList.remove('search-overlay--visible');
    isOpen = false;
    if (searchInput) {
      searchInput.value = '';
    }
    if (searchResults) {
      searchResults.innerHTML = '';
    }
  }

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

  function createCarouselHTML(images) {
    if (!images || images.length === 0) return '';

    var slidesHTML = '';
    var dotsHTML = '';
    images.forEach(function (img, i) {
      slidesHTML += '<div class="global__carousel-slide"><img src="' + img + '" alt="Фото"></div>';
      dotsHTML += '<button class="global__carousel-dot' + (i === 0 ? ' global__carousel-dot--active' : '') + '" type="button"></button>';
    });

    var prevBtn = images.length > 1 ? '<button class="global__carousel-btn global__carousel-btn--prev" type="button">‹</button>' : '';
    var nextBtn = images.length > 1 ? '<button class="global__carousel-btn global__carousel-btn--next" type="button">›</button>' : '';

    return '<div class="global__carousel" data-current="0">' +
      '<div class="global__carousel-track">' + slidesHTML + '</div>' +
      prevBtn + nextBtn +
      '<div class="global__carousel-dots">' + dotsHTML + '</div>' +
      '</div>';
  }

  function renderResults(cards) {
    searchResults.innerHTML = '';

    if (cards.length === 0) {
      searchResults.innerHTML = '<div class="search-panel__empty">Ничего не найдено</div>';
      return;
    }

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
      cardEl.className = 'global__card search-result-card';
      cardEl.setAttribute('data-tags', card.tags || '');

      var carouselHTML = createCarouselHTML(card.images);
      var carouselDiv = document.createElement('div');
      carouselDiv.innerHTML = carouselHTML;
      cardEl.appendChild(carouselDiv.firstElementChild);

      var bodyDiv = document.createElement('div');
      bodyDiv.className = 'global__card-body';

      var nameDiv = document.createElement('div');
      nameDiv.className = 'global__card-name';
      nameDiv.textContent = card.name;

      var caloriesDiv = document.createElement('div');
      caloriesDiv.className = 'global__card-calories';
      caloriesDiv.textContent = card.calories;

      var descDiv = document.createElement('div');
      descDiv.className = 'global__card-description';
      descDiv.textContent = card.description;

      bodyDiv.appendChild(nameDiv);
      bodyDiv.appendChild(caloriesDiv);
      bodyDiv.appendChild(descDiv);
      cardEl.appendChild(bodyDiv);

      searchResults.appendChild(cardEl);
    });

    initSearchCarousels();
  }

  function initSearchCarousels() {
    searchResults.querySelectorAll('.global__carousel').forEach(function (carousel) {
      var track = carousel.querySelector('.global__carousel-track');
      var slides = carousel.querySelectorAll('.global__carousel-slide');
      var dots = carousel.querySelectorAll('.global__carousel-dot');
      var prevBtn = carousel.querySelector('.global__carousel-btn--prev');
      var nextBtn = carousel.querySelector('.global__carousel-btn--next');
      var current = 0;

      if (slides.length <= 1) {
        if (prevBtn) prevBtn.style.display = 'none';
        if (nextBtn) nextBtn.style.display = 'none';
        return;
      }

      function updateCarousel() {
        track.style.transform = 'translateX(-' + (current * 100) + '%)';
        dots.forEach(function (dot, i) {
          dot.classList.toggle('global__carousel-dot--active', i === current);
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

      // Touch-свайп для мобильной версии
      var touchStartX = 0;
      var touchEndX = 0;
      var isSwiping = false;

      carousel.addEventListener('touchstart', function (e) {
        touchStartX = e.changedTouches[0].screenX;
        isSwiping = true;
      }, { passive: true });

      carousel.addEventListener('touchmove', function (e) {
        if (!isSwiping) return;
        touchEndX = e.changedTouches[0].screenX;
      }, { passive: true });

      carousel.addEventListener('touchend', function (e) {
        if (!isSwiping) return;
        isSwiping = false;
        touchEndX = e.changedTouches[0].screenX;
        var diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 30) {
          if (diff > 0) {
            // Свайп влево — следующий слайд
            current = (current + 1) % slides.length;
          } else {
            // Свайп вправо — предыдущий слайд
            current = (current - 1 + slides.length) % slides.length;
          }
          updateCarousel();
        }
      }, { passive: true });
    });
  }

  function buildHeaderLayout() {
    var header = document.querySelector('.banner__header');
    if (!header) return;

    var rightPart = header.querySelector('.right-part');
    if (!rightPart) {
      rightPart = document.createElement('div');
      rightPart.className = 'right-part';

      var titleLink = header.querySelector('a[href="index.html"]');
      if (titleLink) {
        titleLink.remove();
        rightPart.appendChild(titleLink);
      }

      header.appendChild(rightPart);
    }
  }

  function buildSearchButton() {
    var header = document.querySelector('.banner__header');
    if (!header) return;

    buildHeaderLayout();

    var rightPart = header.querySelector('.right-part');
    if (!rightPart) return;

    if (!document.getElementById('searchBtn')) {
      var iconsWrapper = document.createElement('div');
      iconsWrapper.className = 'banner__header-icons';

      var searchLink = document.createElement('a');
      searchLink.href = '#';
      searchLink.className = 'banner__header-icon';
      searchLink.id = 'searchBtn';
      searchLink.setAttribute('aria-label', 'Поиск');

      var searchIcon = document.createElement('img');
      searchIcon.src = 'anich_cakes/img/search.svg';
      searchIcon.alt = 'Поиск';

      searchLink.appendChild(searchIcon);
      iconsWrapper.appendChild(searchLink);

      var filterLink = document.createElement('a');
      filterLink.href = '#';
      filterLink.className = 'banner__header-icon';
      filterLink.id = 'filterBtn';
      filterLink.setAttribute('aria-label', 'Фильтр');

      var filterIcon = document.createElement('img');
      filterIcon.src = 'anich_cakes/img/filter.svg';
      filterIcon.alt = 'Фильтр';

      filterLink.appendChild(filterIcon);
      iconsWrapper.appendChild(filterLink);

      rightPart.insertBefore(iconsWrapper, rightPart.firstChild);
    }
  }

  function buildSearchMenuLink() {
    var menuNav = document.getElementById('menuNav');
    if (!menuNav) {
      return;
    }

    var menuList = menuNav.querySelector('.menu-nav__list--bottom, .global__menu-list--bottom, .low-calories__menu-list--bottom');
    if (!menuList) {
      var menuLists = menuNav.querySelectorAll('ul');
      menuList = menuLists[menuLists.length - 1] || menuNav.querySelector('ul') || menuNav.querySelector('.menu-nav__list') || menuNav.querySelector('.global__menu-list') || menuNav.querySelector('.low-calories__menu-list');
    }
    if (!menuList) {
      return;
    }

    if (!document.getElementById('searchMenuBtn')) {
      var searchItem = document.createElement('li');
      var searchLink = document.createElement('a');
      searchLink.href = '#';
      searchLink.id = 'searchMenuBtn';
      searchLink.className = 'menu-nav__link-icon';
      searchLink.innerHTML = '<img src="anich_cakes/img/search.svg" alt="Поиск"><span>Поиск десерта</span>';
      searchItem.appendChild(searchLink);
      menuList.appendChild(searchItem);
    }

    if (!document.getElementById('filterMenuBtn')) {
      var filterItem = document.createElement('li');
      var filterLink = document.createElement('a');
      filterLink.href = '#';
      filterLink.className = 'menu-nav__link-icon';
      filterLink.innerHTML = '<img src="anich_cakes/img/filter.svg" alt="Фильтр"><span>Подобрать состав</span>';
      filterItem.appendChild(filterLink);
      menuList.appendChild(filterItem);
    }
  }

  function closeMenu() {
    var menuNav = document.getElementById('menuNav');
    var menuOverlay = document.getElementById('menuOverlay');
    var header = document.querySelector('.banner__header');

    if (menuNav) {
      menuNav.classList.remove('global__menu--open');
      menuNav.classList.remove('menu-nav--open');
      menuNav.classList.remove('low-calories__menu--open');
    }
    if (menuOverlay) {
      menuOverlay.classList.remove('global__menu-overlay--visible');
      menuOverlay.classList.remove('menu-overlay--visible');
      menuOverlay.classList.remove('low-calories__menu-overlay--visible');
    }
    document.body.style.overflow = '';
    if (header) {
      header.classList.remove('banner__header--hidden');
    }
  }

  function createDessertModal() {
    if (dessertModal && dessertModalOverlay) {
      return;
    }

    dessertModalOverlay = document.createElement('div');
    dessertModalOverlay.id = 'dessertDetailsOverlay';
    dessertModalOverlay.className = 'dessert-details-overlay';

    dessertModal = document.createElement('div');
    dessertModal.className = 'dessert-details-modal';

    var closeButton = document.createElement('button');
    closeButton.className = 'dessert-details-close';
    closeButton.type = 'button';
    closeButton.setAttribute('aria-label', 'Закрыть');
    closeButton.innerHTML = '×';

    var content = document.createElement('div');
    content.className = 'dessert-details-content';

    dessertModal.appendChild(closeButton);
    dessertModal.appendChild(content);
    dessertModalOverlay.appendChild(dessertModal);
    document.body.appendChild(dessertModalOverlay);

    closeButton.addEventListener('click', closeDessertModal);
    dessertModalOverlay.addEventListener('click', function (event) {
      if (event.target === dessertModalOverlay) {
        closeDessertModal();
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && isDessertModalOpen) {
        closeDessertModal();
      }
    });
  }

  function openDessertModal(card) {
    if (!card) return;
    createDessertModal();

    var title = card.querySelector('.global__card-name');
    var calories = card.querySelector('.global__card-calories');
    var description = card.querySelector('.global__card-description');
    var firstImage = card.querySelector('.global__carousel-slide img');
    var content = dessertModal.querySelector('.dessert-details-content');
    var tags = card.getAttribute('data-tags') || 'Raw';

    var imageMarkup = firstImage ? '<img src="' + firstImage.getAttribute('src') + '" alt="' + (title ? title.textContent.trim() : 'Десерт') + '">' : '';
    var tagsMarkup = tags.split(',').map(function (tag) {
      return '<span class="dessert-details-tag">' + tag.trim() + '</span>';
    }).join('');

    content.innerHTML = '<div class="dessert-details-image">' + imageMarkup + '</div>' +
      '<div class="dessert-details-text">' +
      '<div class="dessert-details-title">' + (title ? title.innerHTML : '') + '</div>' +
      '<div class="dessert-details-tags">' + tagsMarkup + '</div>' +
      '<div class="dessert-details-calories">' + (calories ? calories.textContent.trim() : '') + '</div>' +
      '<div class="dessert-details-description">' + (description ? description.textContent.trim() : '') + '</div>' +
      '</div>';

    dessertModalOverlay.classList.add('dessert-details-overlay--visible');
    document.body.style.overflow = 'hidden';
    isDessertModalOpen = true;
  }

  function closeDessertModal() {
    if (!dessertModalOverlay) return;
    dessertModalOverlay.classList.remove('dessert-details-overlay--visible');
    document.body.style.overflow = '';
    isDessertModalOpen = false;
  }

  function initDessertDetailsModal() {
    var isRawPage = /(^|\/|\\)raw\.html($|[?#])/.test(window.location.href);
    if (!isRawPage) {
      return;
    }

    document.querySelectorAll('.global__card-name').forEach(function (nameEl) {
      nameEl.style.cursor = 'pointer';
      nameEl.addEventListener('click', function (event) {
        event.preventDefault();
        openDessertModal(nameEl.closest('.global__card'));
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    buildSearchButton();

    var searchBtn = document.getElementById('searchBtn');
    if (searchBtn) {
      searchBtn.addEventListener('click', function (e) {
        e.preventDefault();
        toggleSearch();
      });
    }

    var searchMenuBtn = document.getElementById('searchMenuBtn');
    if (searchMenuBtn) {
      searchMenuBtn.addEventListener('click', function (e) {
        e.preventDefault();
        closeMenu();
        toggleSearch();
      });
    }

    initDessertDetailsModal();
  });

  function toggleSearch() {
    if (isOpen) {
      closeSearch();
    } else {
      openSearch();
    }
  }
})();