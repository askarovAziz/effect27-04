// Mobile Menu Toggle
const mobileMenuBtn = document.getElementById("mobileMenuBtn")
const mainNav = document.getElementById("mainNav")
const navOverlay = document.getElementById("navOverlay")

mobileMenuBtn?.setAttribute("aria-expanded", "false")

const closeMobileMenu = () => {
  mainNav.classList.remove("active")
  navOverlay?.classList.remove("active")
  document.body.classList.remove("nav-open")
  mobileMenuBtn?.setAttribute("aria-expanded", "false")
}

const toggleMobileMenu = () => {
  const isActive = mainNav.classList.toggle("active")
  navOverlay?.classList.toggle("active", isActive)
  document.body.classList.toggle("nav-open", isActive)
  mobileMenuBtn?.setAttribute("aria-expanded", isActive)
}

mobileMenuBtn.addEventListener("click", () => {
  toggleMobileMenu()
})

// Close mobile menu on link click
mainNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    closeMobileMenu()
  })
})

navOverlay?.addEventListener("click", () => {
  closeMobileMenu()
})

document.addEventListener("click", (event) => {
  const target = event.target
  const clickedMenuButton = mobileMenuBtn.contains(target)
  const clickedNav = mainNav.contains(target)

  if (mainNav.classList.contains("active") && !clickedMenuButton && !clickedNav) {
    closeMobileMenu()
  }
})

// Services dropdown toggle
const navDropdown = document.querySelector(".nav-dropdown")

if (navDropdown) {
  const dropdownToggle = navDropdown.querySelector(".dropdown-toggle")
  const dropdownLinks = navDropdown.querySelectorAll("a")

  const closeDropdown = () => {
    navDropdown.classList.remove("open")
    dropdownToggle.setAttribute("aria-expanded", "false")
  }

  dropdownToggle.addEventListener("click", (event) => {
    event.stopPropagation()
    const isOpen = navDropdown.classList.toggle("open")
    dropdownToggle.setAttribute("aria-expanded", isOpen)
  })

  dropdownLinks.forEach((link) => {
    link.addEventListener("click", () => {
      closeDropdown()
    })
  })

  document.addEventListener("click", (event) => {
    if (!navDropdown.contains(event.target)) {
      closeDropdown()
    }
  })
}

// Slider functionality
const slides = document.querySelectorAll(".slide")
const prevBtn = document.getElementById("prevBtn")
const nextBtn = document.getElementById("nextBtn")
const sliderDots = document.getElementById("sliderDots")

let currentSlide = 0

if (slides.length && prevBtn && nextBtn && sliderDots) {
  // Create dots
  slides.forEach((_, index) => {
    const dot = document.createElement("div")
    dot.classList.add("dot")
    if (index === 0) dot.classList.add("active")
    dot.addEventListener("click", () => goToSlide(index))
    sliderDots.appendChild(dot)
  })

  const dots = document.querySelectorAll(".dot")

  function goToSlide(n) {
    slides[currentSlide].classList.remove("active")
    dots[currentSlide].classList.remove("active")

    currentSlide = (n + slides.length) % slides.length

    slides[currentSlide].classList.add("active")
    dots[currentSlide].classList.add("active")
  }

  function nextSlide() {
    goToSlide(currentSlide + 1)
  }

  function prevSlide() {
    goToSlide(currentSlide - 1)
  }

  prevBtn.addEventListener("click", prevSlide)
  nextBtn.addEventListener("click", nextSlide)

  // Auto advance slides
  let slideInterval = setInterval(nextSlide, 5000)

  // Pause auto-advance on hover
  const slider = document.querySelector(".slider")
  const heroSlider = document.querySelector(".hero-slider")

  if (heroSlider) {
    heroSlider.addEventListener("mouseenter", () => {
      clearInterval(slideInterval)
    })

    heroSlider.addEventListener("mouseleave", () => {
      slideInterval = setInterval(nextSlide, 5000)
    })
  }
}

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault()
    const target = document.querySelector(this.getAttribute("href"))
    if (target) {
      const headerOffset = 70
      const elementPosition = target.offsetTop
      const offsetPosition = elementPosition - headerOffset

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      })
    }
  })
})



