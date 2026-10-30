// ==============================================================================
// AEGIFLOW — Static Site & SEO Generator (Zero dependencies, Node 18+)
// Generates:
//   - /index.html (FR), /en.html (EN), /es.html (ES)
//   - 12 dedicated service pages (4 services × 3 languages)
//   - /404.html, /sitemap.xml (with xhtml:link hreflang), /robots.txt,
//     /llms.txt, /site.webmanifest
// Usage: node scripts/build.mjs
// ==============================================================================

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

import {
  SITE,
  LANGS,
  DEFAULT_LANG,
  OG_LOCALE,
  LANG_LABEL,
  HOME_PATH,
  SERVICES,
  SERVICE_PATH,
  TECH,
  SERVICE_ICON
} from './content/common.mjs';
import fr from './content/fr.mjs';
import en from './content/en.mjs';
import es from './content/es.mjs';

const CONTENT = { fr, en, es };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const TODAY = new Date().toISOString().slice(0, 10);

function hashFile(relPath) {
  const buf = fs.readFileSync(path.join(ROOT, relPath));
  return crypto.createHash('sha256').update(buf).digest('hex').slice(0, 8);
}

const CSS_HASH = hashFile('assets/css/aegiflow.css');
const JS_HASH = hashFile('assets/js/aegiflow.js');

function esc(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function writeOut(relPath, content) {
  const full = path.join(ROOT, relPath);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content, 'utf8');
}

function urlToFile(urlPath) {
  if (urlPath === '/') return 'index.html';
  return `${urlPath.replace(/^\/+/, '')}.html`;
}

function relRoot(urlPath) {
  if (urlPath === '/') return '.';
  const parts = urlPath.replace(/^\/+/, '').split('/');
  const depth = parts.length - 1;
  return depth === 0 ? '.' : Array(depth).fill('..').join('/');
}

const BRAND_SVG = `<svg class="brand-logo" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M50 8 L84 24 V54 C84 74 50 92 50 92 C50 92 16 74 16 54 V24 L50 8 Z" stroke="#00F0FF" stroke-width="5.5" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M32 76 L50 26 L68 76" stroke="#FFFFFF" stroke-width="6.5" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M35 52 C12 36, 12 72, 36 58 L64 46 C88 34, 88 68, 65 54" stroke="#00F0FF" stroke-width="4.5" stroke-linecap="round" />
          <circle cx="50" cy="52" r="5.5" fill="#FFFFFF" />
        </svg>`;

const LINKEDIN_SVG = `<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.53 1.53 0 0 0 0-3.06 1.53 1.53 0 0 0 0 3.06m1.4 9.74v-8.37H5.06v8.37z" /></svg>`;

const ARROW_SVG = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>`;

// -----------------------------------------------------------------------------
// Schema.org JSON-LD Graph Builder
// -----------------------------------------------------------------------------
function buildSchemaGraph({ lang, pagePath, alternates, metaTitle, metaDesc, faqList, serviceKey = null }) {
  const c = CONTENT[lang];
  const canonicalUrl = `${SITE.origin}${pagePath}`;
  const homeUrl = `${SITE.origin}${HOME_PATH[lang]}`;

  const offerCatalogItems = SERVICES.map((k) => ({
    '@type': 'Offer',
    itemOffered: {
      '@type': 'Service',
      name: c.services[k].nav,
      description: c.services[k].meta_desc,
      url: `${SITE.origin}${SERVICE_PATH[k][lang]}`
    }
  }));

  const graph = [
    {
      '@type': ['Organization', 'ProfessionalService', 'SoftwareCompany'],
      '@id': `${SITE.origin}/#organization`,
      name: SITE.name,
      legalName: SITE.name,
      alternateName: SITE.alternateNames,
      url: `${SITE.origin}/`,
      hasMap: SITE.googleMaps,
      slogan: SITE.slogan,
      description: c.home.org_desc,
      email: SITE.email,
      priceRange: '$$$',
      logo: {
        '@type': 'ImageObject',
        '@id': `${SITE.origin}/#logo`,
        url: `${SITE.origin}${SITE.logo}`,
        contentUrl: `${SITE.origin}${SITE.logo}`,
        width: 512,
        height: 512,
        caption: SITE.name
      },
      image: {
        '@type': 'ImageObject',
        url: `${SITE.origin}${SITE.ogImage}`,
        width: SITE.ogImageWidth,
        height: SITE.ogImageHeight
      },
      founder: { '@id': `${SITE.origin}/#founder` },
      sameAs: [...new Set([...SITE.organizationSameAs, ...SITE.founderSameAs])],
      areaServed: [
        { '@type': 'Country', name: 'France' },
        { '@type': 'Country', name: 'Spain' },
        { '@type': 'AdministrativeArea', name: 'European Union' },
        { '@type': 'Place', name: 'Worldwide' }
      ],
      availableLanguage: LANGS,
      knowsAbout: c.home.knows_about,
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'customer support',
        email: SITE.email,
        url: `${homeUrl}#contact`,
        availableLanguage: LANGS
      },
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: c.ui.services_label,
        itemListElement: offerCatalogItems
      }
    },
    {
      '@type': 'Person',
      '@id': `${SITE.origin}/#founder`,
      name: SITE.founder,
      jobTitle: c.home.founder_job,
      worksFor: { '@id': `${SITE.origin}/#organization` },
      url: SITE.linkedinFounder,
      sameAs: SITE.founderSameAs
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE.origin}/#website`,
      url: `${SITE.origin}/`,
      name: SITE.name,
      alternateName: SITE.alternateNames,
      publisher: { '@id': `${SITE.origin}/#organization` },
      inLanguage: LANGS
    },
    {
      '@type': 'WebPage',
      '@id': `${canonicalUrl}#webpage`,
      url: canonicalUrl,
      name: metaTitle,
      description: metaDesc,
      isPartOf: { '@id': `${SITE.origin}/#website` },
      about: { '@id': `${SITE.origin}/#organization` },
      inLanguage: lang
    }
  ];

  if (serviceKey) {
    const svc = c.services[serviceKey];
    graph.push(
      {
        '@type': 'Service',
        '@id': `${canonicalUrl}#service`,
        name: svc.h1,
        serviceType: svc.nav,
        description: svc.meta_desc,
        url: canonicalUrl,
        provider: { '@id': `${SITE.origin}/#organization` },
        areaServed: [
          { '@type': 'Country', name: 'France' },
          { '@type': 'Country', name: 'Spain' },
          { '@type': 'Place', name: 'Worldwide' }
        ],
        availableLanguage: LANGS
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${canonicalUrl}#breadcrumb`,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: c.ui.breadcrumb_home,
            item: homeUrl
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: svc.nav,
            item: canonicalUrl
          }
        ]
      }
    );
  }

  if (faqList && faqList.length) {
    graph.push({
      '@type': 'FAQPage',
      '@id': `${canonicalUrl}#faq`,
      mainEntity: faqList.map((item) => ({
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.a
        }
      }))
    });
  }

  return {
    '@context': 'https://schema.org',
    '@graph': graph
  };
}

