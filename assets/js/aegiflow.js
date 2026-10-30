/* ==========================================================================
   AEGIFLOW — Front-end behaviour (shared by all pages)
   - No inline handlers: compatible with CSP `script-src 'self'`
   - Pages are pre-rendered per language (/, /en, /es): no client-side i18n
   ========================================================================== */
(() => {
  'use strict';

  const root = document.documentElement;
  root.classList.add('js');

  const lang = (root.lang || 'fr').slice(0, 2).toLowerCase();
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------------------------
     0. Local preview support (file:// or localhost Live Server)
        Keeps clean URLs in HTML for Googlebot/Vercel while allowing local
        browsing by double-clicking any .html file on disk.
     --------------------------------------------------------------------- */
  const isLocalPreview =
    window.location.protocol === 'file:' ||
    /^(localhost|127\.0\.0\.1)$/.test(window.location.hostname);
  const relRoot = root.dataset.root || '.';

  function toLocalHref(rawHref) {
    if (!rawHref || !rawHref.startsWith('/') || rawHref.startsWith('//')) return rawHref;
    const [pathname, hash] = rawHref.split('#');
    const filePart =
      pathname === '/'
        ? '/index.html'
        : /\.\w+$/.test(pathname)
          ? pathname
          : `${pathname}.html`;
    return `${relRoot}${filePart}${hash ? `#${hash}` : ''}`;
  }

  if (isLocalPreview) {
    $$('a[href^="/"]').forEach((a) => {
      a.setAttribute('href', toLocalHref(a.getAttribute('href')));
    });
  }

  /* ---------------------------------------------------------------------
     1. Mobile / tablet drawer
     --------------------------------------------------------------------- */
  const navbar = $('#main-navbar');
  const toggle = $('#nav-toggle');
  const drawer = $('#mobile-nav');
  const backdrop = $('#mobile-nav-backdrop');

  const isDrawerOpen = () => !!(toggle && toggle.classList.contains('open'));

  function syncScrollLock() {
    const locked = isDrawerOpen() || !!$('.modal-backdrop.open');
    document.body.classList.toggle('no-scroll', locked);
  }

  function setDrawer(open) {
    if (!toggle || !drawer) return;
    toggle.classList.toggle('open', open);
    drawer.classList.toggle('open', open);
    if (backdrop) backdrop.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
    drawer.setAttribute('aria-hidden', String(!open));
    if (open) drawer.removeAttribute('inert');
    else drawer.setAttribute('inert', '');
    syncScrollLock();
  }

  if (toggle) toggle.addEventListener('click', () => setDrawer(!isDrawerOpen()));
  if (backdrop) backdrop.addEventListener('click', () => setDrawer(false));
  $$('[data-close-nav]').forEach((el) => el.addEventListener('click', () => setDrawer(false)));
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 1100) setDrawer(false);
  }, { passive: true });

  /* ---------------------------------------------------------------------
     2. Header state + back-to-top button
     --------------------------------------------------------------------- */
  const fabTop = $('#fab-back-to-top');
  let ticking = false;
  function onScroll() {
    const y = window.scrollY;
    if (navbar) navbar.classList.toggle('scrolled', y > 20);
    if (fabTop) fabTop.classList.toggle('visible', y > 280);
    ticking = false;
  }
  window.addEventListener('scroll', () => {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(onScroll);
    }
  }, { passive: true });
  onScroll();

  if (fabTop) {
    fabTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  }

  const fabContact = $('#fab-contact');
  if (fabContact && $('#contact')) {
    fabContact.addEventListener('click', () => {
      window.setTimeout(() => {
        const input = $('#f-name');
        if (input) input.focus({ preventScroll: true });
      }, 600);
    });
  }

  /* ---------------------------------------------------------------------
     3. ScrollSpy for the desktop dock (home pages only)
     --------------------------------------------------------------------- */
  const dockLinks = $$('.nav-dock-link[data-section]');
  const spySections = dockLinks
    .map((link) => document.getElementById(link.getAttribute('data-section')))
    .filter(Boolean);

  if ('IntersectionObserver' in window && spySections.length) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = entry.target.id;
        dockLinks.forEach((link) => {
          const active = link.getAttribute('data-section') === id;
          link.classList.toggle('active', active);
          if (active) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-35% 0px -55% 0px', threshold: 0 });
    spySections.forEach((sec) => spy.observe(sec));
  }

  /* ---------------------------------------------------------------------
     4. Legal modals (focus management + focus trap)
     --------------------------------------------------------------------- */
  let lastFocus = null;

  function openModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;
    lastFocus = document.activeElement;
    setDrawer(false);
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    syncScrollLock();
    const closeBtn = $('.modal-close', modal);
    if (closeBtn) closeBtn.focus();
  }

  function closeModal(modal) {
    if (!modal || !modal.classList.contains('open')) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    syncScrollLock();
    if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus();
  }

  $$('[data-modal-open]').forEach((btn) => {
    btn.addEventListener('click', () => openModal(btn.getAttribute('data-modal-open')));
  });

  $$('.modal-backdrop').forEach((modal) => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal(modal);
    });
    $$('[data-modal-close]', modal).forEach((btn) => btn.addEventListener('click', () => closeModal(modal)));
  });

  document.addEventListener('keydown', (e) => {
    const openModalEl = $('.modal-backdrop.open');
    if (e.key === 'Escape') {
      if (openModalEl) closeModal(openModalEl);
      else setDrawer(false);
      return;
    }
    if (e.key === 'Tab' && openModalEl) {
      const focusables = $$('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])', openModalEl);
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });

  /* ---------------------------------------------------------------------
     5. Secure contact form → /api/contact
     --------------------------------------------------------------------- */
  const form = $('#aegiflow-contact-form');
  if (form) {
    const loadedAt = Date.now();
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const statusBox = $('#form-status');
      const submitBtn = $('#form-submit-btn');
      const hp = form.elements.namedItem('website_hp');

      if (hp && hp.value.trim() !== '') return;

      const originalText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = form.dataset.msgSending || '…';
      statusBox.className = 'form-status';
      statusBox.textContent = '';

      const field = (name) => {
        const el = form.elements.namedItem(name);
        return el ? el.value.trim() : '';
      };

      const payload = {
        name: field('NAME'),
        email: field('EMAIL'),
        company: field('COMPANY'),
        message: field('MESSAGE'),
        lang,
        website_hp: hp ? hp.value : '',
        elapsed_ms: Date.now() - loadedAt
      };

      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await response.json().catch(() => ({}));

        if (response.ok && data.success) {
          statusBox.textContent = form.dataset.msgOk || data.message || 'OK';
          statusBox.className = 'form-status success';
          form.reset();
        } else {
          statusBox.textContent = data.error || form.dataset.msgErr;
          statusBox.className = 'form-status error';
        }
      } catch (err) {
        statusBox.textContent = form.dataset.msgErr;
        statusBox.className = 'form-status error';
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }
    });
  }

  /* ---------------------------------------------------------------------
     6. Scroll reveal + KPI counters
     --------------------------------------------------------------------- */
  const revealEls = $$('.reveal');
  if (!reduceMotion && 'IntersectionObserver' in window && revealEls.length) {
    const revealer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        el.classList.add('is-visible');
        obs.unobserve(el);
        // Hand transforms back to hover effects once the entrance is done
        window.setTimeout(() => el.classList.remove('reveal', 'is-visible'), 1100);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    revealEls.forEach((el) => revealer.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.remove('reveal'));
  }

  const counters = $$('[data-count]');
  if (!reduceMotion && 'IntersectionObserver' in window && counters.length) {
    const fmt = (value, decimals) => new Intl.NumberFormat(lang, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(value);

    const countObs = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        obs.unobserve(el);
        const target = parseFloat(el.dataset.count);
        const decimals = parseInt(el.dataset.decimals || '0', 10);
        const prefix = el.dataset.prefix || '';
        const suffix = el.dataset.suffix || '';
        const finalText = el.textContent;
        const duration = 1400;
        const start = performance.now();
        const step = (now) => {
          const p = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          el.textContent = prefix + fmt(target * eased, decimals) + suffix;
          if (p < 1) window.requestAnimationFrame(step);
          else el.textContent = finalText;
        };
        window.requestAnimationFrame(step);
      });
    }, { threshold: 0.6 });
    counters.forEach((el) => countObs.observe(el));
  }

  /* ---------------------------------------------------------------------
     7. Card spotlight (cursor-following glow)
     --------------------------------------------------------------------- */
  if (window.matchMedia('(hover: hover)').matches) {
    $$('.card').forEach((card) => {
      card.addEventListener('pointermove', (e) => {
        const r = card.getBoundingClientRect();
        card.style.setProperty('--mx', `${e.clientX - r.left}px`);
        card.style.setProperty('--my', `${e.clientY - r.top}px`);
      });
    });
  }

  /* ---------------------------------------------------------------------
     8. Language suggestion toast (never redirects automatically)
     --------------------------------------------------------------------- */
  const LANG_KEY = 'aegiflow_lang_choice';
  const SUGGEST = {
    fr: { text: 'Ce site est aussi disponible en français.', cta: 'Voir en français', close: 'Fermer' },
    en: { text: 'This site is also available in English.', cta: 'View in English', close: 'Close' },
    es: { text: 'Este sitio también está disponible en español.', cta: 'Ver en español', close: 'Cerrar' }
  };

  $$('[data-lang-link]').forEach((link) => {
    link.addEventListener('click', () => {
      try { localStorage.setItem(LANG_KEY, link.getAttribute('hreflang') || '1'); } catch (e) { /* storage disabled */ }
    });
  });

  try {
    const stored = localStorage.getItem(LANG_KEY);
    const browser = ((navigator.languages && navigator.languages[0]) || navigator.language || '').slice(0, 2).toLowerCase();
    const alt = SUGGEST[browser] && document.querySelector(`link[rel="alternate"][hreflang="${browser}"]`);
    if (!stored && browser && browser !== lang && alt) {
      const t = SUGGEST[browser];
      const toast = document.createElement('div');
      toast.className = 'lang-toast';
      toast.setAttribute('role', 'status');
      toast.setAttribute('lang', browser);
      toast.setAttribute('data-nosnippet', '');

      const text = document.createElement('span');
      text.textContent = t.text;

      const link = document.createElement('a');
      const localBtn = $(`.lang-btn[hreflang="${browser}"]`);
      link.href = (isLocalPreview && localBtn) ? localBtn.getAttribute('href') : alt.getAttribute('href');
      link.hreflang = browser;
      link.textContent = `${t.cta} →`;

      const close = document.createElement('button');
      close.type = 'button';
      close.setAttribute('aria-label', t.close);
      close.textContent = '✕';

      const remember = (value) => {
        try { localStorage.setItem(LANG_KEY, value); } catch (e) { /* storage disabled */ }
      };
      link.addEventListener('click', () => remember(browser));
      close.addEventListener('click', () => {
        remember(lang);
        toast.classList.remove('show');
        window.setTimeout(() => toast.remove(), 400);
      });

      toast.append(text, link, close);
      document.body.appendChild(toast);
      window.setTimeout(() => toast.classList.add('show'), 1400);
    }
  } catch (e) {
    /* localStorage unavailable: skip suggestion */
  }
})();
