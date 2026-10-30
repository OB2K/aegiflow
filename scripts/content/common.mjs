// ==============================================================================
// AEGIFLOW — Shared site configuration (routes, entity data, tech stacks)
// Edit this file to add social profiles (sameAs), change URLs or tech lists,
// then run:  node scripts/build.mjs
// ==============================================================================

export const SITE = {
  origin: 'https://www.aegiflow.eu',
  name: 'AEGIFLOW',
  alternateNames: ['Aegiflow', 'AEGIFLOW.eu', 'aegiflow.eu'],
  slogan: 'Automate Smarter. Secure by Design.',
  email: 'contact@aegiflow.eu',
  founder: 'Ousmane Barry',
  linkedinCompany: 'https://www.linkedin.com/company/aegiflow',
  linkedinFounder: 'https://www.linkedin.com/in/ousmane-barry',
  googleMaps: 'https://maps.app.goo.gl/qG3TxPJqUghXvXKC9',
  logo: '/assets/img/aegiflow-logo-512.png',
  ogImage: '/assets/img/aegiflow-og-1200x630.jpg',
  ogImageWidth: 1200,
  ogImageHeight: 630,

  // Every official profile of the company. Add new ones here (Google Business
  // Profile share link, X, GitHub, YouTube, Crunchbase, Clutch, Malt...).
  // This list feeds Organization.sameAs, the strongest entity signal for Google.
  organizationSameAs: [
    'https://www.linkedin.com/company/aegiflow',
    'https://maps.app.goo.gl/qG3TxPJqUghXvXKC9'
  ],

  founderSameAs: [
    'https://www.linkedin.com/in/ousmane-barry'
  ]
};

export const LANGS = ['fr', 'en', 'es'];
export const DEFAULT_LANG = 'fr';

export const OG_LOCALE = { fr: 'fr_FR', en: 'en_US', es: 'es_ES' };
export const LANG_LABEL = { fr: 'Français', en: 'English', es: 'Español' };

// URL paths (Vercel cleanUrls: "/en" is served from "en.html")
export const HOME_PATH = { fr: '/', en: '/en', es: '/es' };

export const SERVICES = ['ai', 'automation', 'software', 'security'];

export const SERVICE_PATH = {
  ai: {
    fr: '/services/agents-ia',
    en: '/en/services/ai-agents',
    es: '/es/servicios/agentes-ia'
  },
  automation: {
    fr: '/services/automatisation',
    en: '/en/services/automation',
    es: '/es/servicios/automatizacion'
  },
  software: {
    fr: '/services/developpement-logiciel',
    en: '/en/services/software-development',
    es: '/es/servicios/desarrollo-software'
  },
  security: {
    fr: '/services/cybersecurite',
    en: '/en/services/cybersecurity',
    es: '/es/servicios/ciberseguridad'
  }
};

// Technologies shown as chips on each service page (language-neutral).
export const TECH = {
  ai: [
    'Python', 'LangChain', 'LangGraph', 'OpenAI API', 'Azure OpenAI', 'Mistral AI',
    'Anthropic Claude', 'Ollama', 'RAG', 'pgvector', 'Qdrant', 'FastAPI'
  ],
  automation: [
    'n8n', 'Make', 'Zapier', 'REST', 'GraphQL', 'Webhooks', 'Node.js', 'Python',
    'PostgreSQL', 'HubSpot', 'Salesforce', 'Odoo', 'Google Workspace', 'Microsoft 365'
  ],
  software: [
    'TypeScript', 'React', 'Next.js', 'Vue.js', 'Node.js', 'React Native', 'Flutter',
    'Electron', 'Tauri', 'PostgreSQL', 'Supabase', 'Docker', 'Vercel'
  ],
  security: [
    'OWASP Top 10', 'OWASP API Security', 'Burp Suite', 'Nmap', 'Active Directory',
    'BloodHound', 'CIS Benchmarks', 'Linux Hardening', 'Windows Hardening',
    'Secrets Management', 'RBAC', 'RGPD / GDPR'
  ]
};

// Inline SVG icons per service (decorative)
export const SERVICE_ICON = {
  ai: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="7" y="7" width="10" height="10" rx="2"/><path d="M12 2v5M12 17v5M2 12h5M17 12h5M4.93 4.93l3.54 3.54M15.54 15.54l3.53 3.53M19.07 4.93l-3.53 3.54M8.46 15.54l-3.53 3.53"/></svg>',
  automation: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="6" cy="6" r="3"/><circle cx="18" cy="6" r="3"/><circle cx="18" cy="18" r="3"/><path d="M9 6h6M6 9v3a6 6 0 0 0 6 6h3"/></svg>',
  software: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="4" width="14" height="11" rx="2"/><path d="M6 19h6M9 15v4"/><rect x="17" y="8" width="5" height="12" rx="1.2"/><path d="m7 8-2 2 2 2M11 8l2 2-2 2"/></svg>',
  security: '<svg width="24" height="24" viewBox="0 0 100 100" fill="none" aria-hidden="true"><path d="M50 10 L84 26 V54 C84 74 50 90 50 90 C50 90 16 74 16 54 V26 L50 10 Z" stroke="currentColor" stroke-width="7"/><path d="M34 74 L50 28 L66 74" stroke="#FFFFFF" stroke-width="7" stroke-linecap="round"/></svg>'
};
