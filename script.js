// ========================================
// SPA WEBSITE - JavaScript
// ========================================

document.addEventListener('DOMContentLoaded', function() {
  function extractNumericAedPrice(priceText) {
    if (typeof priceText !== 'string') return Number.POSITIVE_INFINITY;

    const normalizedText = priceText.replace(/,/g, '');
    const aedMatch = normalizedText.match(/(\d+(?:\.\d+)?)\s*AED/i);
    if (aedMatch) return Number.parseFloat(aedMatch[1]);

    const fallbackMatch = normalizedText.match(/\d+(?:\.\d+)?/);
    return fallbackMatch ? Number.parseFloat(fallbackMatch[0]) : Number.POSITIVE_INFINITY;
  }

  function getLowestPriceFromCard(card, priceSelector) {
    const priceNodes = card.querySelectorAll(priceSelector);
    if (!priceNodes.length) return Number.POSITIVE_INFINITY;

    const prices = Array.from(priceNodes)
      .map((node) => extractNumericAedPrice(node.textContent))
      .filter((price) => Number.isFinite(price));

    return prices.length ? Math.min(...prices) : Number.POSITIVE_INFINITY;
  }

  function sortCardsByAscendingPrice(gridSelector, cardSelector, priceSelector) {
    const grid = document.querySelector(gridSelector);
    if (!grid) return;

    const cards = Array.from(grid.querySelectorAll(cardSelector));
    if (cards.length < 2) return;

    cards
      .sort((leftCard, rightCard) => {
        const leftPrice = getLowestPriceFromCard(leftCard, priceSelector);
        const rightPrice = getLowestPriceFromCard(rightCard, priceSelector);
        return leftPrice - rightPrice;
      })
      .forEach((card) => grid.appendChild(card));
  }

  function sortCardsByCategoryThenPrice({
    gridSelector,
    cardSelector,
    priceSelector,
    categoryOrder = []
  }) {
    const grid = document.querySelector(gridSelector);
    if (!grid) return;

    const cards = Array.from(grid.querySelectorAll(cardSelector));
    if (cards.length < 2) return;

    const categoryRank = new Map(categoryOrder.map((category, index) => [category, index]));

    cards
      .sort((leftCard, rightCard) => {
        const leftCategory = leftCard.dataset.category || '';
        const rightCategory = rightCard.dataset.category || '';
        const leftRank = categoryRank.has(leftCategory) ? categoryRank.get(leftCategory) : Number.MAX_SAFE_INTEGER;
        const rightRank = categoryRank.has(rightCategory) ? categoryRank.get(rightCategory) : Number.MAX_SAFE_INTEGER;

        if (leftRank !== rightRank) return leftRank - rightRank;

        const leftPrice = getLowestPriceFromCard(leftCard, priceSelector);
        const rightPrice = getLowestPriceFromCard(rightCard, priceSelector);
        return leftPrice - rightPrice;
      })
      .forEach((card) => grid.appendChild(card));
  }

  function ensureFloatingThemeToggle() {
    const existingBtn = document.getElementById('floatingThemeToggleBtn');
    if (existingBtn) return existingBtn;

    let floatingMessengers = document.querySelector('.floating-messengers');
    if (!floatingMessengers) {
      floatingMessengers = document.createElement('div');
      floatingMessengers.className = 'floating-messengers';
      floatingMessengers.setAttribute('aria-label', 'Quick messengers');

      const messengers = [
        {
          className: 'whatsapp',
          href: 'https://wa.me/971504715070',
          label: 'Chat in WhatsApp',
          iconPath: 'M20.52 3.48A11.85 11.85 0 0 0 12.05 0C5.5 0 .16 5.34.16 11.9c0 2.1.55 4.16 1.6 5.98L0 24l6.3-1.64a11.87 11.87 0 0 0 5.75 1.47h.01c6.56 0 11.9-5.34 11.9-11.9 0-3.18-1.24-6.16-3.44-8.45Zm-8.47 18.4h-.01a9.9 9.9 0 0 1-5.04-1.37l-.36-.22-3.73.97 1-3.64-.24-.37a9.9 9.9 0 0 1-1.52-5.34c0-5.48 4.46-9.94 9.94-9.94a9.84 9.84 0 0 1 7.04 2.91 9.88 9.88 0 0 1 2.9 7.05c0 5.48-4.45 9.94-9.94 9.94Zm5.45-7.42c-.3-.15-1.78-.88-2.06-.98-.27-.1-.47-.15-.66.15-.2.3-.76.98-.94 1.18-.17.2-.35.22-.64.07-.3-.15-1.27-.47-2.41-1.5a9.08 9.08 0 0 1-1.68-2.08c-.18-.3-.02-.46.13-.61.14-.14.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.66-1.6-.91-2.18-.24-.57-.48-.5-.66-.5h-.56c-.2 0-.52.08-.8.37s-1.04 1.02-1.04 2.5 1.07 2.9 1.22 3.1c.15.2 2.1 3.21 5.1 4.5.71.3 1.27.48 1.7.61.71.22 1.36.19 1.87.12.57-.08 1.78-.73 2.03-1.44.25-.72.25-1.34.17-1.47-.07-.12-.27-.2-.57-.34Z'
        },
        {
          className: 'telegram',
          href: 'https://t.me/+971504715070',
          label: 'Chat in Telegram',
          iconPath: 'M23.22 4.3a1.6 1.6 0 0 0-1.8-.27L1.1 11.9a1.52 1.52 0 0 0 .06 2.84l4.67 1.63 1.81 5.56c.21.65 1.03.86 1.54.4l2.6-2.36 4.95 3.65c.66.48 1.6.1 1.73-.69L23.97 5.9c.09-.61-.18-1.22-.75-1.6ZM8.27 20.1l-1.34-4.13 9.6-6.1a.45.45 0 0 0-.47-.77l-10.57 5.8-3.45-1.21L21.5 6.2l-3.26 15.15-4.95-3.64a1.28 1.28 0 0 0-1.62.08L8.27 20.1Z'
        }
      ];

      messengers.forEach((messenger) => {
        const link = document.createElement('a');
        link.className = `floating-messenger ${messenger.className}`;
        link.href = messenger.href;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.setAttribute('aria-label', messenger.label);

        const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        icon.setAttribute('width', '28');
        icon.setAttribute('height', '28');
        icon.setAttribute('viewBox', '0 0 24 24');
        icon.setAttribute('fill', 'none');
        icon.setAttribute('aria-hidden', 'true');

        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('fill', 'currentColor');
        path.setAttribute('d', messenger.iconPath);

        icon.appendChild(path);
        link.appendChild(icon);
        floatingMessengers.appendChild(link);
      });

      document.body.appendChild(floatingMessengers);
    }

    let floatingActions = document.querySelector('.floating-actions');
    if (!floatingActions) {
      floatingActions = document.createElement('div');
      floatingActions.className = 'floating-actions';
      floatingActions.setAttribute('aria-label', 'Quick actions');
      document.body.appendChild(floatingActions);
    }

    const floatingThemeToggleBtn = document.createElement('button');
    floatingThemeToggleBtn.className = 'floating-action floating-theme-toggle';
    floatingThemeToggleBtn.id = 'floatingThemeToggleBtn';
    floatingThemeToggleBtn.type = 'button';
    floatingThemeToggleBtn.setAttribute('aria-label', 'Switch to light mode');
    floatingThemeToggleBtn.setAttribute('aria-pressed', 'false');
    floatingThemeToggleBtn.textContent = 'Dark';
    floatingActions.appendChild(floatingThemeToggleBtn);

    if (!floatingActions.querySelector('.floating-call')) {
      const floatingCallLink = document.createElement('a');
      floatingCallLink.className = 'floating-action floating-call';
      floatingCallLink.href = 'tel:+971504715070';
      floatingCallLink.setAttribute('aria-label', 'Call us');
      floatingCallLink.textContent = 'Call Us';
      floatingActions.appendChild(floatingCallLink);
    }

    return floatingThemeToggleBtn;
  }

  // ========================================
  // HEADER SCROLL EFFECT
  // ========================================
  const header = document.getElementById('header');
  let lastScrollY = 0;

  function handleHeaderScroll() {
    const currentScrollY = window.scrollY;
    
    if (currentScrollY > 100) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    
    lastScrollY = currentScrollY;
  }

  window.addEventListener('scroll', handleHeaderScroll);


  // ========================================
  // THEME TOGGLE (DARK/LIGHT)
  // ========================================
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const mobileThemeToggleBtn = document.getElementById('mobileThemeToggleBtn');
  const floatingThemeToggleBtn = ensureFloatingThemeToggle();

  function applyTheme(theme) {
    const normalizedTheme = theme === 'light' ? 'light' : 'dark';
    document.body.setAttribute('data-theme', normalizedTheme);
    localStorage.setItem('spa-theme', normalizedTheme);

    const nextLabel = normalizedTheme === 'dark' ? 'Light' : 'Dark';
    const switchToLabel = normalizedTheme === 'dark' ? 'light' : 'dark';

    [themeToggleBtn, mobileThemeToggleBtn, floatingThemeToggleBtn].forEach((btn) => {
      if (!btn) return;
      btn.textContent = nextLabel;
      btn.setAttribute('aria-label', `Switch to ${switchToLabel} mode`);
      btn.setAttribute('aria-pressed', String(normalizedTheme === 'light'));
    });
  }

  const savedTheme = localStorage.getItem('spa-theme');
  applyTheme(savedTheme || 'dark');

  [themeToggleBtn, mobileThemeToggleBtn, floatingThemeToggleBtn].forEach((btn) => {
    if (!btn) return;
    btn.addEventListener('click', () => {
      const currentTheme = document.body.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
      applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
    });
  });

  sortCardsByCategoryThenPrice({
    gridSelector: '#massagesGrid',
    cardSelector: '.massage-card',
    priceSelector: '.price-amount',
    categoryOrder: ['massage', 'wellness', 'body-bath', 'waxing']
  });
  sortCardsByAscendingPrice('#massage .services-grid', '.service-card', '.pricing-amount');

  // ========================================
  // MOBILE MENU
  // ========================================
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileNav = document.getElementById('mobileNav');
  const mobileNavOverlay = document.getElementById('mobileNavOverlay');

  if (mobileMenuBtn && mobileNav) {
    const setMobileMenuState = (isOpen) => {
      mobileMenuBtn.classList.toggle('active', isOpen);
      mobileNav.classList.toggle('active', isOpen);
      mobileNavOverlay?.classList.toggle('active', isOpen);
      mobileMenuBtn.setAttribute('aria-expanded', String(isOpen));
      document.body.classList.toggle('menu-open', isOpen);
    };

    mobileMenuBtn.addEventListener('click', () => {
      const isOpen = !mobileNav.classList.contains('active');
      setMobileMenuState(isOpen);
    });


    mobileNavOverlay?.addEventListener('click', () => {
      setMobileMenuState(false);
    });

    document.addEventListener('click', (event) => {
      const target = event.target;
      if (!(target instanceof Element) || !mobileNav.classList.contains('active')) return;
      if (mobileNav.contains(target) || mobileMenuBtn.contains(target)) return;
      setMobileMenuState(false);
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && mobileNav.classList.contains('active')) {
        setMobileMenuState(false);
      }
    });

    // Close mobile menu on link click
    const mobileNavLinks = mobileNav.querySelectorAll('a');
    mobileNavLinks.forEach((link) => {
      link.addEventListener('click', () => {
        setMobileMenuState(false);
      });
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 1024 && mobileNav.classList.contains('active')) {
        setMobileMenuState(false);
      }
    });
  }

  // ========================================
  // HEALERS VIDEO RESILIENCE
  // ========================================
  const healersVideo = document.getElementById('healersVideo');
  const healersVideoFallback = document.getElementById('healersVideoFallback');
  const videoPlayBtn = document.getElementById('videoPlayBtn');
  const videoPauseBtn = document.getElementById('videoPauseBtn');
  const videoMuteBtn = document.getElementById('videoMuteBtn');

  if (healersVideo) {
    const revealVideoFallback = () => {
      if (!healersVideoFallback) return;
      healersVideoFallback.hidden = false;
    };

    const hideVideoFallback = () => {
      if (!healersVideoFallback) return;
      healersVideoFallback.hidden = true;
    };

    const attemptVideoPlayback = () => {
      const playPromise = healersVideo.play();

      if (playPromise && typeof playPromise.then === 'function') {
        playPromise
          .then(() => {
            hideVideoFallback();
          })
          .catch(() => {
            revealVideoFallback();
          });
      }
    };

    healersVideo.addEventListener('canplay', hideVideoFallback);
    healersVideo.addEventListener('playing', hideVideoFallback);
    healersVideo.addEventListener('error', revealVideoFallback);

    attemptVideoPlayback();

    const resumePlaybackEvents = ['click', 'touchstart', 'keydown'];
    const resumeOnInteraction = () => {
      attemptVideoPlayback();
      resumePlaybackEvents.forEach((eventName) => {
        window.removeEventListener(eventName, resumeOnInteraction);
      });
    };

    resumePlaybackEvents.forEach((eventName) => {
      window.addEventListener(eventName, resumeOnInteraction, { once: true, passive: true });
    });

    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        attemptVideoPlayback();
      }
    });

    const updateMuteButtonLabel = () => {
      if (!videoMuteBtn) return;
      const isMuted = healersVideo.muted;
      videoMuteBtn.textContent = isMuted ? 'Unmute' : 'Mute';
      videoMuteBtn.setAttribute('aria-pressed', String(isMuted));
    };

    videoPlayBtn?.addEventListener('click', () => {
      attemptVideoPlayback();
    });

    videoPauseBtn?.addEventListener('click', () => {
      healersVideo.pause();
    });

    videoMuteBtn?.addEventListener('click', () => {
      healersVideo.muted = !healersVideo.muted;
      updateMuteButtonLabel();
    });

    healersVideo.addEventListener('volumechange', updateMuteButtonLabel);
    updateMuteButtonLabel();
  }

  // ========================================
  // MASSAGES FILTER TABS + SEE MORE/LESS
  // ========================================
  const filterButtons = document.querySelectorAll('.massages-filter-btn');
  const massageCards = Array.from(document.querySelectorAll('#massagesGrid .massage-card'));
  const massagesGrid = document.getElementById('massagesGrid');
  const massagesToggleBtn = document.getElementById('massagesToggleBtn');

  if (filterButtons.length > 0 && massageCards.length > 0 && massagesGrid && massagesToggleBtn) {
    let activeFilter = 'all';
    let isExpanded = false;

    const MOBILE_BREAKPOINT = 768;
    const getCollapsedLimit = () => (window.innerWidth <= MOBILE_BREAKPOINT ? 4 : 9);

    const applyMassagesState = () => {
      const visibleCards = massageCards.filter((card) => {
        const category = card.dataset.category;
        return activeFilter === 'all' || category === activeFilter;
      });

      const collapsedLimit = getCollapsedLimit();
      const hasOverflow = visibleCards.length > collapsedLimit;
      const shouldExpand = isExpanded && hasOverflow;
      const cardsToShowCount = shouldExpand ? visibleCards.length : Math.min(visibleCards.length, collapsedLimit);

      massageCards.forEach((card) => card.classList.add('is-hidden'));

      visibleCards.forEach((card, index) => {
        card.classList.toggle('is-hidden', index >= cardsToShowCount);
      });

      massagesToggleBtn.classList.toggle('is-hidden', !hasOverflow);
      massagesToggleBtn.hidden = !hasOverflow;

      if (!hasOverflow) {
        isExpanded = false;
        massagesToggleBtn.textContent = 'See more';
        massagesToggleBtn.setAttribute('aria-expanded', 'false');
        return;
      }

      massagesToggleBtn.textContent = shouldExpand ? 'See Less' : 'See more';
      massagesToggleBtn.setAttribute('aria-expanded', String(shouldExpand));
    };

    filterButtons.forEach((button) => {
      button.addEventListener('click', () => {
        activeFilter = button.dataset.filter || 'all';
        isExpanded = false;

        filterButtons.forEach((btn) => {
          const isActive = btn === button;
          btn.classList.toggle('active', isActive);
          btn.setAttribute('aria-selected', String(isActive));
        });

        applyMassagesState();
      });
    });

    massagesToggleBtn.addEventListener('click', () => {
      isExpanded = !isExpanded;
      applyMassagesState();
    });

    let resizeTimer;
    window.addEventListener('resize', () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        applyMassagesState();
      }, 120);
    });

    applyMassagesState();
  }

  // ========================================
  // HERO SLIDER - DIOR STYLE
  // ========================================
  const slides = document.querySelectorAll('.hero-slide');
  const indicators = document.querySelectorAll('.indicator');
  const prevBtn = document.querySelector('.hero-nav-prev');
  const nextBtn = document.querySelector('.hero-nav-next');
  
  let currentSlide = 0;
  let slideInterval = null;
  const slideDuration = 6000; // 6 seconds per slide

  function stopSlideshow() {
    if (slideInterval !== null) {
      clearInterval(slideInterval);
      slideInterval = null;
    }
  }

  function goToSlide(index) {
    if (slides.length === 0) return;

    const totalSlides = slides.length;
    currentSlide = ((index % totalSlides) + totalSlides) % totalSlides;

    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle('active', slideIndex === currentSlide);
    });

    indicators.forEach((indicator, indicatorIndex) => {
      indicator.classList.toggle('active', indicatorIndex === currentSlide);
    });
  }

  const nextSlide = () => goToSlide(currentSlide + 1);
  const prevSlide = () => goToSlide(currentSlide - 1);

  function startSlideshow() {
    stopSlideshow();
    slideInterval = setInterval(nextSlide, slideDuration);
  }

  function resetSlideshow() {
    startSlideshow();
  }

  // Initialize slideshow
  if (slides.length > 0) {
    goToSlide(0);
    startSlideshow();

    // Navigation arrows
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        prevSlide();
        resetSlideshow();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        nextSlide();
        resetSlideshow();
      });
    }

    // Indicators
    indicators.forEach((indicator, index) => {
      indicator.addEventListener('click', () => {
        goToSlide(index);
        resetSlideshow();
      });
    });

    // Keep autoplay running continuously (including while hovering hero section)
    const heroSection = document.querySelector('.hero-dior');
    if (heroSection) {
      heroSection.addEventListener('mouseenter', () => {
        resetSlideshow();
      });
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        prevSlide();
        resetSlideshow();
      } else if (e.key === 'ArrowRight') {
        nextSlide();
        resetSlideshow();
      }
    });

    // Touch/swipe support
    let touchStartX = 0;
    let touchEndX = 0;

    const heroSlider = document.querySelector('.hero-slider');
    if (heroSlider) {
      heroSlider.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });

      heroSlider.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
      }, { passive: true });
    }

    function handleSwipe() {
      const swipeThreshold = 50;
      const diff = touchStartX - touchEndX;

      if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
          nextSlide();
        } else {
          prevSlide();
        }
        resetSlideshow();
      }
    }
  }


  // ========================================
  // HEALERS CENTER-MODE CAROUSEL
  // ========================================
  const healersCarousel = document.querySelector('[data-healers-carousel]');

  if (healersCarousel) {
    const viewport = healersCarousel.querySelector('.healers-viewport');
    const track = healersCarousel.querySelector('.healers-track');
    const prevHealerBtn = healersCarousel.querySelector('.healers-nav-prev');
    const nextHealerBtn = healersCarousel.querySelector('.healers-nav-next');

    if (viewport && track) {
      const originalSlides = Array.from(track.querySelectorAll('.healer-slide'));
      const totalSlides = originalSlides.length;
      const clonesPerSide = Math.min(4, totalSlides);
      let currentIndex = 0;
      let isAnimating = false;

      const createClone = (slide) => {
        const clone = slide.cloneNode(true);
        clone.classList.add('is-clone');
        clone.setAttribute('aria-hidden', 'true');
        return clone;
      };

      const prepended = originalSlides.slice(-clonesPerSide).map(createClone);
      const appended = originalSlides.slice(0, clonesPerSide).map(createClone);

      prepended.forEach((clone) => track.prepend(clone));
      appended.forEach((clone) => track.append(clone));

      const allSlides = Array.from(track.querySelectorAll('.healer-slide'));
      const baseOffset = clonesPerSide;

      const getLoopDistance = (realIndex, targetIndex) => {
        const direct = targetIndex - realIndex;
        const wrapForward = targetIndex - (realIndex - totalSlides);
        const wrapBackward = targetIndex - (realIndex + totalSlides);
        return [direct, wrapForward, wrapBackward].reduce((best, value) => {
          return Math.abs(value) < Math.abs(best) ? value : best;
        }, direct);
      };

      const computeScale = (distance) => {
        if (distance === 0) return 1;
        if (distance === 1) return 0.9;
        if (distance === 2) return 0.8;
        return 0.7;
      };

      const updateSlideStates = () => {
        allSlides.forEach((slide) => {
          const realIndex = Number(slide.dataset.realIndex || 0);
          const distance = Math.abs(getLoopDistance(realIndex, currentIndex));
          const translateX = getLoopDistance(realIndex, currentIndex) * 6;
          const scale = computeScale(distance);

          slide.style.transform = `translateX(${translateX}px) scale(${scale})`;
          slide.classList.toggle('is-center', distance === 0);
          slide.classList.toggle('is-near', distance === 1);
          slide.classList.toggle('is-outer', distance === 2);
          slide.classList.toggle('is-far', distance >= 3);
        });
      };

      const updateTrackPosition = (shouldAnimate = true) => {
        const activeDomIndex = baseOffset + currentIndex;
        const activeSlide = allSlides[activeDomIndex];
        const viewportWidth = viewport.clientWidth;
        const slideWidth = activeSlide.offsetWidth;
        const offset = activeSlide.offsetLeft - (viewportWidth - slideWidth) / 2;

        track.style.transition = shouldAnimate
          ? 'transform 0.75s cubic-bezier(0.22, 1, 0.36, 1)'
          : 'none';
        track.style.transform = `translate3d(${-offset}px, 0, 0)`;
      };

      const normalizeIndex = (shouldAnimate = false) => {
        if (currentIndex >= totalSlides) {
          currentIndex = 0;
          updateTrackPosition(shouldAnimate);
        } else if (currentIndex < 0) {
          currentIndex = totalSlides - 1;
          updateTrackPosition(shouldAnimate);
        }

        updateSlideStates();
      };

      const moveTo = (nextIndex) => {
        if (isAnimating) return;
        isAnimating = true;
        currentIndex = nextIndex;
        updateTrackPosition(true);
        updateSlideStates();

        window.setTimeout(() => {
          normalizeIndex(false);
          isAnimating = false;
        }, 780);
      };

      const nextHealer = () => moveTo(currentIndex + 1);
      const prevHealer = () => moveTo(currentIndex - 1);

      prevHealerBtn?.addEventListener('click', prevHealer);
      nextHealerBtn?.addEventListener('click', nextHealer);

      let touchStartX = 0;
      viewport.addEventListener('touchstart', (event) => {
        touchStartX = event.changedTouches[0].screenX;
      }, { passive: true });

      viewport.addEventListener('touchend', (event) => {
        const touchEndX = event.changedTouches[0].screenX;
        const delta = touchStartX - touchEndX;
        if (Math.abs(delta) < 50) return;
        if (delta > 0) {
          nextHealer();
        } else {
          prevHealer();
        }
      }, { passive: true });

      window.addEventListener('resize', () => {
        updateTrackPosition(false);
        updateSlideStates();
      });

      updateSlideStates();
      updateTrackPosition(false);
    }
  }

  // ========================================
  // SMOOTH SCROLL
  // ========================================
  const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');
  
  smoothScrollLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const headerHeight = header.offsetHeight;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ========================================
  // SCROLL ANIMATIONS
  // ========================================
  const animatedElements = document.querySelectorAll(
    '.feature-card, .legend-card, .massage-card, .info-block, .quote-block'
  );

  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  animatedElements.forEach((el, index) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
    observer.observe(el);
  });


  // ========================================
  // LEGEND LINE-BY-LINE REVEAL
  // ========================================
  const legendSection = document.querySelector('.legend');

  if (legendSection) {
    const legendParagraphs = legendSection.querySelectorAll('.legend-paragraph, .legend-paragraph-highlight');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const splitLegendParagraphIntoLines = (paragraph) => {
      const pieces = [];
      let current = [];

      paragraph.childNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'BR') {
          pieces.push(current);
          current = [];
        } else {
          current.push(node);
        }
      });

      if (current.length) {
        pieces.push(current);
      }

      const fragment = document.createDocumentFragment();

      pieces.forEach((nodes) => {
        if (!nodes.length) {
          return;
        }

        const line = document.createElement('span');
        line.className = 'legend-line';

        const inner = document.createElement('span');
        inner.className = 'legend-line-inner';

        nodes.forEach((node) => {
          inner.appendChild(node.cloneNode(true));
        });

        line.appendChild(inner);
        fragment.appendChild(line);
      });

      paragraph.innerHTML = '';
      paragraph.appendChild(fragment);
    };

    legendParagraphs.forEach(splitLegendParagraphIntoLines);

    const legendLines = legendSection.querySelectorAll('.legend-line-inner');

    if (prefersReducedMotion) {
      legendLines.forEach((line) => {
        line.style.opacity = '1';
        line.style.transform = 'translateY(0)';
      });
    } else {
      legendLines.forEach((line, index) => {
        line.style.setProperty('--line-index', index);
      });

      const legendObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            legendSection.classList.add('is-visible');
            legendObserver.unobserve(entry.target);
          }
        });
      }, {
        root: null,
        threshold: 0.25,
        rootMargin: '0px 0px -8% 0px'
      });

      legendObserver.observe(legendSection);
    }
  }

  // ========================================
  // PARALLAX EFFECT FOR HERO
  // ========================================
  const heroContent = document.querySelector('.hero-content-dior');
  
  if (heroContent) {
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      if (scrolled < window.innerHeight) {
        heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
        heroContent.style.opacity = 1 - (scrolled / window.innerHeight);
      }
    });
  }

  // ========================================
  // CURSOR GLOW EFFECT (DESKTOP ONLY)
  // ========================================
  if (window.matchMedia('(min-width: 1024px)').matches) {
    const glowFollower = document.createElement('div');
    glowFollower.className = 'cursor-glow';
    glowFollower.style.cssText = `
      position: fixed;
      width: 300px;
      height: 300px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(212, 165, 116, 0.08) 0%, transparent 70%);
      pointer-events: none;
      z-index: 9999;
      transform: translate(-50%, -50%);
      transition: opacity 0.3s ease;
      opacity: 0;
    `;
    document.body.appendChild(glowFollower);

    let mouseX = 0, mouseY = 0;
    let glowX = 0, glowY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      glowFollower.style.opacity = '1';
    });

    document.addEventListener('mouseleave', () => {
      glowFollower.style.opacity = '0';
    });

    function animateGlow() {
      glowX += (mouseX - glowX) * 0.1;
      glowY += (mouseY - glowY) * 0.1;
      glowFollower.style.left = glowX + 'px';
      glowFollower.style.top = glowY + 'px';
      requestAnimationFrame(animateGlow);
    }
    animateGlow();
  }

  // ========================================
  // PRELOAD IMAGES
  // ========================================
  const imagesToPreload = [
    'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/moroccan-bath-XeSTABgX7qKMFfD8tpaA28jun8mEiK.jpg',
    'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/hot-stone-ozcMxcP4p2LRpwfWkz6xlxcogUApC0.jpg',
    'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/deep-tissue-D1EGarHWurusc7dncBgiNhIpKjE5Lf.jpg',
    'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/four-hands-Puk08W7r8o1fBXEjfwXtiHEmC1mv6J.jpg',
    'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/swedish-massage-C2bJ9ZEZfTErQx0yC2a469A6nhSZVx.jpg'
  ];

  imagesToPreload.forEach(src => {
    const img = new Image();
    img.src = src;
  });

  console.log('SPA - All systems initialized');
});