// -----------------------------------------------------------------------------
// Head, Header, Drawer, Footer & Modals
// -----------------------------------------------------------------------------
function renderHead({ lang, pagePath, alternates, metaTitle, metaDesc, ogTitle, ogDesc, schemaObj }) {
  const root = relRoot(pagePath);
  const canonicalUrl = `${SITE.origin}${pagePath}`;
  const ogImageUrl = `${SITE.origin}${SITE.ogImage}`;
  const otherLangs = LANGS.filter((l) => l !== lang);

  const hreflangLinks = [
    ...LANGS.map((l) => `  <link rel="alternate" hreflang="${l}" href="${SITE.origin}${alternates[l]}" />`),
    `  <link rel="alternate" hreflang="x-default" href="${SITE.origin}${alternates[DEFAULT_LANG]}" />`
  ].join('\n');

  const ogLocaleAlternates = otherLangs
    .map((l) => `  <meta property="og:locale:alternate" content="${OG_LOCALE[l]}" />`)
    .join('\n');

  return `<!DOCTYPE html>
<html lang="${lang}" class="dark" data-root="${root}">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />

  <meta name="darkreader-lock" />
  <meta name="color-scheme" content="dark only" />
  <meta name="theme-color" content="#01030A" />

  <title>${esc(metaTitle)}</title>
  <meta name="description" content="${esc(metaDesc)}" />
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
  <meta name="author" content="Ousmane Barry — AEGIFLOW" />
  <meta name="application-name" content="AEGIFLOW" />

  <!-- Canonical, LLMs Context & Hreflang Multilingüe SEO -->
  <link rel="canonical" href="${canonicalUrl}" />
  <link rel="llms" type="text/plain" href="${SITE.origin}/llms.txt" />
${hreflangLinks}

  <!-- Open Graph / LinkedIn / Redes Sociales -->
  <meta property="og:type" content="website" />
  <meta property="og:url" content="${canonicalUrl}" />
  <meta property="og:site_name" content="AEGIFLOW" />
  <meta property="og:title" content="${esc(ogTitle)}" />
  <meta property="og:description" content="${esc(ogDesc)}" />
  <meta property="og:image" content="${ogImageUrl}" />
  <meta property="og:image:width" content="${SITE.ogImageWidth}" />
  <meta property="og:image:height" content="${SITE.ogImageHeight}" />
  <meta property="og:image:alt" content="${esc(ogTitle)}" />
  <meta property="og:locale" content="${OG_LOCALE[lang]}" />
${ogLocaleAlternates}

  <!-- Twitter / X Cards -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${esc(ogTitle)}" />
  <meta name="twitter:description" content="${esc(ogDesc)}" />
  <meta name="twitter:image" content="${ogImageUrl}" />

  <!-- Icons & Manifest -->
  <link rel="icon" type="image/svg+xml" href="${root}/favicon.svg" />
  <link rel="icon" type="image/png" sizes="512x512" href="${root}/assets/img/aegiflow-logo-512.png" />
  <link rel="icon" type="image/png" sizes="192x192" href="${root}/assets/img/aegiflow-logo-192.png" />
  <link rel="apple-touch-icon" sizes="180x180" href="${root}/apple-touch-icon.png" />
  <link rel="manifest" href="${root}/site.webmanifest" />

  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@600;700;800&display=swap" rel="stylesheet" />

  <!-- Stylesheet -->
  <link rel="stylesheet" href="${root}/assets/css/aegiflow.css?v=${CSS_HASH}" />

  <!-- Schema.org JSON-LD Entity Graph -->
  <script type="application/ld+json">
${JSON.stringify(schemaObj, null, 2)}
  </script>
</head>`;
}