const annotateVatIncluded = () => {
  document.querySelectorAll('.price').forEach((price) => {
    if (price.querySelector('.vat') || !/AED\s*\d/i.test(price.textContent)) return

    const amount = price.textContent.trim()
    price.textContent = ''
    price.classList.add('price-stack')

    const amountLabel = document.createElement('span')
    amountLabel.className = 'price-amount'
    amountLabel.textContent = amount

    const vatLabel = document.createElement('span')
    vatLabel.className = 'vat'
    vatLabel.textContent = 'VAT included'

    price.append(amountLabel, vatLabel)
  })
}

annotateVatIncluded()

// Gallery hero video controls
const galleryHero = document.querySelector(".gallery-hero")

if (galleryHero) {
  const heroVideo = galleryHero.querySelector(".hero-video")
  const toggleBtn = document.getElementById("heroToggleBtn")
  const muteBtn = document.getElementById("heroMuteBtn")

  const updateToggleLabel = () => {
    if (!toggleBtn) return
    const isPaused = heroVideo.paused
    toggleBtn.textContent = isPaused ? "Play" : "Pause"
  }

  const updateMuteLabel = () => {
    muteBtn.textContent = heroVideo.muted ? "Unmute" : "Mute"
  }

  const requestHeroPlayback = () => {
    heroVideo.muted = false
    const playAttempt = heroVideo.play()

    if (playAttempt && typeof playAttempt.catch === "function") {
      playAttempt.catch(() => {
        const unlockPlayback = () => {
          heroVideo.muted = false
          heroVideo.play().finally(() => {
            document.removeEventListener("touchstart", unlockPlayback)
            document.removeEventListener("click", unlockPlayback)
          })
        }

        document.addEventListener("touchstart", unlockPlayback, { once: true })
        document.addEventListener("click", unlockPlayback, { once: true })
      })
    }
  }

  requestHeroPlayback()

  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      if (heroVideo.paused) {
        heroVideo.muted = false
        heroVideo.play()
      } else {
        heroVideo.pause()
      }
      updateToggleLabel()
    })
  }

  muteBtn.addEventListener("click", () => {
    heroVideo.muted = !heroVideo.muted
    updateMuteLabel()
  })

  heroVideo.addEventListener("play", updateToggleLabel)
  heroVideo.addEventListener("pause", updateToggleLabel)

  updateToggleLabel()
  updateMuteLabel()
}

// Therapists Slider
const therapistsSlider = document.getElementById("therapistsSlider")
const therapistPrevBtn = document.getElementById("therapistPrevBtn")
const therapistNextBtn = document.getElementById("therapistNextBtn")
const therapistButtonsAreLinks =
  therapistPrevBtn?.hasAttribute("href") || therapistNextBtn?.hasAttribute("href")
const therapistFilterButtons = document.querySelectorAll(".therapist-filter-btn[data-filter]")

if (therapistsSlider && therapistPrevBtn && therapistNextBtn && !therapistButtonsAreLinks && window.Swiper) {
  const therapistSwiper = new Swiper(therapistsSlider, {
    loop: true,
    speed: 450,
    slidesPerView: "auto",
    spaceBetween: 24,
    navigation: {
      nextEl: therapistNextBtn,
      prevEl: therapistPrevBtn
    },
    loopAdditionalSlides: 3,
    watchSlidesProgress: true,
    slideToClickedSlide: true,
    breakpoints: {
      0: {
        spaceBetween: 12
      },
      640: {
        spaceBetween: 16
      },
      1024: {
        spaceBetween: 24
      }
    }
  })

  if (therapistFilterButtons.length) {
    therapistFilterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const selectedFilter = button.dataset.filter || "all"

        therapistFilterButtons.forEach((item) => {
          item.classList.toggle("active", item === button)
        })

        therapistsSlider.querySelectorAll(".therapist-card").forEach((card) => {
          const cardGender = card.dataset.gender || ""
          const isVisible = selectedFilter === "all" || cardGender === selectedFilter
          card.classList.toggle("therapist-hidden", !isVisible)
        })

        therapistSwiper.update()
        therapistSwiper.slideToLoop(0, 0)
      })
    })
  }
}

