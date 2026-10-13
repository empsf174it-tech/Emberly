/**
 * Emberly Main Global Controller
 * Manages responsive navigation, mobile drawer accordion, scroll reveal,
 * toast messaging, and global interactive utilities.
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileDrawer();
  initScrollReveal();
  initNewsletter();
});

/* ==========================================================================
   NAVBAR & DROPDOWNS
   ========================================================================== */
function initNavbar() {
  const header = document.querySelector('.site-header');
  const dropdownItem = document.querySelector('.nav-item.dropdown');
  const dropdownTrigger = dropdownItem ? dropdownItem.querySelector('.nav-link') : null;
  const dropdownMenu = dropdownItem ? dropdownItem.querySelector('.nav-dropdown-menu') : null;

  // Sticky header elevate effect
  window.addEventListener('scroll', () => {
    if (!header) return;
    if (window.scrollY > 20) {
      header.style.boxShadow = '0 4px 20px rgba(28, 22, 19, 0.08)';
    } else {
      header.style.boxShadow = 'none';
    }
  }, { passive: true });

  // Accessible keyboard control for Services dropdown
  if (dropdownTrigger && dropdownMenu) {
    dropdownTrigger.setAttribute('aria-haspopup', 'true');
    dropdownTrigger.setAttribute('aria-expanded', 'false');

    dropdownTrigger.addEventListener('focus', () => {
      dropdownTrigger.setAttribute('aria-expanded', 'true');
    });

    dropdownItem.addEventListener('mouseenter', () => {
      dropdownTrigger.setAttribute('aria-expanded', 'true');
    });

    dropdownItem.addEventListener('mouseleave', () => {
      dropdownTrigger.setAttribute('aria-expanded', 'false');
    });

    const menuLinks = dropdownMenu.querySelectorAll('a');
    const lastMenuLink = menuLinks[menuLinks.length - 1];

    if (lastMenuLink) {
      lastMenuLink.addEventListener('blur', () => {
        dropdownTrigger.setAttribute('aria-expanded', 'false');
      });
    }
  }
}

/* ==========================================================================
   MOBILE MENU DRAWER (<= 1024px)
   ========================================================================== */
function initMobileDrawer() {
  const toggleBtn = document.querySelector('.menu-toggle-btn');
  const drawer = document.querySelector('.mobile-nav-drawer');
  const backdrop = document.querySelector('.mobile-nav-backdrop');
  const closeBtn = document.querySelector('.drawer-close-btn');
  const accordionToggle = document.querySelector('.mobile-accordion-toggle');
  const subMenu = document.querySelector('.mobile-sub-menu');

  if (!toggleBtn || !drawer || !backdrop) return;

  function openDrawer() {
    drawer.classList.add('open');
    backdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
    if (closeBtn) closeBtn.focus();
  }

  function closeDrawer() {
    drawer.classList.remove('open');
    backdrop.classList.remove('open');
    document.body.style.overflow = '';
  }

  toggleBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  backdrop.addEventListener('click', closeDrawer);

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('open')) {
      closeDrawer();
    }
  });

  // Services accordion inside mobile drawer
  if (accordionToggle && subMenu) {
    accordionToggle.addEventListener('click', (e) => {
      e.preventDefault();
      const isExpanded = subMenu.classList.contains('open');
      subMenu.classList.toggle('open');
      accordionToggle.setAttribute('aria-expanded', !isExpanded);
      const icon = accordionToggle.querySelector('i:last-child');
      if (icon) {
        icon.className = isExpanded ? 'ph ph-caret-down' : 'ph ph-caret-up';
      }
    });
  }

  // Close drawer when mobile nav sub-links are clicked
  document.querySelectorAll('.mobile-sub-link, .mobile-nav-link:not(.mobile-accordion-toggle)').forEach(link => {
    link.addEventListener('click', () => {
      closeDrawer();
    });
  });
}

/* ==========================================================================
   SCROLL REVEAL (Restrained, respectful of prefers-reduced-motion)
   ========================================================================== */
function initScrollReveal() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const revealTargets = document.querySelectorAll('.section, .product-card, .testimonial-card, .team-card, .service-pkg-card');

  if (!('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  revealTargets.forEach(el => {
    el.style.opacity = '0.9';
    el.style.transform = 'translateY(12px)';
    el.style.transition = 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
    observer.observe(el);
  });
}

/* ==========================================================================
   NEWSLETTER SUBSCRIPTION FORM
   ========================================================================== */
function initNewsletter() {
  const form = document.getElementById('newsletter-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = document.getElementById('newsletter-email');
    if (!input) return;

    const email = input.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || !emailRegex.test(email)) {
      showToast('Please enter a valid email address.');
      input.focus();
      return;
    }

    /* <!-- Mailchimp embed placeholder: sync with list MC_EMBERLY_DISPATCHES --> */
    showToast('Subscribed! You’ll receive our monthly cupping & grind logs.');
    input.value = '';
  });
}

/* ==========================================================================
   GLOBAL TOAST MESSAGING
   ========================================================================== */
window.showToast = (message) => {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <i class="ph ph-coffee" style="color: var(--color-accent); font-size: 1.25rem;"></i>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  // Force reflow for CSS transition
  void toast.offsetWidth;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 300);
  }, 3500);
};

/* Premium layer: header scroll state + scroll reveal */
(function () {
  const header = document.querySelector('.site-header');
  if (header) {
    const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }
  if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const targets = document.querySelectorAll('.section-header, .product-card, .testimonial-card, .team-card, .service-pkg-card, .trust-item, .newsletter-card, .finder-card, .page-hero .container');
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  targets.forEach((el, i) => {
    if (el.closest('#shop-products-grid, #home-featured-grid')) return;
    el.classList.add('reveal');
    el.style.transitionDelay = (i % 4) * 70 + 'ms';
    io.observe(el);
  });
})();

/* Back to top button */
(function () {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'back-to-top';
  btn.setAttribute('aria-label', 'Back to top');
  btn.innerHTML = '<i class="ph ph-arrow-up"></i>';
  document.body.appendChild(btn);
  const toggle = () => btn.classList.toggle('show', window.scrollY > 500);
  toggle();
  window.addEventListener('scroll', toggle, { passive: true });
  btn.addEventListener('click', () => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
  });
})();
