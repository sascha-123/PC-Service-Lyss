import "./style.css";

/* ============================================================
   PC-Service Lyss - LANDING PAGE INTERACTIONS
   Vanilla JS: mobile nav, scroll reveal, navbar state,
   back-to-top, FAQ icon sync, form validation, smooth scroll.
   ============================================================ */

/* ---------- 1. DOM REFERENCES ---------- */
const navbar = document.getElementById('navbar') as HTMLElement;
const navToggle = document.getElementById('navToggle') as HTMLButtonElement;
const navMenu = document.getElementById('navMenu') as HTMLElement;
const backToTop = document.getElementById('backToTop') as HTMLButtonElement;
const contactForm = document.getElementById('contactForm') as HTMLFormElement;
const formSuccess = document.getElementById('formSuccess') as HTMLParagraphElement;
const yearSpan = document.getElementById('year') as HTMLSpanElement;

/* ---------- 2. CURRENT YEAR IN FOOTER ---------- */
yearSpan.textContent = new Date().getFullYear().toString();

/* ---------- 3. MOBILE NAVIGATION (HAMBURGER) ---------- */
function closeMenu(): void {
  navMenu.classList.remove('open');
  navToggle.classList.remove('active');
  navToggle.setAttribute('aria-expanded', 'false');
  navToggle.setAttribute('aria-label', 'Menü öffnen');
}

function toggleMenu(): void {
  const isOpen = navMenu.classList.toggle('open');
  navToggle.classList.toggle('active', isOpen);
  navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  navToggle.setAttribute('aria-label', isOpen ? 'Menü schliessen' : 'Menü öffnen');
}

navToggle.addEventListener('click', toggleMenu);

// Close mobile menu when a link is clicked
navMenu.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', closeMenu);
});

// Close menu when clicking outside
document.addEventListener('click', (e: MouseEvent) => {
  const target = e.target as Node;
  if (!navMenu.contains(target) && !navToggle.contains(target)) {
    closeMenu();
  }
});

// Close menu on Escape
document.addEventListener('keydown', (e: KeyboardEvent) => {
  if (e.key === 'Escape') closeMenu();
});

/* ---------- 4. NAVBAR & BACK-TO-TOP ON SCROLL ---------- */
function handleScroll(): void {
  const scrolled = window.scrollY > 40;
  navbar.classList.toggle('scrolled', scrolled);
  backToTop.classList.toggle('visible', window.scrollY > 600);
}

window.addEventListener('scroll', handleScroll, { passive: true });
handleScroll();

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ---------- 5. SCROLL REVEAL ANIMATIONS ---------- */
const revealElements = document.querySelectorAll<HTMLElement>('.reveal');

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target as HTMLElement;
        const delay = el.dataset.delay ? parseInt(el.dataset.delay, 10) : 0;
        window.setTimeout(() => el.classList.add('visible'), delay);
        revealObserver.unobserve(el);
      }
    });
  },
  { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
);

revealElements.forEach((el) => revealObserver.observe(el));

/* ---------- 6. FAQ: SYNC ICON STATE WITH DETAILS ---------- */
const faqItems = document.querySelectorAll<HTMLDetailsElement>('.faq-item');

faqItems.forEach((item) => {
  item.addEventListener('toggle', () => {
    // Optional: close other open items for an accordion feel
    if (item.open) {
      faqItems.forEach((other) => {
        if (other !== item && other.open) other.open = false;
      });
    }
  });
});

/* ---------- 7. CONTACT FORM VALIDATION ---------- */
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function setFieldError(field: HTMLElement, hasError: boolean): void {
  const group = field.closest('.form-group') as HTMLElement;
  if (group) group.classList.toggle('invalid', hasError);
}

function validateField(field: HTMLInputElement | HTMLTextAreaElement): boolean {
  const value = field.value.trim();
  let valid = value.length > 0;

  if (field.type === 'email') {
    valid = emailRegex.test(value);
  }

  setFieldError(field, !valid);
  return valid;
}

// Clear error on input
contactForm.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('input, textarea').forEach((field) => {
  field.addEventListener('input', () => setFieldError(field, false));
});

contactForm.addEventListener('submit', async (e: SubmitEvent) => {
  e.preventDefault();

  const nameField = document.getElementById('name') as HTMLInputElement;
  const emailField = document.getElementById('email') as HTMLInputElement;
  const messageField = document.getElementById('message') as HTMLTextAreaElement;

  const results = [
    validateField(nameField),
    validateField(emailField),
    validateField(messageField),
  ];

  if (!results.every(Boolean)) {
    return;
  }

  try {
    const response = await fetch(contactForm.action, {
      method: 'POST',
      body: new FormData(contactForm),
      headers: {
        Accept: 'application/json',
      },
    });

    if (response.ok) {
      contactForm.reset();

      formSuccess.hidden = false;

      setTimeout(() => {
        formSuccess.hidden = true;
      }, 6000);
    } else {
      alert('Beim Senden ist ein Fehler aufgetreten. Bitte versuche es erneut.');
    }
  } catch (error) {
    alert('Es konnte keine Verbindung hergestellt werden.');
  }
});

/* ---------- 8. SMOOTH SCROLL OFFSET FIX ---------- */
// Native CSS scroll-padding handles offset; this is a fallback for older browsers.
document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (e) => {
    const href = anchor.getAttribute('href');
    if (!href || href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