// ===== Begin merged from pages.js =====
// ============================================
// THERAPISTS SLIDER FUNCTIONALITY
// ============================================

class TherapistsSlider {
  constructor() {
    this.currentIndex = 0;
    this.slider = document.getElementById('therapistSlider');
    this.track = this.slider?.querySelector('.slider-track');
    this.slides = this.slider?.querySelectorAll('.slider-card') || [];
    this.dotsContainer = document.getElementById('sliderDots');
    this.progressBar = document.getElementById('sliderProgress');
    this.prevBtn = this.slider?.querySelector('.slider-prev');
    this.nextBtn = this.slider?.querySelector('.slider-next');
    this.indicators = [];
    
    if (this.slides.length > 0) {
      this.init();
    }
  }

  init() {
    if (this.prevBtn) this.prevBtn.addEventListener('click', () => this.prev());
    if (this.nextBtn) this.nextBtn.addEventListener('click', () => this.next());
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') this.prev();
      if (e.key === 'ArrowRight') this.next();
    });

    this.createIndicators();
    window.addEventListener('resize', () => this.updateSlider());

    this.updateSlider();
  }

  getCardStep() {
    if (!this.slides.length) return 0;
    const slideRect = this.slides[0].getBoundingClientRect();
    const trackStyles = window.getComputedStyle(this.track);
    const gap = parseFloat(trackStyles.gap || trackStyles.columnGap || '0') || 0;
    return slideRect.width + gap;
  }

  getVisibleSlides() {
    if (!this.slider || !this.slides.length) return 1;
    const sliderWidth = this.slider.clientWidth;
    const cardStep = this.getCardStep();
    if (!cardStep) return 1;
    return Math.max(1, Math.floor((sliderWidth + 1) / cardStep));
  }

  getMaxIndex() {
    return Math.max(0, this.slides.length - this.getVisibleSlides());
  }

  createIndicators() {
    if (!this.dotsContainer) return;

    const totalPositions = this.getMaxIndex() + 1;
    this.dotsContainer.innerHTML = '';
    this.indicators = [];

    for (let i = 0; i < totalPositions; i += 1) {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'slider-dot';
      dot.setAttribute('aria-label', `Go to therapist group ${i + 1}`);
      dot.addEventListener('click', () => this.goToSlide(i));
      this.dotsContainer.appendChild(dot);
      this.indicators.push(dot);
    }
  }

  next() {
    if (this.currentIndex >= this.getMaxIndex()) {
      this.currentIndex = 0;
    } else {
      this.currentIndex += 1;
    }
    this.updateSlider();
  }

  prev() {
    if (this.currentIndex <= 0) {
      this.currentIndex = this.getMaxIndex();
    } else {
      this.currentIndex -= 1;
    }
    this.updateSlider();
  }

  goToSlide(index) {
    this.currentIndex = Math.min(Math.max(index, 0), this.getMaxIndex());
    this.updateSlider();
  }

  updateSlider() {
    const maxIndex = this.getMaxIndex();
    if (this.currentIndex > maxIndex) {
      this.currentIndex = maxIndex;
    }

    const totalPositions = maxIndex + 1;
    if (totalPositions !== this.indicators.length) {
      this.createIndicators();
    }

    if (this.track) {
      const offset = this.currentIndex * this.getCardStep();
      this.track.style.transform = `translateX(-${offset}px)`;
    }

    // Update indicators
    this.indicators.forEach((indicator, index) => {
      indicator.classList.toggle('active', index === this.currentIndex);
    });

    if (this.progressBar) {
      const progress = totalPositions <= 1 ? 100 : (this.currentIndex / maxIndex) * 100;
      this.progressBar.style.width = `${progress}%`;
    }
  }
}