function renderHeaderAndDrawer({ lang, alternates, isHome, activeServiceKey = null }) {
  const c = CONTENT[lang];
  const ui = c.ui;
  const homeHref = HOME_PATH[lang];
  const anchorPrefix = isHome ? '' : homeHref;
  const contactHref = isHome ? '#contact' : `${homeHref}#contact`;

  const dockContent = isHome
    ? `        <a href="#expertises" class="nav-dock-link" data-section="expertises">${esc(ui.nav_exp)}</a>
        <a href="#cas-usage" class="nav-dock-link" data-section="cas-usage">${esc(ui.nav_usecases)}</a>
        <a href="#comparatif" class="nav-dock-link" data-section="comparatif">${esc(ui.nav_why)}</a>
        <a href="#offres" class="nav-dock-link" data-section="offres">${esc(ui.nav_offers)}</a>
        <a href="#fondateur" class="nav-dock-link" data-section="fondateur">${esc(ui.nav_founder)}</a>
        <a href="#faq" class="nav-dock-link" data-section="faq">${esc(ui.nav_faq)}</a>`
    : SERVICES.map((k) => {
        const active = k === activeServiceKey ? ' active' : '';
        const current = k === activeServiceKey ? ' aria-current="page"' : '';
        return `        <a href="${SERVICE_PATH[k][lang]}" class="nav-dock-link${active}"${current}>${esc(c.services[k].nav)}</a>`;
      }).join('\n');

  const desktopLangBtns = LANGS.map((l) => {
    const active = l === lang ? ' active' : '';
    const current = l === lang ? ' aria-current="page"' : '';
    return `          <a href="${alternates[l]}" hreflang="${l}" data-lang-link class="lang-btn${active}"${current}>${l.toUpperCase()}</a>`;
  }).join('\n');

  const mobileLangBtns = LANGS.map((l) => {
    const active = l === lang ? ' active' : '';
    const current = l === lang ? ' aria-current="page"' : '';
    return `          <a href="${alternates[l]}" hreflang="${l}" data-lang-link class="mobile-lang-btn${active}"${current}>
            <span>${l.toUpperCase()}</span>
            <span class="sub">${esc(LANG_LABEL[l])}</span>
          </a>`;
  }).join('\n');

  const mobileServiceItems = SERVICES.map((k, idx) => {
    const svc = c.services[k];
    return `        <a href="${SERVICE_PATH[k][lang]}" class="mobile-nav-item" data-close-nav>
          <div class="mobile-item-left">
            <span class="mobile-item-num">0${idx + 1}</span>
            <div>
              <div class="mobile-item-title">${esc(svc.nav)}</div>
              <div class="mobile-item-sub">${esc(svc.nav_sub)}</div>
            </div>
          </div>
          <span class="mobile-item-arrow" aria-hidden="true">→</span>
        </a>`;
  }).join('\n');

  return `  <a href="#main-content" class="skip-link">${esc(ui.skip)}</a>

  <!-- BARRA DE NAVEGACIÓN SUPERIOR -->
  <header class="navbar" id="main-navbar">
    <div class="navbar-container">
      <a href="${homeHref}" class="brand" aria-label="${esc(ui.home_aria)}" data-close-nav>
        ${BRAND_SVG}
        <div class="brand-text">
          <span class="brand-name">AEGIFLOW</span>
          <span class="brand-sub">${esc(ui.brand_sub)}</span>
        </div>
        <div class="brand-badge" aria-hidden="true">
          <span class="status-indicator"></span>
          <span>Security by Design</span>
        </div>
      </a>

      <nav class="nav-dock" aria-label="${esc(ui.nav_aria)}">
${dockContent}
      </nav>

      <div class="nav-actions">
        <div class="desktop-lang" role="group" aria-label="${esc(ui.lang_group)}">
${desktopLangBtns}
        </div>

        <a href="${contactHref}" class="btn-cyan nav-cta-btn">
          <span>${esc(ui.nav_cta)}</span>
          ${ARROW_SVG}
        </a>

        <button type="button" class="nav-toggle" id="nav-toggle" aria-label="${esc(ui.menu_open)}" aria-expanded="false" aria-controls="mobile-nav">
          <span class="bar"></span>
          <span class="bar"></span>
          <span class="bar"></span>
        </button>
      </div>
    </div>
  </header>

  <!-- BACKDROP Y DRAWER MÓVIL / TABLET -->
  <div id="mobile-nav-backdrop" class="mobile-nav-backdrop" aria-hidden="true"></div>

  <aside id="mobile-nav" class="mobile-nav" aria-hidden="true" aria-label="${esc(ui.menu_aria)}" inert>
    <div>
      <div class="mobile-nav-header">
        <span class="mobile-nav-header-tag">${esc(ui.mob_nav_header)}</span>
        <span class="mobile-nav-header-sub">Security by Design</span>
      </div>

      <nav class="mobile-nav-links" aria-label="${esc(ui.services_label)}">
${mobileServiceItems}
        <a href="${anchorPrefix}#offres" class="mobile-nav-item" data-close-nav>
          <div class="mobile-item-left">
            <span class="mobile-item-num">05</span>
            <div>
              <div class="mobile-item-title">${esc(ui.nav_offers)}</div>
              <div class="mobile-item-sub">${esc(ui.mob_sub_off)}</div>
            </div>
          </div>
          <span class="mobile-item-arrow" aria-hidden="true">→</span>
        </a>
        <a href="${anchorPrefix}#fondateur" class="mobile-nav-item" data-close-nav>
          <div class="mobile-item-left">
            <span class="mobile-item-num">06</span>
            <div>
              <div class="mobile-item-title">${esc(ui.nav_founder)}</div>
              <div class="mobile-item-sub">${esc(ui.mob_sub_fnd)}</div>
            </div>
          </div>
          <span class="mobile-item-arrow" aria-hidden="true">→</span>
        </a>
      </nav>
    </div>

    <div>
      <div class="mobile-lang-box">
        <span class="mobile-lang-title">${esc(ui.mob_lang_label)}</span>
        <div class="mobile-lang-grid" role="group" aria-label="${esc(ui.lang_group)}">
${mobileLangBtns}
        </div>
      </div>

      <a href="${contactHref}" class="btn-cyan mobile-cta-btn" data-close-nav>
        ${esc(ui.nav_cta)}
      </a>
    </div>
  </aside>`;
}

function renderFooterAndModals({ lang, pagePath, isHome }) {
  const root = relRoot(pagePath);
  const c = CONTENT[lang];
  const ui = c.ui;
  const homeHref = HOME_PATH[lang];
  const anchorPrefix = isHome ? '' : homeHref;
  const contactHref = isHome ? '#contact' : `${homeHref}#contact`;

  const serviceLinks = SERVICES.map(
    (k) => `            <li><a href="${SERVICE_PATH[k][lang]}">${esc(c.services[k].nav)}</a></li>`
  ).join('\n');

  const langLinks = LANGS.map(
    (l) => `            <li><a href="${HOME_PATH[l]}" hreflang="${l}" data-lang-link>${esc(LANG_LABEL[l])} (${l.toUpperCase()})</a></li>`
  ).join('\n');

  return `  <!-- BOTONES FLOTANTES DE ACCIÓN RÁPIDA (FAB) -->
  <aside class="floating-actions" aria-label="${esc(ui.quick_actions)}">
    <a href="${contactHref}" id="fab-contact" class="fab-btn fab-contact" aria-label="${esc(ui.fab_contact)}" title="${esc(ui.fab_contact)}">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
      </svg>
      <span class="fab-pulse" aria-hidden="true"></span>
    </a>

    <button type="button" id="fab-back-to-top" class="fab-btn fab-top" aria-label="${esc(ui.fab_top)}" title="${esc(ui.fab_top)}">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <polyline points="18 15 12 9 6 15"></polyline>
      </svg>
    </button>
  </aside>

  <!-- FOOTER MULTILINGÜE CON ENLACES INTERNOS SEO -->
  <footer>
    <div class="container">
      <div class="footer-grid">
        <div>
          <div class="footer-brand-row">
            ${BRAND_SVG}
            <span class="footer-tagline">AEGIFLOW · Automate Smarter. Secure by Design.</span>
          </div>
          <p class="footer-desc">${esc(ui.footer_desc)}</p>
        </div>

        <div class="footer-col">
          <div class="footer-title">${esc(ui.footer_col_services)}</div>
          <ul>
${serviceLinks}
          </ul>
        </div>

        <div class="footer-col">
          <div class="footer-title">${esc(ui.footer_col_company)}</div>
          <ul>
            <li><a href="${anchorPrefix}#cas-usage">${esc(ui.nav_usecases)}</a></li>
            <li><a href="${anchorPrefix}#comparatif">${esc(ui.nav_why)}</a></li>
            <li><a href="${anchorPrefix}#offres">${esc(ui.nav_offers)}</a></li>
            <li><a href="${anchorPrefix}#fondateur">${esc(ui.nav_founder)}</a></li>
            <li><a href="${anchorPrefix}#faq">${esc(ui.nav_faq)}</a></li>
          </ul>
        </div>

        <div class="footer-col">
          <div class="footer-title">${esc(ui.footer_col_contact)}</div>
          <ul>
            <li><a href="${contactHref}">${esc(ui.footer_contact_form)}</a></li>
            <li><a href="mailto:${SITE.email}">${SITE.email}</a></li>
            <li><a href="${SITE.linkedinCompany}" target="_blank" rel="noopener noreferrer">${esc(ui.footer_linkedin_company)}</a></li>
            <li><a href="${SITE.linkedinFounder}" target="_blank" rel="noopener noreferrer">${esc(ui.footer_linkedin_founder)}</a></li>
            <li><a href="${SITE.googleMaps}" target="_blank" rel="noopener noreferrer">Google Maps · AEGIFLOW</a></li>
${langLinks}
          </ul>
        </div>
      </div>

      <div class="footer-bottom">
        <p>${esc(ui.footer_copy)}</p>
        <div class="footer-legal-links">
          <button type="button" class="footer-legal-btn" data-modal-open="modal-legal">${esc(ui.footer_legal)}</button>
          <button type="button" class="footer-legal-btn" data-modal-open="modal-privacy">${esc(ui.footer_privacy)}</button>
        </div>
      </div>
    </div>
  </footer>

  <!-- MODAL POPUP 1: MENTIONS LÉGALES -->
  <div id="modal-legal" class="modal-backdrop" role="dialog" aria-modal="true" aria-hidden="true" aria-labelledby="legal-title">
    <div class="modal-box">
      <button type="button" class="modal-close" data-modal-close aria-label="${esc(ui.close)}">✕</button>
      <h3 id="legal-title">${esc(ui.leg_title)}</h3>
      <div class="modal-content">
        <h4>${esc(ui.leg_h1)}</h4>
        <p>${esc(ui.leg_p1)}</p>
        <h4>${esc(ui.leg_h2)}</h4>
        <p>${esc(ui.leg_p2)}</p>
        <h4>${esc(ui.leg_h3)}</h4>
        <p>${esc(ui.leg_p3)}</p>
      </div>
    </div>
  </div>

  <!-- MODAL POPUP 2: POLITIQUE DE CONFIDENTIALITÉ (RGPD) -->
  <div id="modal-privacy" class="modal-backdrop" role="dialog" aria-modal="true" aria-hidden="true" aria-labelledby="priv-title">
    <div class="modal-box">
      <button type="button" class="modal-close" data-modal-close aria-label="${esc(ui.close)}">✕</button>
      <h3 id="priv-title">${esc(ui.prv_title)}</h3>
      <div class="modal-content">
        <h4>${esc(ui.prv_h1)}</h4>
        <p>${esc(ui.prv_p1)}</p>
        <h4>${esc(ui.prv_h2)}</h4>
        <p>${esc(ui.prv_p2)}</p>
        <h4>${esc(ui.prv_h3)}</h4>
        <p>${esc(ui.prv_p3)}</p>
      </div>
    </div>
  </div>

  <script src="${root}/assets/js/aegiflow.js?v=${JS_HASH}" defer></script>
</body>

</html>`;
}