// Header scroll effect
let lastScroll = 0
const header = document.querySelector(".header")

window.addEventListener("scroll", () => {
  const currentScroll = window.pageYOffset

  if (currentScroll > 100) {
    header.style.padding = "10px 0"
    header.style.boxShadow = "0 2px 30px rgba(0, 0, 0, 0.15)"
  } else {
    header.style.padding = "15px 0"
    header.style.boxShadow = "0 2px 20px rgba(0, 0, 0, 0.1)"
  }

  lastScroll = currentScroll
})

const hasFinePointer = window.matchMedia('(pointer: fine)').matches

const initCustomVideoControls = (videos) => {
    const playIcon = `
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 4.5L19 12L6 19.5V4.5Z" fill="currentColor"/>
        </svg>
    `

    const pauseIcon = `
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 4H10V20H6V4Z" fill="currentColor"/>
            <path d="M14 4H18V20H14V4Z" fill="currentColor"/>
        </svg>
    `

    videos.forEach(video => {
        if (!hasFinePointer) {
            video.addEventListener('mouseenter', () => {
                if (video.paused) {
                    video.play()
                }
            })
        }

        const container = video.closest('.gallery-item, .signature-video')

        if (container && !container.querySelector('.signature-play-btn')) {
            const toggleBtn = document.createElement('button')
            toggleBtn.className = 'signature-play-btn'
            toggleBtn.type = 'button'

            if (container.classList.contains('gallery-item')) {
                toggleBtn.classList.add('gallery-play-toggle')
            }

            const updateButton = () => {
                const isPaused = video.paused
                toggleBtn.innerHTML = `${isPaused ? playIcon : pauseIcon}<span>${isPaused ? "Play" : "Pause"}</span>`
                toggleBtn.setAttribute('aria-label', isPaused ? 'Play video' : 'Pause video')
                toggleBtn.style.opacity = isPaused ? '1' : '0.2'
            }

            const togglePlayback = () => {
                if (video.paused) {
                    video.play()
                } else {
                    video.pause()
                }
            }

            toggleBtn.addEventListener('click', (event) => {
                event.stopPropagation()
                togglePlayback()
            })

            video.addEventListener('click', () => {
                togglePlayback()
            })

            video.addEventListener('play', updateButton)
            video.addEventListener('pause', updateButton)

            updateButton()
            container.appendChild(toggleBtn)
        }
    })
}

initCustomVideoControls(document.querySelectorAll('.gallery-section .gallery-item video'))

// Gallery pagination for mobile
const galleryGrid = document.querySelector('.gallery-grid')
const galleryItems = galleryGrid ? Array.from(galleryGrid.querySelectorAll('.gallery-item')) : []
const galleryControls = document.getElementById('galleryControls')
const gallerySeeMoreBtn = document.getElementById('gallerySeeMore')

let visibleGalleryCount = Math.min(5, galleryItems.length)

const updateGalleryDisplay = () => {
    galleryItems.forEach((item, index) => {
        item.classList.toggle('is-hidden-mobile', index >= visibleGalleryCount)
    })

    if (!galleryControls || !gallerySeeMoreBtn) return

    const shouldShowButton = visibleGalleryCount < galleryItems.length
    galleryControls.style.display = shouldShowButton ? 'flex' : 'none'
}

if (galleryItems.length && gallerySeeMoreBtn) {
    updateGalleryDisplay()

    gallerySeeMoreBtn.addEventListener('click', () => {
        visibleGalleryCount = galleryItems.length
        updateGalleryDisplay()
    })
}

// Team slider controls
const teamSliderTrack = document.getElementById('teamSlider')
const teamSlides = teamSliderTrack ? Array.from(teamSliderTrack.querySelectorAll('.team-slide')) : []
const teamPrevBtn = document.getElementById('teamPrevBtn')
const teamNextBtn = document.getElementById('teamNextBtn')
let teamCurrentIndex = 0

