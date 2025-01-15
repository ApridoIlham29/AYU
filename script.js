// Utility function for debouncing
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

// Main initialization
document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const preloader = document.getElementById('preloader');
  const header = document.getElementById('header');
  const navMenu = document.getElementById('nav-menu');
  const navToggle = document.getElementById('nav-toggle');
  const navClose = document.getElementById('nav-close');
  const navLinks = document.querySelectorAll('.nav__link');
  const bgAudio = document.getElementById('bg-audio');
  const scrollUpBtn = document.getElementById('scroll-up');
  const sections = document.querySelectorAll('section[id]');
  const galleryImages = document.querySelectorAll('.gallery__image img');

  // Create menu overlay
  const overlay = document.createElement('div');
  overlay.className = 'menu-overlay';
  document.body.appendChild(overlay);

  // Preloader Handler
  const hidePreloader = () => {
      if (preloader) {
          preloader.classList.add('fade-out');
          setTimeout(() => {
              preloader.style.display = 'none';
          }, 1000);
      }
  };

  // Header scroll effect
  const scrollHeader = () => {
      if (header) {
          if (window.scrollY >= 50) {
              header.classList.add('scroll-header');
          } else {
              header.classList.remove('scroll-header');
          }
      }
  };

  // Mobile Menu Handlers
  const toggleMenu = (show) => {
      if (navMenu) {
          navMenu.classList[show ? 'add' : 'remove']('show-menu');
          overlay.classList[show ? 'add' : 'remove']('active');
          document.body.style.overflow = show ? 'hidden' : '';
      }
  };

  const initMobileMenu = () => {
      if (!navMenu || !navToggle || !navClose) return;

      // Show menu
      navToggle.addEventListener('click', () => toggleMenu(true));

      // Hide menu
      navClose.addEventListener('click', () => toggleMenu(false));
      overlay.addEventListener('click', () => toggleMenu(false));

      // Close menu when clicking links
      navLinks.forEach(link => {
          link.addEventListener('click', () => {
              toggleMenu(false);
              
              // Smooth scroll to section
              const target = document.querySelector(link.getAttribute('href'));
              if (target) {
                  const headerOffset = header.offsetHeight;
                  const elementPosition = target.offsetTop;
                  const offsetPosition = elementPosition - headerOffset;

                  window.scrollTo({
                      top: offsetPosition,
                      behavior: 'smooth'
                  });
              }
          });
      });

      // Close menu on resize
      window.addEventListener('resize', () => {
          if (window.innerWidth > 768) {
              toggleMenu(false);
          }
      });
  };

  // Active link handler
  const activeLink = () => {
      const scrollY = window.pageYOffset;
      const headerHeight = header.offsetHeight;

      sections.forEach(section => {
          const sectionTop = section.offsetTop - headerHeight - 20;
          const sectionBottom = sectionTop + section.offsetHeight;
          const sectionId = section.getAttribute('id');
          const navLink = document.querySelector(`.nav__link[href*="#${sectionId}"]`);

          if (scrollY >= sectionTop && scrollY < sectionBottom) {
              navLinks.forEach(link => link.classList.remove('active-link'));
              if (navLink) {
                  navLink.classList.add('active-link');
              }
          }
      });
  };

  // Scroll up button functionality
  const scrollUp = () => {
      if (scrollUpBtn) {
          if (window.scrollY >= 350) {
              scrollUpBtn.classList.add('show-scroll');
          } else {
              scrollUpBtn.classList.remove('show-scroll');
          }
      }
  };

  if (scrollUpBtn) {
      scrollUpBtn.addEventListener('click', (e) => {
          e.preventDefault();
          window.scrollTo({
              top: 0,
              behavior: 'smooth'
          });
      });
  }

  // Smooth scroll for all anchor links
  const initSmoothScroll = () => {
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
          anchor.addEventListener('click', function(e) {
              e.preventDefault();
              const targetId = this.getAttribute('href');
              
              if (targetId === '#') return;

              const targetElement = document.querySelector(targetId);
              if (targetElement) {
                  const headerOffset = header.offsetHeight;
                  const elementPosition = targetElement.offsetTop;
                  const offsetPosition = elementPosition - headerOffset;

                  window.scrollTo({
                      top: offsetPosition,
                      behavior: 'smooth'
                  });
              }
          });
      });
  };

  // Audio handling
  const initAudio = () => {
      if (!bgAudio) return;

      bgAudio.volume = 0.5;

      const audioToggle = document.createElement('button');
      audioToggle.id = 'audio-toggle';
      audioToggle.innerHTML = '<i class="fas fa-volume-up"></i>';
      audioToggle.setAttribute('aria-label', 'Toggle audio');
      document.body.appendChild(audioToggle);

      const toggleAudio = () => {
          if (bgAudio.paused) {
              bgAudio.play().then(() => {
                  audioToggle.innerHTML = '<i class="fas fa-volume-up"></i>';
              }).catch(error => {
                  console.error('Audio playback failed:', error);
                  createAudioNotification();
              });
          } else {
              bgAudio.pause();
              audioToggle.innerHTML = '<i class="fas fa-volume-mute"></i>';
          }
      };

      audioToggle.addEventListener('click', toggleAudio);

      // Auto-play handling
      bgAudio.play().catch(() => {
          console.log("Autoplay prevented. User interaction needed.");
          createAudioNotification();
      });
  };

  const createAudioNotification = () => {
      const notification = document.createElement('div');
      notification.id = 'audio-notification';
      notification.textContent = 'Click anywhere to enable sound';
      document.body.appendChild(notification);

      const enableAudio = () => {
          if (bgAudio) {
              bgAudio.play().then(() => {
                  notification.remove();
              }).catch(console.error);
          }
          document.removeEventListener('click', enableAudio);
      };

      document.addEventListener('click', enableAudio, { once: true });

      // Remove notification after 5 seconds
      setTimeout(() => {
          notification.remove();
      }, 5000);
  };

  // Initialize AOS (Animate on Scroll)
  const initAOS = () => {
      if (typeof AOS !== 'undefined') {
          AOS.init({
              duration: 1000,
              easing: 'ease-in-out',
              once: true,
              mirror: false
          });
      }
  };

  // Initialize Swiper
  const initSwiper = () => {
      if (typeof Swiper !== 'undefined') {
          const gallerySwiper = new Swiper('.gallery-swiper', {
              effect: 'coverflow',
              grabCursor: true,
              centeredSlides: true,
              slidesPerView: 'auto',
              loop: true,
              spaceBetween: 32,
              coverflowEffect: {
                  rotate: 0,
                  stretch: 0,
                  depth: 100,
                  modifier: 1,
                  slideShadows: true
              },
              pagination: {
                  el: '.swiper-pagination',
                  clickable: true,
                  dynamicBullets: true
              },
              autoplay: {
                  delay: 3000,
                  disableOnInteraction: false,
                  pauseOnMouseEnter: true
              },
              breakpoints: {
                  576: { slidesPerView: 2 },
                  768: { slidesPerView: 2 },
                  992: { slidesPerView: 3 }
              }
          });
      }
  };

  // Parallax effect for floating hearts
  const initParallax = () => {
      let ticking = false;

      const parallaxHearts = (event) => {
          if (!ticking) {
              window.requestAnimationFrame(() => {
                  const hearts = document.querySelectorAll('.floating-hearts i');
                  hearts.forEach(heart => {
                      const speed = parseFloat(heart.getAttribute('data-speed')) || 0.5;
                      let x = 0, y = 0;

                      if (event) {
                          const rect = heart.getBoundingClientRect();
                          const centerX = rect.left + rect.width / 2;
                          const centerY = rect.top + rect.height / 2;
                          x = (centerX - event.clientX) * speed / 10;
                          y = (centerY - event.clientY) * speed / 10;
                      }

                      heart.style.transform = `translate(${x}px, ${y}px)`;
                  });
                  ticking = false;
              });
              ticking = true;
          }
      };

      document.addEventListener('mousemove', parallaxHearts);
      parallaxHearts(); // Initial call
  };

  // Image loading error handler
  const initImageErrorHandling = () => {
      galleryImages.forEach(img => {
          img.onerror = function() {
              this.src = 'path/to/fallback-image.jpg';
              this.alt = 'Image not available';
          };
      });
  };

  // Event Listeners with debouncing
  const handleScroll = debounce(() => {
      scrollHeader();
      activeLink();
      scrollUp();
  }, 10);

  // Initialize all features
  const init = () => {
      window.addEventListener('load', hidePreloader);
      window.addEventListener('scroll', handleScroll);
      
      initMobileMenu();
      initSmoothScroll();
      initAudio();
      initAOS();
      initSwiper();
      initParallax();
      initImageErrorHandling();
      
      // Initial calls
      activeLink();
      scrollHeader();
      scrollUp();
  };

  // Start everything
  init();
});