// -----------------------------------------------------------------------------
// Homepage Renderer
// -----------------------------------------------------------------------------
function renderHomePage(lang) {
  const c = CONTENT[lang];
  const ui = c.ui;
  const h = c.home;
  const pagePath = HOME_PATH[lang];
  const alternates = HOME_PATH;

  const schemaObj = buildSchemaGraph({
    lang,
    pagePath,
    alternates,
    metaTitle: h.meta_title,
    metaDesc: h.meta_desc,
    faqList: h.faq
  });

  const head = renderHead({
    lang,
    pagePath,
    alternates,
    metaTitle: h.meta_title,
    metaDesc: h.meta_desc,
    ogTitle: h.og_title,
    ogDesc: h.og_desc,
    schemaObj
  });

  const header = renderHeaderAndDrawer({ lang, alternates, isHome: true });

  const orbitalIcons = [SERVICE_ICON.ai, SERVICE_ICON.automation, SERVICE_ICON.security];
  const orbitalItems = h.orb
    .map(
      (item, i) => `          <div class="orbital-item">
            <div class="orbital-icon" aria-hidden="true">
              ${orbitalIcons[i]}
            </div>
            <div class="orbital-text">
              <strong class="orbital-title">${esc(item.t)}</strong>
              <p>${esc(item.d)}</p>
            </div>
          </div>`
    )
    .join('\n\n');

  const tickerRow = [...h.ticker, ...h.ticker]
    .map((t) => `<span class="ticker-item">${esc(t)}</span>`)
    .join('');

  const expertiseCards = SERVICES.map((key, idx) => {
    const card = h.cards[key];
    const href = SERVICE_PATH[key][lang];
    const bullets = card.b.map((b) => `              <li>${esc(b)}</li>`).join('\n');
    return `          <article class="card reveal" style="--d:${idx * 70}ms">
            <div>
              <span class="card-num">0${idx + 1}</span>
              <h3><a href="${href}">${esc(card.title)}</a></h3>
              <p>${esc(card.desc)}</p>
              <ul class="card-list">
${bullets}
              </ul>
            </div>
            <a href="${href}" class="card-link">${esc(ui.learn_more)}</a>
          </article>`;
  }).join('\n\n');

  const letters = ['A', 'B', 'C'];
  const usecaseCards = h.usecases
    .map((uc, idx) => {
      const bullets = uc.b.map((b) => `              <li>${esc(b)}</li>`).join('\n');
      return `          <article class="card reveal" style="--d:${idx * 70}ms">
            <div>
              <span class="card-num">${letters[idx]}</span>
              <h3>${esc(uc.t)}</h3>
              <p>${esc(uc.d)}</p>
            </div>
            <ul class="card-list">
${bullets}
            </ul>
          </article>`;
    })
    .join('\n\n');

  const riskItems = h.cmp_risks
    .map(
      (r) => `              <li>
                <span class="icon-x" aria-hidden="true">✕</span>
                <span>${esc(r)}</span>
              </li>`
    )
    .join('\n');

  const safeItems = h.cmp_safe
    .map(
      (s) => `              <li>
                <span class="icon-ok" aria-hidden="true">✓</span>
                <span>${esc(s)}</span>
              </li>`
    )
    .join('\n');

  const offerCards = h.offers
    .map((o, idx) => {
      const isFeatured = Boolean(o.badge);
      const cls = isFeatured ? 'card featured reveal' : 'card reveal';
      const badge = isFeatured ? `\n            <span class="badge-top">${esc(o.badge)}</span>` : '';
      const btnCls = isFeatured ? 'btn-cyan' : 'btn-outline';
      const bullets = o.b.map((b) => `                <li>${esc(b)}</li>`).join('\n');
      return `          <div class="${cls}" style="--d:${idx * 70}ms">${badge}
            <div>
              <span class="section-tag">${esc(o.step)}</span>
              <h3>${esc(o.title)}</h3>
              <p>${esc(o.desc)}</p>
              <ul class="card-list">
${bullets}
              </ul>
            </div>
            <a href="#contact" class="${btnCls}">${esc(o.cta)}</a>
          </div>`;
    })
    .join('\n\n');

  const kpiBoxes = h.kpis
    .map(
      (k) => `            <div class="kpi-box">
              <span class="kpi-val" data-count="${k.n}" data-decimals="${k.dec}" data-prefix="${esc(k.pre)}" data-suffix="${esc(k.suf)}">${esc(k.val)}</span>
              <span class="kpi-label">${esc(k.label)}</span>
            </div>`
    )
    .join('\n');

  const faqItems = h.faq
    .map(
      (item, idx) => `          <details class="faq-item"${idx === 0 ? ' open' : ''}>
            <summary>${esc(item.q)}</summary>
            <div class="faq-answer">${esc(item.a)}</div>
          </details>`
    )
    .join('\n');

  const ctaBullets = h.cta_b.map((b) => `            <li>${esc(b)}</li>`).join('\n');

  const footer = renderFooterAndModals({ lang, pagePath, isHome: true });

  return `${head}

<body id="top">
${header}

  <main id="main-content">
    <!-- HERO SECTION -->
    <section class="hero">
      <div class="container hero-grid">
        <div>
          <div class="glass-pill">
            <strong>AEGIFLOW</strong>
            <span>${esc(h.hero_pill)}</span>
          </div>

          <h1 class="hero-title">
            <span>${esc(h.hero_t1)}</span>
            <span class="cyan-highlight">${esc(h.hero_t_highlight)}</span>
            <br />
            <span>${esc(h.hero_t2)}</span>
          </h1>

          <p class="hero-subtitle">${esc(h.hero_sub)}</p>

          <div class="hero-cta-group">
            <a href="#contact" class="btn-cyan">${esc(h.hero_cta_1)}</a>
            <a href="#cas-usage" class="btn-outline">${esc(h.hero_cta_2)}</a>
          </div>

          <div class="hero-scope">
            <span class="scope-dot" aria-hidden="true"></span>
            <span>${esc(h.hero_scope)}</span>
          </div>
        </div>

        <aside class="orbital-panel" aria-label="${esc(h.orb_aria)}">
${orbitalItems}
        </aside>
      </div>
    </section>

    <!-- BANDA DE CAPACIDADES -->
    <div class="ticker" aria-label="${esc(h.ticker_aria)}">
      <div class="ticker-track">
        ${tickerRow}
      </div>
    </div>

    <!-- 1. SECCIÓN DE ESPECIALIDADES (4 PILARES CON PÁGINAS DEDICADAS) -->
    <section id="expertises" class="section">
      <div class="container">
        <div class="section-header reveal">
          <span class="section-tag">${esc(h.exp_tag)}</span>
          <h2 class="section-title">${esc(h.exp_title)}</h2>
        </div>

        <div class="cards-grid cols-4">
${expertiseCards}
        </div>
      </div>
    </section>

    <!-- 2. CASOS DE USO CONCRETOS -->
    <section id="cas-usage" class="section">
      <div class="container">
        <div class="section-header reveal">
          <span class="section-tag">${esc(h.uc_tag)}</span>
          <h2 class="section-title">${esc(h.uc_title)}</h2>
          <p class="section-desc">${esc(h.uc_sub)}</p>
        </div>

        <div class="cards-grid">
${usecaseCards}
        </div>
      </div>
    </section>

    <!-- 3. COMPARATIVA: BRICOLAGE IA VS STANDARD AEGIFLOW -->
    <section id="comparatif" class="section">
      <div class="container">
        <div class="section-header reveal">
          <span class="section-tag">${esc(h.cmp_tag)}</span>
          <h2 class="section-title">${esc(h.cmp_title)}</h2>
        </div>

        <div class="compare-grid">
          <div class="compare-col risk reveal">
            <div class="compare-header">
              <h3>${esc(h.cmp_left_title)}</h3>
              <span class="tag-risk">${esc(h.cmp_left_badge)}</span>
            </div>
            <ul class="compare-list">
${riskItems}
            </ul>
          </div>

          <div class="compare-col aegiflow reveal" style="--d:90ms">
            <div class="compare-header">
              <h3>${esc(h.cmp_right_title)}</h3>
              <span class="tag-safe">${esc(h.cmp_right_badge)}</span>
            </div>
            <ul class="compare-list">
${safeItems}
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- 4. SOLUCIONES / PAQUETES -->
    <section id="offres" class="section">
      <div class="container">
        <div class="section-header reveal">
          <span class="section-tag">${esc(h.off_tag)}</span>
          <h2 class="section-title">${esc(h.off_title)}</h2>
        </div>

        <div class="cards-grid">
${offerCards}
        </div>
      </div>
    </section>

    <!-- 5. SOBRE EL FUNDADOR + 6 MÉTRICAS OFICIALES -->
    <section id="fondateur" class="section">
      <div class="container founder-grid">
        <div class="founder-card reveal">
          <div class="founder-avatar" aria-hidden="true">OB</div>
          <div class="founder-name">Ousmane Barry</div>
          <p class="founder-role">${esc(h.f_role)}</p>
          <p class="founder-loc">${esc(h.f_loc)}</p>
          <div class="founder-links">
            <a href="${SITE.linkedinFounder}" target="_blank" rel="noopener noreferrer" class="btn-outline btn-sm">
              ${LINKEDIN_SVG}
              <span>${esc(h.f_linkedin)}</span>
            </a>
            <a href="${SITE.linkedinCompany}" target="_blank" rel="noopener noreferrer" class="btn-outline btn-sm">
              ${LINKEDIN_SVG}
              <span>${esc(h.f_linkedin_company)}</span>
            </a>
          </div>
        </div>

        <div class="reveal" style="--d:90ms">
          <span class="section-tag">${esc(h.f_tag)}</span>
          <h2 class="section-title">${esc(h.f_title)}</h2>
          <p class="prose-muted">${esc(h.f_bio)}</p>

          <div class="kpi-grid">
${kpiBoxes}
          </div>
        </div>
      </div>
    </section>

    <!-- 6. PREGUNTAS FRECUENTES (FAQ + SCHEMA FAQPAGE) -->
    <section id="faq" class="section">
      <div class="container">
        <div class="section-header reveal">
          <span class="section-tag">${esc(h.faq_tag)}</span>
          <h2 class="section-title">${esc(h.faq_title)}</h2>
        </div>

        <div class="faq-list reveal">
${faqItems}
        </div>
      </div>
    </section>

    <!-- 7. CONTACTO: LINKEDIN DIRECTO + FORMULARIO SEGURO PROTEGIDO EN /api/contact -->
    <section id="contact" class="section">
      <div class="container contact-grid">
        <div class="reveal">
          <span class="section-tag">${esc(h.cta_tag)}</span>
          <h2 class="section-title">${esc(h.cta_title)}</h2>
          <p class="prose-muted">${esc(h.cta_sub)}</p>

          <div class="mt-cta">
            <a href="${SITE.linkedinFounder}" target="_blank" rel="noopener noreferrer" class="btn-cyan">
              ${esc(h.cta_btn_li)}
            </a>
          </div>

          <p class="contact-mail">${esc(h.cta_mail_label)} <a href="mailto:${SITE.email}">${SITE.email}</a></p>

          <ul class="card-list mt-lg">
${ctaBullets}
          </ul>
        </div>

        <div class="form-card reveal" style="--d:90ms">
          <form id="aegiflow-contact-form" aria-label="${esc(h.form.aria)}" data-msg-sending="${esc(h.form.sending)}" data-msg-ok="${esc(h.form.ok)}" data-msg-err="${esc(h.form.err)}">
            <div class="hp-field" aria-hidden="true">
              <label for="f-hp">Website</label>
              <input type="text" id="f-hp" name="website_hp" tabindex="-1" autocomplete="off" />
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="f-name" class="form-label">${esc(h.form.name_l)}</label>
                <input type="text" id="f-name" name="NAME" required maxlength="150" autocomplete="name" class="form-input" placeholder="${esc(h.form.name_p)}" />
              </div>
              <div class="form-group">
                <label for="f-email" class="form-label">${esc(h.form.email_l)}</label>
                <input type="email" id="f-email" name="EMAIL" required maxlength="150" autocomplete="email" class="form-input" placeholder="${esc(h.form.email_p)}" />
              </div>
            </div>

            <div class="form-group">
              <label for="f-company" class="form-label">${esc(h.form.comp_l)}</label>
              <input type="text" id="f-company" name="COMPANY" maxlength="150" autocomplete="organization" class="form-input" placeholder="${esc(h.form.comp_p)}" />
            </div>

            <div class="form-group">
              <label for="f-msg" class="form-label">${esc(h.form.msg_l)}</label>
              <textarea id="f-msg" name="MESSAGE" required maxlength="5000" class="form-textarea" placeholder="${esc(h.form.msg_p)}"></textarea>
            </div>

            <label class="form-consent">
              <input type="checkbox" required />
              <span>${esc(h.form.rgpd)}</span>
            </label>

            <button type="submit" id="form-submit-btn" class="btn-cyan" style="width: 100%;">
              ${esc(h.form.submit)}
            </button>

            <div id="form-status" class="form-status" role="status" aria-live="polite"></div>
          </form>
        </div>
      </div>
    </section>
  </main>

${footer}
`;
}