// ============================================
// GALLERY LIGHTBOX FUNCTIONALITY
// ============================================

class GalleryLightbox {
  constructor() {
    this.galleryItems = document.querySelectorAll('.gallery-item');
    this.lightbox = document.getElementById('lightbox');
    this.lightboxImg = document.querySelector('.lightbox-img');
    this.lightboxCaption = document.querySelector('.lightbox-caption');
    this.closeBtn = document.querySelector('.lightbox-close');
    this.prevBtn = document.querySelector('.lightbox-prev');
    this.nextBtn = document.querySelector('.lightbox-next');
    this.currentIndex = 0;

    if (this.galleryItems.length > 0) {
      this.init();
    }
  }

  init() {
    this.galleryItems.forEach((item, index) => {
      item.addEventListener('click', () => this.openLightbox(index));
    });

    if (this.closeBtn) this.closeBtn.addEventListener('click', () => this.closeLightbox());
    if (this.prevBtn) this.prevBtn.addEventListener('click', () => this.prevImage());
    if (this.nextBtn) this.nextBtn.addEventListener('click', () => this.nextImage());

    // Close on background click
    if (this.lightbox) {
      this.lightbox.addEventListener('click', (e) => {
        if (e.target === this.lightbox) this.closeLightbox();
      });
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (!this.lightbox?.classList.contains('active')) return;
      if (e.key === 'ArrowLeft') this.prevImage();
      if (e.key === 'ArrowRight') this.nextImage();
      if (e.key === 'Escape') this.closeLightbox();
    });
  }

  openLightbox(index) {
    this.currentIndex = index;
    const item = this.galleryItems[index];
    const img = item.querySelector('img');
    
    if (this.lightboxImg) this.lightboxImg.src = img.src;
    if (this.lightboxCaption) this.lightboxCaption.textContent = img.alt;
    
    if (this.lightbox) {
      this.lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  closeLightbox() {
    if (this.lightbox) {
      this.lightbox.classList.remove('active');
      document.body.style.overflow = 'auto';
    }
  }

  nextImage() {
    this.currentIndex = (this.currentIndex + 1) % this.galleryItems.length;
    this.openLightbox(this.currentIndex);
  }

  prevImage() {
    this.currentIndex = (this.currentIndex - 1 + this.galleryItems.length) % this.galleryItems.length;
    this.openLightbox(this.currentIndex);
  }
}

// ============================================
// FORM HANDLING
// ============================================

function initForms() {
  // Contact form
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Get form data
      const name = contactForm.querySelector('[name="name"]').value;
      const email = contactForm.querySelector('[name="email"]').value;
      const phone = contactForm.querySelector('[name="phone"]').value;
      const message = contactForm.querySelector('[name="message"]').value;

      // Basic validation
      if (!name || !email || !message) {
        alert('Пожалуйста, заполните все обязательные поля');
        return;
      }

      // Success message
      const successMsg = document.createElement('div');
      successMsg.className = 'success-message';
      successMsg.textContent = '✓ Спасибо! Ваше сообщение отправлено.';
      contactForm.appendChild(successMsg);

      // Reset form
      contactForm.reset();

      // Remove success message after 5 seconds
      setTimeout(() => successMsg.remove(), 5000);
    });
  }

  // Newsletter form
  const newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const email = newsletterForm.querySelector('[name="email"]').value;
      
      if (!email) {
        alert('Пожалуйста, введите ваш email');
        return;
      }

      const successMsg = document.createElement('div');
      successMsg.className = 'success-message';
      successMsg.textContent = '✓ Спасибо за подписку!';
      newsletterForm.appendChild(successMsg);

      newsletterForm.reset();
      setTimeout(() => successMsg.remove(), 5000);
    });
  }
}