const updateTeamSlider = () => {
  if (!teamSliderTrack || !teamSlides.length) return

  const sliderStyles = window.getComputedStyle(teamSliderTrack)
  const gap = parseFloat(sliderStyles.getPropertyValue('column-gap') || sliderStyles.getPropertyValue('gap') || '0')
  const slideWidth = teamSlides[0].getBoundingClientRect().width
  const trackWidth = teamSliderTrack.getBoundingClientRect().width
  const perView = Math.max(Math.floor((trackWidth + gap) / (slideWidth + gap)), 1)
  const maxIndex = Math.max(teamSlides.length - perView, 0)

  if (maxIndex === 0) {
    teamCurrentIndex = 0
  } else if (teamCurrentIndex > maxIndex) {
    teamCurrentIndex = 0
  } else if (teamCurrentIndex < 0) {
    teamCurrentIndex = maxIndex
  }

  const offset = -(slideWidth + gap) * teamCurrentIndex
  teamSliderTrack.style.transform = `translateX(${offset}px)`

  const controlsDisabled = maxIndex === 0
  if (teamPrevBtn) teamPrevBtn.disabled = controlsDisabled
  if (teamNextBtn) teamNextBtn.disabled = controlsDisabled
}

if (teamSlides.length && teamSliderTrack) {
  updateTeamSlider()

  window.addEventListener('resize', () => {
    updateTeamSlider()
  })

  if (teamPrevBtn) {
    teamPrevBtn.addEventListener('click', () => {
      teamCurrentIndex -= 1
      updateTeamSlider()
    })
  }

  if (teamNextBtn) {
    teamNextBtn.addEventListener('click', () => {
      teamCurrentIndex += 1
      updateTeamSlider()
    })
  }
}

document.querySelectorAll('.signature-toggle').forEach(button => {
    button.addEventListener('click', () => {
        const text = button.previousElementSibling;

        text.classList.toggle('collapsed');

        button.textContent = text.classList.contains('collapsed')
            ? 'Explore more'
            : 'Show less';
    });
});

// Services "See more" toggle for mobile
const servicesGrid = document.querySelector('.services-grid');
const serviceCards = document.querySelectorAll('.services-grid .service-card');
const servicesSeeMoreBtn = document.getElementById('servicesSeeMore');
let servicesExpanded = false;

const updateServicesVisibility = () => {
  if (!servicesSeeMoreBtn || serviceCards.length === 0 || !servicesGrid) return;

  const isMobile = window.innerWidth <= 768;
  const hasExtraCards = serviceCards.length > 5;

  if (!isMobile) {
    servicesGrid.classList.remove('services-collapsed', 'services-expanded');
    serviceCards.forEach((card) => card.classList.remove('service-hidden'));
    servicesSeeMoreBtn.style.display = 'none';
    servicesSeeMoreBtn.textContent = 'See more';
    servicesExpanded = false;
    return;
  }

  servicesGrid.classList.toggle('services-expanded', servicesExpanded);
  servicesGrid.classList.toggle('services-collapsed', !servicesExpanded);
  servicesSeeMoreBtn.style.display = hasExtraCards ? 'inline-flex' : 'none';
  servicesSeeMoreBtn.textContent = servicesExpanded ? 'See less' : 'See more';

  serviceCards.forEach((card, index) => {
    if (!servicesExpanded && index >= 5) {
      card.classList.add('service-hidden');
    } else {
      card.classList.remove('service-hidden');
    }
  });
};

if (servicesSeeMoreBtn && serviceCards.length > 0) {
  servicesSeeMoreBtn.addEventListener('click', () => {
    servicesExpanded = !servicesExpanded;
    updateServicesVisibility();
  });

  updateServicesVisibility();
  window.addEventListener('resize', updateServicesVisibility);
}

// Footer logo behavior
const footerLogoLink = document.querySelector('.footer-logo-link');

if (footerLogoLink) {
  footerLogoLink.addEventListener('click', (event) => {
    const path = window.location.pathname;
    const isHomePage = path === '/' || path.endsWith('/index') || path.endsWith('/index/');

    if (isHomePage) {
      event.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });
}