// -----------------------------------------------------------------------------
// Service Page Renderer
// -----------------------------------------------------------------------------
function renderServicePage(lang, serviceKey) {
  const c = CONTENT[lang];
  const ui = c.ui;
  const h = c.home;
  const svc = c.services[serviceKey];
  const pagePath = SERVICE_PATH[serviceKey][lang];
  const alternates = SERVICE_PATH[serviceKey];
  const homeHref = HOME_PATH[lang];
  const contactHref = `${homeHref}#contact`;

  const schemaObj = buildSchemaGraph({
    lang,
    pagePath,
    alternates,
    metaTitle: svc.meta_title,
    metaDesc: svc.meta_desc,
    faqList: svc.faq,
    serviceKey
  });

  const head = renderHead({
    lang,
    pagePath,
    alternates,
    metaTitle: svc.meta_title,
    metaDesc: svc.meta_desc,
    ogTitle: svc.meta_title,
    ogDesc: svc.meta_desc,
    schemaObj
  });

  const header = renderHeaderAndDrawer({
    lang,
    alternates,
    isHome: false,
    activeServiceKey: serviceKey
  });

  const highlightItems = svc.highlights
    .map(
      (item, idx) => `          <div class="orbital-item">
            <div class="orbital-icon" aria-hidden="true">
              <span class="orbital-num">0${idx + 1}</span>
            </div>
            <div class="orbital-text">
              <strong class="orbital-title">${esc(item.t)}</strong>
              <p>${esc(item.d)}</p>
            </div>
          </div>`
    )
    .join('\n\n');

  const techList = TECH[serviceKey];
  const tickerRow = [...techList, ...techList]
    .map((t) => `<span class="ticker-item">${esc(t)}</span>`)
    .join('');

  const deliverCards = svc.deliver
    .map(
      (d, idx) => `          <article class="card reveal" style="--d:${(idx % 3) * 70}ms">
            <div>
              <span class="card-num">0${idx + 1}</span>
              <h3>${esc(d.t)}</h3>
              <p>${esc(d.d)}</p>
            </div>
          </article>`
    )
    .join('\n\n');

  const letters = ['A', 'B', 'C'];
  const usecaseCards = svc.usecases
    .map(
      (u, idx) => `          <article class="card reveal" style="--d:${idx * 70}ms">
            <div>
              <span class="card-num">${letters[idx]}</span>
              <h3>${esc(u.t)}</h3>
              <p>${esc(u.d)}</p>
            </div>
          </article>`
    )
    .join('\n\n');

  const stepItems = svc.steps
    .map(
      (s, idx) => `          <li class="step reveal" style="--d:${idx * 70}ms">
            <h3>${esc(s.t)}</h3>
            <p>${esc(s.d)}</p>
          </li>`
    )
    .join('\n');

  const secItems = svc.security
    .map(
      (s) => `              <li>
                <span class="icon-ok" aria-hidden="true">✓</span>
                <span>${esc(s)}</span>
              </li>`
    )
    .join('\n');

  const techChips = techList.map((t) => `          <span class="chip">${esc(t)}</span>`).join('\n');

  const faqItems = svc.faq
    .map(
      (item, idx) => `          <details class="faq-item"${idx === 0 ? ' open' : ''}>
            <summary>${esc(item.q)}</summary>
            <div class="faq-answer">${esc(item.a)}</div>
          </details>`
    )
    .join('\n');

  const relatedCards = SERVICES.filter((k) => k !== serviceKey)
    .map((k) => {
      const other = c.services[k];
      return `          <a href="${SERVICE_PATH[k][lang]}" class="related-card">
            <div>
              <span>${esc(other.nav)}</span>
              <small>${esc(other.nav_sub)}</small>
            </div>
            <span class="arrow" aria-hidden="true">→</span>
          </a>`;
    })
    .join('\n');

  const footer = renderFooterAndModals({ lang, pagePath, isHome: false });

  return `${head}

<body id="top">
${header}

  <main id="main-content">
    <!-- SERVICE HERO -->
    <section class="hero">
      <div class="container hero-grid">
        <div>
          <nav class="breadcrumb" aria-label="${esc(ui.breadcrumb_aria)}">
            <ol>
              <li><a href="${homeHref}">${esc(ui.breadcrumb_home)}</a></li>
              <li><span aria-current="page">${esc(svc.nav)}</span></li>
            </ol>
          </nav>

          <div class="glass-pill">
            <strong>AEGIFLOW</strong>
            <span>· ${esc(svc.tag)}</span>
          </div>

          <h1 class="hero-title is-service">${esc(svc.h1)}</h1>

          <p class="hero-subtitle">${esc(svc.lead)}</p>

          <div class="hero-cta-group">
            <a href="${contactHref}" class="btn-cyan">${esc(ui.svc_cta_btn)}</a>
            <a href="#livrables" class="btn-outline">${esc(svc.deliver_title)}</a>
          </div>

          <div class="hero-scope">
            <span class="scope-dot" aria-hidden="true"></span>
            <span>${esc(h.hero_scope)}</span>
          </div>
        </div>

        <aside class="orbital-panel" aria-label="${esc(ui.svc_highlights_aria)}">
${highlightItems}
        </aside>
      </div>
    </section>

    <!-- TECH TICKER -->
    <div class="ticker" aria-label="${esc(ui.svc_tech_tag)}">
      <div class="ticker-track">
        ${tickerRow}
      </div>
    </div>

    <!-- 1. DELIVERABLES -->
    <section id="livrables" class="section">
      <div class="container">
        <div class="section-header reveal">
          <span class="section-tag">${esc(ui.svc_deliver_tag)}</span>
          <h2 class="section-title">${esc(svc.deliver_title)}</h2>
        </div>

        <div class="cards-grid">
${deliverCards}
        </div>
      </div>
    </section>

    <!-- 2. CONCRETE USE CASES -->
    <section class="section">
      <div class="container">
        <div class="section-header reveal">
          <span class="section-tag">${esc(ui.svc_uc_tag)}</span>
          <h2 class="section-title">${esc(svc.uc_title)}</h2>
        </div>

        <div class="cards-grid">
${usecaseCards}
        </div>
      </div>
    </section>

    <!-- 3. 4-STEP METHODOLOGY -->
    <section class="section">
      <div class="container">
        <div class="section-header reveal">
          <span class="section-tag">${esc(ui.svc_method_tag)}</span>
          <h2 class="section-title">${esc(ui.svc_method_title)}</h2>
        </div>

        <ol class="steps">
${stepItems}
        </ol>
      </div>
    </section>

    <!-- 4. SECURITY BY DESIGN + TECH STACK -->
    <section class="section">
      <div class="container">
        <div class="secure-panel">
          <div class="reveal">
            <span class="section-tag">${esc(ui.svc_sec_tag)}</span>
            <h2 class="section-title">${esc(svc.security_title)}</h2>
            <p class="section-desc">${esc(svc.security_text)}</p>
          </div>

          <div class="compare-col aegiflow reveal" style="--d:80ms">
            <div class="compare-header">
              <h3>${esc(h.cmp_right_title)}</h3>
              <span class="tag-safe">Security by Design</span>
            </div>
            <ul class="compare-list">
${secItems}
            </ul>
          </div>
        </div>

        <div class="section-header reveal" style="margin-top: 3.5rem; margin-bottom: 1.5rem;">
          <span class="section-tag">${esc(ui.svc_tech_tag)}</span>
          <h2 class="section-title" style="font-size: clamp(1.3rem, 3vw, 1.75rem);">${esc(ui.svc_tech_title)}</h2>
        </div>

        <div class="chips reveal">
${techChips}
        </div>
      </div>
    </section>

    <!-- 5. SERVICE FAQ -->
    <section class="section">
      <div class="container">
        <div class="section-header reveal">
          <span class="section-tag">${esc(ui.svc_faq_tag)}</span>
          <h2 class="section-title">${esc(ui.svc_faq_title)}</h2>
        </div>

        <div class="faq-list reveal">
${faqItems}
        </div>
      </div>
    </section>

    <!-- 6. CTA BAND + RELATED SERVICES -->
    <section class="section" style="border-bottom: none;">
      <div class="container">
        <div class="cta-band reveal">
          <div>
            <h2>${esc(svc.cta_title)}</h2>
            <p>${esc(svc.cta_text)}</p>
          </div>
          <div class="cta-actions">
            <a href="${contactHref}" class="btn-cyan">${esc(ui.svc_cta_btn)}</a>
            <a href="${SITE.linkedinFounder}" target="_blank" rel="noopener noreferrer" class="btn-outline">${esc(ui.svc_cta_li)}</a>
          </div>
        </div>

        <div class="section-header reveal" style="margin-top: 3.75rem; margin-bottom: 1.5rem;">
          <span class="section-tag">${esc(ui.related_tag)}</span>
          <h2 class="section-title" style="font-size: clamp(1.35rem, 3.2vw, 1.85rem);">${esc(ui.related_title)}</h2>
        </div>

        <div class="related-grid reveal">
${relatedCards}
        </div>
      </div>
    </section>
  </main>

${footer}
`;
}