// ============================================
// SMOOTH SCROLL & ANIMATIONS
// ============================================

function initScrollAnimations() {
  // Add scroll animation to elements
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in');
      }
    });
  }, observerOptions);

  document.querySelectorAll('[data-animate]').forEach(el => {
    observer.observe(el);
  });
}

// ============================================
// SMOOTH SCROLL LINKS
// ============================================

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href !== '#') {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    });
  });
}

// ============================================
// FILTER FUNCTIONALITY
// ============================================

function initFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const filterItems = document.querySelectorAll('.filter-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');

      // Update active button
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Filter items
      filterItems.forEach(item => {
        const itemFilter = item.getAttribute('data-category');
        
        if (filter === 'all' || itemFilter === filter) {
          item.classList.add('active');
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 10);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.8)';
          setTimeout(() => {
            item.classList.remove('active');
          }, 300);
        }
      });
    });
  });
}

function initGalleryHeroVideoControls() {
  const video = document.getElementById('galleryHeroVideo');
  const controlButtons = document.querySelectorAll('.hero-video-btn[data-video-action]');

  if (!video || !controlButtons.length) return;

  controlButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const action = button.dataset.videoAction;

      if (action === 'play') {
        video.play();
      }

      if (action === 'pause') {
        video.pause();
      }

      if (action === 'stop') {
        video.pause();
        video.currentTime = 0;
      }

      if (action === 'mute') {
        video.muted = !video.muted;
        button.textContent = video.muted ? 'Unmute' : 'Mute';
      }
    });
  });
}