// -----------------------------------------------------------------------------
// 404 Page, Sitemap, Robots, LLMs.txt, Webmanifest
// -----------------------------------------------------------------------------
function render404Page() {
  return `<!DOCTYPE html>
<html lang="fr" class="dark" data-root=".">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
  <meta name="darkreader-lock" />
  <meta name="color-scheme" content="dark only" />
  <meta name="theme-color" content="#01030A" />
  <meta name="robots" content="noindex, follow" />
  <title>404 — Page introuvable | Page not found | Página no encontrada — AEGIFLOW</title>
  <link rel="icon" type="image/svg+xml" href="./favicon.svg" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Space+Grotesk:wght@700;800&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="./assets/css/aegiflow.css?v=${CSS_HASH}" />
</head>

<body>
  <main class="error-page">
    <div class="error-box">
      ${BRAND_SVG}
      <div class="error-code">404</div>
      <h1>Page introuvable · Page not found · Página no encontrada</h1>
      <p>La ressource demandée n'existe pas ou a été déplacée vers une nouvelle architecture sécurisée.</p>
      <div class="error-links">
        <a href="/" class="btn-cyan">Accueil (FR)</a>
        <a href="/en" class="btn-outline">Home (EN)</a>
        <a href="/es" class="btn-outline">Inicio (ES)</a>
      </div>
    </div>
  </main>
  <script src="./assets/js/aegiflow.js?v=${JS_HASH}" defer></script>
</body>

</html>
`;
}

function renderSitemap() {
  const clusters = [
    { paths: HOME_PATH, priority: '1.0', changefreq: 'weekly' },
    ...SERVICES.map((k) => ({ paths: SERVICE_PATH[k], priority: '0.9', changefreq: 'weekly' }))
  ];

  const entries = [];
  for (const cluster of clusters) {
    for (const lang of LANGS) {
      const loc = `${SITE.origin}${cluster.paths[lang]}`;
      const xhtmlLinks = [
        ...LANGS.map(
          (l) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${SITE.origin}${cluster.paths[l]}" />`
        ),
        `    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE.origin}${cluster.paths[DEFAULT_LANG]}" />`
      ].join('\n');

      entries.push(`  <url>
    <loc>${loc}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>${cluster.changefreq}</changefreq>
    <priority>${cluster.priority}</priority>
${xhtmlLinks}
  </url>`);
    }
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries.join('\n')}
</urlset>
`;
}

function renderRobots() {
  const agents = [
    '*',
    'GPTBot',
    'ChatGPT-User',
    'OAI-SearchBot',
    'ClaudeBot',
    'Claude-Web',
    'anthropic-ai',
    'Googlebot',
    'Googlebot-Mobile',
    'Googlebot-Image',
    'Google-Extended',
    'PerplexityBot',
    'Bingbot',
    'BingPreview',
    'Applebot',
    'Applebot-Extended',
    'cohere-ai',
    'Bytespider',
    'meta-externalagent',
    'FacebookBot',
    'Twitterbot',
    'LinkedInBot',
    'DuckDuckBot'
  ];

  const blocks = agents
    .map((ua) => `User-agent: ${ua}\nAllow: /\nDisallow: /api/\n`)
    .join('\n');

  return `# ==============================================================================
# AEGIFLOW — Robots.txt
# Domain: ${SITE.origin}
# LLMs Context: ${SITE.origin}/llms.txt
# Sitemap: ${SITE.origin}/sitemap.xml
# ==============================================================================

${blocks}Sitemap: ${SITE.origin}/sitemap.xml
`;
}

function renderLlmsTxt() {
  return `# AEGIFLOW — Custom AI Agents, Process Automation, Software Development & Security by Design

> AEGIFLOW (https://www.aegiflow.eu) is an engineering firm specialized in Custom Artificial Intelligence Integration (AI Agents, Multi-Agent Systems & Private LLMs/RAG), Complex Workflow Automation (APIs, n8n, Make, CRM/ERP), Full-Stack Software Development (Web, Mobile iOS/Android & PC/Desktop), and Offensive/Defensive Cybersecurity (Security by Design, Penetration Testing & Hardening). Founded by Ousmane Barry, AEGIFLOW serves SMEs, agencies, and enterprises across France, Spain, the European Union, and internationally.

## Official Brand & Entity Disambiguation

- **Official Brand Name:** AEGIFLOW (distinct entity — not affiliated with "Aeroflow" or medical/automotive products)
- **Tagline / Slogan:** Automate Smarter. Secure by Design.
- **Canonical Website:** https://www.aegiflow.eu/
- **Founder:** Ousmane Barry — AI, Automation & Cybersecurity Engineer
- **Official Company LinkedIn:** https://www.linkedin.com/company/aegiflow
- **Founder LinkedIn:** https://www.linkedin.com/in/ousmane-barry
- **Official Google Business Profile (Maps):** https://maps.app.goo.gl/qG3TxPJqUghXvXKC9
- **Direct Email:** contact@aegiflow.eu
- **Service Areas:** France, Spain, European Union & Worldwide
- **Working Languages:** French (FR), English (EN), Spanish (ES)

## Key Performance Indicators (Track Record)

- **Experience:** 8+ years of combined expertise (AI Engineering, Software & Cybersecurity)
- **Delivered Projects:** 40+ deployed systems
- **Client Satisfaction:** 98.7%
- **On-Time Delivery:** 99.4%
- **Operational Standard:** 100% Quality · 100% GDPR / RGPD Compliance

## Core Services & Canonical URLs

### 1. Custom AI Agents & Private LLMs (RAG)
- FR: https://www.aegiflow.eu/services/agents-ia
- EN: https://www.aegiflow.eu/en/services/ai-agents
- ES: https://www.aegiflow.eu/es/servicios/agentes-ia
- Scope: Autonomous multi-agent systems, private LLM API integration, internal RAG assistants, automated document triage & extraction, zero data leakage.

### 2. Business Process Automation & API Integration
- FR: https://www.aegiflow.eu/services/automatisation
- EN: https://www.aegiflow.eu/en/services/automation
- ES: https://www.aegiflow.eu/es/servicios/automatizacion
- Scope: End-to-end workflows (n8n, Make, custom Node.js/Python), REST/GraphQL API connectors, CRM/ERP/database synchronization, error handling & monitoring.

### 3. Custom Software Development: Web, Mobile & Desktop (PC)
- FR: https://www.aegiflow.eu/services/developpement-logiciel
- EN: https://www.aegiflow.eu/en/services/software-development
- ES: https://www.aegiflow.eu/es/servicios/desarrollo-software
- Scope: Web apps & SaaS, client portals, iOS & Android mobile apps, Windows/macOS/Linux desktop software, native AI & API integration.

### 4. Cybersecurity, Penetration Testing & Security by Design
- FR: https://www.aegiflow.eu/services/cybersecurite
- EN: https://www.aegiflow.eu/en/services/cybersecurity
- ES: https://www.aegiflow.eu/es/servicios/ciberseguridad
- Scope: Web/API/Active Directory penetration testing, Linux/Windows/Cloud system hardening, API key & secrets protection, RBAC, AI prompt-injection defense.

## Homepages by Language

- French (Default): https://www.aegiflow.eu/
- English: https://www.aegiflow.eu/en
- Spanish: https://www.aegiflow.eu/es
`;
}

function renderManifest() {
  return JSON.stringify(
    {
      name: 'AEGIFLOW — IA sur mesure, Automatisation & Security by Design',
      short_name: 'AEGIFLOW',
      description:
        'AEGIFLOW : Agents IA & LLM sur mesure, Automatisation & APIs, Développement Web, Mobile & PC et Cybersécurité (Security by Design).',
      start_url: '/',
      display: 'standalone',
      background_color: '#01030A',
      theme_color: '#01030A',
      icons: [
        {
          src: '/assets/img/aegiflow-logo-192.png',
          sizes: '192x192',
          type: 'image/png',
          purpose: 'any maskable'
        },
        {
          src: '/assets/img/aegiflow-logo-512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any maskable'
        },
        {
          src: '/favicon.svg',
          sizes: 'any',
          type: 'image/svg+xml'
        }
      ]
    },
    null,
    2
  );
}

// -----------------------------------------------------------------------------
// Build Execution
// -----------------------------------------------------------------------------
const generated = [];

for (const lang of LANGS) {
  const relFile = urlToFile(HOME_PATH[lang]);
  writeOut(relFile, renderHomePage(lang));
  generated.push(relFile);

  for (const serviceKey of SERVICES) {
    const svcFile = urlToFile(SERVICE_PATH[serviceKey][lang]);
    writeOut(svcFile, renderServicePage(lang, serviceKey));
    generated.push(svcFile);
  }
}

writeOut('404.html', render404Page());
writeOut('sitemap.xml', renderSitemap());
writeOut('robots.txt', renderRobots());
writeOut('llms.txt', renderLlmsTxt());
writeOut('site.webmanifest', renderManifest());

console.log(`Built ${generated.length} HTML pages + 404.html, sitemap.xml, robots.txt, llms.txt, site.webmanifest`);
generated.forEach((f) => console.log(`  - ${f}`));