// ============================================
// INITIALIZATION ON PAGE LOAD
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all functionality
  new TherapistsSlider();
  new GalleryLightbox();
  initForms();
  initScrollAnimations();
  initSmoothScroll();
  initFilters();
  initGalleryHeroVideoControls();

  // Page transition animations
  const pageContent = document.querySelector('.page-content');
  if (pageContent) {
    pageContent.classList.add('fade-in');
  }
});

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Debounce function for resize events
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Add animation class on scroll
window.addEventListener('scroll', debounce(() => {
  document.querySelectorAll('[data-animate]').forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - 100) {
      el.classList.add('fade-in');
    }
  });
}, 100));

// Prevent accidental form submissions with unsaved changes
window.addEventListener('beforeunload', (e) => {
  const forms = document.querySelectorAll('form');
  let hasChanges = false;
  
  forms.forEach(form => {
    if (form.querySelector('input:not([value=""]), textarea:not([value=""])')) {
      hasChanges = true;
    }
  });

  if (hasChanges) {
    e.preventDefault();
    e.returnValue = '';
  }
});


// ===== Begin Scroll Reveal from contact.js =====
document.addEventListener('DOMContentLoaded', function() {
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
    if (entry.isIntersecting) {
    entry.target.classList.add('revealed');
    revealObserver.unobserve(entry.target);
    }
    });
    }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
    });
    revealElements.forEach(el => revealObserver.observe(el));
});
