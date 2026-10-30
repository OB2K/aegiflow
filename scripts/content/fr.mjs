// ==============================================================================
// AEGIFLOW — Contenu FRANÇAIS (langue par défaut, servie sur "/")
// Toute modification ici doit être répercutée dans en.mjs et es.mjs.
// Puis : node scripts/build.mjs
// ==============================================================================

export default {
  lang: 'fr',

  // ---------------------------------------------------------------------------
  // Interface commune (header, menu, footer, modales, pages services)
  // ---------------------------------------------------------------------------
  ui: {
    skip: 'Aller au contenu principal',
    brand_sub: 'IA + Automatisation + Sécurité',
    home_aria: 'AEGIFLOW — Accueil',
    nav_aria: 'Navigation principale',
    nav_exp: 'Expertises',
    nav_usecases: "Cas d'usage",
    nav_why: 'Pourquoi nous',
    nav_offers: 'Solutions',
    nav_founder: 'À propos',
    nav_faq: 'FAQ',
    nav_cta: 'Discutons de votre projet',
    lang_group: 'Choisir la langue',
    menu_open: 'Ouvrir le menu',
    menu_aria: 'Menu mobile',
    mob_nav_header: 'AEGIFLOW · MENU',
    mob_sub_exp: 'IA, automatisation, logiciel & sécurité',
    mob_sub_uc: 'Ce que nous déployons',
    mob_sub_why: 'Standard Security by Design',
    mob_sub_off: "Formats d'intervention",
    mob_sub_fnd: 'Ousmane Barry & Track Record',
    mob_lang_label: 'Langue du site / Language :',
    quick_actions: 'Actions rapides',
    fab_contact: 'Discuter de votre projet',
    fab_top: 'Retour en haut de page',
    learn_more: 'En savoir plus',
    services_label: 'Services AEGIFLOW',
    breadcrumb_aria: "Fil d'Ariane",
    breadcrumb_home: 'Accueil',
    related_tag: 'Expertises complémentaires',
    related_title: 'Nos autres expertises',
    svc_highlights_aria: 'Points clés',
    svc_deliver_tag: 'Livrables',
    svc_uc_tag: "Cas d'usage",
    svc_method_tag: 'Méthode',
    svc_method_title: 'Une méthode claire en 4 étapes, sans effet tunnel.',
    svc_sec_tag: 'Security by Design',
    svc_tech_tag: 'Écosystème technique',
    svc_tech_title: 'Technologies et standards que nous maîtrisons',
    svc_faq_tag: 'FAQ',
    svc_faq_title: 'Questions fréquentes',
    svc_cta_btn: 'Discutons de votre projet',
    svc_cta_li: 'Écrire sur LinkedIn',
    footer_desc: "Ingénierie IA sur mesure, automatisation de processus, développement logiciel Web, Mobile & PC et cybersécurité. France, Espagne & International.",
    footer_col_services: 'Services',
    footer_col_company: 'AEGIFLOW',
    footer_col_contact: 'Contact',
    footer_contact_form: 'Formulaire sécurisé',
    footer_linkedin_company: 'LinkedIn AEGIFLOW',
    footer_linkedin_founder: 'LinkedIn Ousmane Barry',
    footer_copy: '© 2026 AEGIFLOW — Tous droits réservés.',
    footer_legal: 'Mentions légales',
    footer_privacy: 'Politique de confidentialité',
    close: 'Fermer',
    leg_title: 'Mentions Légales',
    leg_h1: '1. Éditeur du site',
    leg_p1: "Le site www.aegiflow.eu est édité par AEGIFLOW (représenté par son fondateur Ousmane Barry, entrepreneur individuel). Contact direct : contact@aegiflow.eu, via le formulaire du site ou via LinkedIn : linkedin.com/in/ousmane-barry.",
    leg_h2: '2. Hébergement',
    leg_p2: 'Hébergement web : Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, USA.',
    leg_h3: '3. Propriété intellectuelle',
    leg_p3: "L'ensemble des éléments graphiques, textes, codes, logos et architectures présents sur le site www.aegiflow.eu sont la propriété exclusive d'AEGIFLOW. Toute reproduction sans autorisation préalable est interdite.",
    prv_title: 'Politique de Confidentialité (RGPD)',
    prv_h1: '1. Collecte minimale des données',
    prv_p1: "AEGIFLOW collecte uniquement les informations strictement nécessaires transmises volontairement via le formulaire de contact (nom, email professionnel, entreprise, description du besoin). Aucun cookie publicitaire ni traceur n'est utilisé sur ce site. Seule votre préférence de langue peut être mémorisée localement dans votre navigateur.",
    prv_h2: '2. Finalité et traitement sécurisé',
    prv_p2: "Les données transmises via le formulaire sont traitées de manière chiffrée et confidentielle uniquement pour répondre à votre demande, via notre prestataire d'emailing transactionnel (Brevo). Vos données ne sont jamais vendues, louées ni cédées à des tiers.",
    prv_h3: '3. Vos droits (Accès, rectification, suppression)',
    prv_p3: "Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez d'un droit d'accès, de modification et de suppression de vos données sur simple demande à contact@aegiflow.eu, via notre formulaire ou par message direct sur LinkedIn.",
    e404_title: 'Page introuvable',
    e404_text: "La ressource demandée n'existe pas ou a été déplacée vers une nouvelle architecture sécurisée.",
    e404_btn: "Retour à l'accueil"
  },

  // ---------------------------------------------------------------------------
  // Page d'accueil
  // ---------------------------------------------------------------------------
  home: {
    meta_title: 'AEGIFLOW | Agence IA sur mesure, Automatisation & Cybersécurité',
    meta_desc: "AEGIFLOW conçoit des agents IA et LLM privés, automatise vos processus (API, CRM, ERP), développe vos logiciels Web, Mobile & PC et sécurise tout dès la conception.",
    og_title: "AEGIFLOW — Automatisez avec l'IA sur mesure tout en sécurisant vos données",
    og_desc: 'Agents IA & LLM sur mesure, automatisation & API, développement Web, Mobile & PC et Security by Design. France, Espagne & International.',
    org_desc: "AEGIFLOW est une société d'ingénierie spécialisée en agents IA et LLM sur mesure, automatisation de processus par API, développement logiciel Web, Mobile et PC, et cybersécurité selon le principe Security by Design.",
    founder_job: 'Fondateur — Ingénieur IA, Automatisation & Cybersécurité',
    knows_about: [
      'Agents IA', 'Systèmes multi-agents', 'Grands modèles de langage (LLM)', 'RAG',
      'Automatisation de processus', 'Intégration API', 'Développement web', 'Applications mobiles',
      'Logiciels desktop', 'Cybersécurité', "Tests d'intrusion", 'Durcissement système', 'Security by Design', 'RGPD'
    ],

    hero_pill: '· IA + Automatisation + Sécurité',
    hero_t1: 'AUTOMATISEZ AVEC',
    hero_t_highlight: "L'IA SUR MESURE",
    hero_t2: 'TOUT EN SÉCURISANT VOS DONNÉES',
    hero_sub: "AEGIFLOW conçoit et déploie des agents IA sur mesure, des automatisations complexes et des logiciels Web, Mobile & PC blindés dès la conception (Security by Design) pour accélérer votre activité.",
    hero_cta_1: 'Discutons de votre projet',
    hero_cta_2: "Voir les cas d'usage",
    hero_scope: 'France · Espagne · International',
    orb_aria: 'Piliers AEGIFLOW',
    orb: [
      { t: 'Agents IA & LLM sur mesure', d: 'Systèmes multi-agents et modèles adaptés à vos opérations.' },
      { t: 'Automatisation & APIs', d: 'Interconnexion fluide de vos outils, CRM et logiciels métiers.' },
      { t: 'Security by Design', d: 'Protection des clés API, contrôle des accès et cloisonnement.' }
    ],

    ticker_aria: 'Compétences clés',
    ticker: [
      'Systèmes multi-agents', 'LLM privés & RAG', 'Automatisation n8n & Make', 'API REST & GraphQL',
      'CRM · ERP · SQL', 'Web · Mobile · Desktop', 'RBAC & cloisonnement', 'Pentest & Hardening', 'Conformité RGPD'
    ],

    exp_tag: 'Nos Expertises',
    exp_title: 'Une ingénierie complète : Agents IA, Automatisation, Logiciel & Security by Design.',
    cards: {
      ai: {
        title: 'Agents IA & LLM sur mesure',
        desc: 'Conception de systèmes multi-agents et intégration de modèles LLM privés pour automatiser le traitement documentaire, la qualification client et vos opérations internes.',
        b: ['Systèmes multi-agents autonomes', 'Intégration LLM sécurisée par API', 'Zéro fuite vers des modèles publics']
      },
      automation: {
        title: 'Automatisation & Interconnexion APIs',
        desc: 'Développement de workflows complexes et interconnexions API sur mesure pour faire communiquer vos outils métiers, éliminer les tâches manuelles et fiabiliser vos opérations.',
        b: ['Workflows complexes & interconnexion API', 'Orchestration de processus de bout en bout', 'Synchronisation CRM, ERP & bases de données']
      },
      software: {
        title: 'Développement Web, Mobile & PC',
        desc: "Applications web, apps mobiles iOS & Android et logiciels desktop sur mesure : interfaces modernes, back-ends robustes et intégration native de l'IA et de vos API.",
        b: ['Applications web, SaaS & portails clients', 'Apps mobiles iOS & Android', 'Logiciels desktop Windows, macOS & Linux']
      },
      security: {
        title: 'Security by Design & Cybersécurité',
        desc: 'Chaque architecture est protégée dès sa conception : protection stricte des clés API, gestion granulaire des rôles, durcissement système (Hardening) et défense active.',
        b: ['Protection des clés API & secrets', 'Hardening systèmes & infrastructures', 'Audit offensif & élimination des failles']
      }
    },

    uc_tag: "Cas d'Usage Concrets",
    uc_title: 'Ce que nous déployons concrètement dans votre entreprise.',
    uc_sub: 'Des architectures opérationnelles conçues pour éliminer vos tâches chronophages sans jamais exposer vos données.',
    usecases: [
      {
        t: 'Tri & Traitement Documentaire IA',
        d: 'Analyse automatique de vos contrats, factures, emails et pièces jointes par un agent IA privé, extraction structurée des données et injection directe dans votre CRM ou ERP.',
        b: ['Traitement instantané 24/7', 'Cloisonnement strict des fichiers sensibles', 'Connexion directe à vos bases de données']
      },
      {
        t: 'Assistants Internes & Multi-Agents',
        d: "Déploiement d'agents IA connectés à la base de connaissances et aux outils internes de votre entreprise, avec gestion fine des droits d'accès selon le rôle de chaque collaborateur.",
        b: ['Recherche et synthèse métier en temps réel', 'Contrôle granulaire des accès (RBAC)', 'Aucune donnée utilisée pour entraîner des tiers']
      },
      {
        t: 'Pipeline Client & Onboarding Automatisé',
        d: "Automatisation complète depuis la prise de contact jusqu'à l'onboarding client : qualification IA, génération de documents, portail client web ou mobile, synchronisation CRM et suivi automatisé.",
        b: ['Qualification et réponse instantanée aux leads', 'Génération et routage automatique des documents', 'Flux API sécurisés de bout en bout']
      }
    ],

    cmp_tag: 'Pourquoi choisir AEGIFLOW ?',
    cmp_title: 'La différence entre un bricolage fragile et une architecture Security by Design.',
    cmp_left_title: 'Intégration IA Classique',
    cmp_left_badge: 'Risque Élevé',
    cmp_risks: [
      'Clés API et identifiants exposés en clair dans les scripts ou interfaces.',
      'Envoi de données clients confidentielles vers des modèles IA publics non cloisonnés.',
      "Automatisations instables qui cassent dès qu'une API ou un format évolue.",
      'Aucun contrôle des rôles ni vérification des failles de sécurité avant mise en ligne.'
    ],
    cmp_right_title: 'Standard AEGIFLOW',
    cmp_right_badge: 'Security by Design',
    cmp_safe: [
      "Chiffrement et protection stricte des clés API, webhooks et variables d'environnement.",
      'Architecture IA privée et cloisonnée : vos données restent 100 % sous votre contrôle.',
      'Architecture robuste, gestion avancée des erreurs et workflows évolutifs.',
      'Validation issue de la cybersécurité offensive (Pentest & Hardening) avant livraison.'
    ],

    off_tag: "Formats d'intervention",
    off_title: 'Des déploiements structurés, rapides et orientés résultats.',
    offers: [
      {
        step: 'Étape 01 · Quick Win',
        title: 'Audit Flash & 1er Flux',
        desc: "Cartographie de vos processus, vérification de sécurité de vos accès API et déploiement rapide d'une première automatisation clé en main.",
        b: ["Diagnostic complet des goulots d'étranglement", 'Vérification de sécurité des intégrations', '1er système automatisé livré et opérationnel'],
        cta: 'Demander ce diagnostic'
      },
      {
        step: 'Étape 02 · Architecture',
        badge: 'Solution Complète',
        title: 'Écosystème IA, Automatisation & Logiciel',
        desc: 'Conception et déploiement intégral de vos agents IA, de vos flux automatisés et de vos logiciels sur mesure sous architecture Security by Design.',
        b: ['Agents IA autonomes & workflows sur mesure', 'Applications Web, Mobile ou PC dédiées', 'Documentation technique & prise en main'],
        cta: 'Discutons de votre projet'
      },
      {
        step: 'Étape 03 · Suivi continu',
        title: 'Évolution & Sécurité Continue',
        desc: 'Accompagnement mensuel pour faire évoluer vos outils IA, maintenir vos connecteurs API et garantir la protection continue de votre infrastructure.',
        b: ['Monitoring et optimisation des performances', 'Contrôles de sécurité et mises à jour régulières', 'Support technique prioritaire'],
        cta: 'En savoir plus'
      }
    ],

    f_role: 'Fondateur @ AEGIFLOW',
    f_loc: 'France · Espagne · International',
    f_linkedin: 'Profil LinkedIn',
    f_linkedin_company: 'Page LinkedIn AEGIFLOW',
    f_tag: 'À Propos',
    f_title: "L'alliance de l'ingénierie IA, de l'automatisation avancée et de la cybersécurité.",
    f_bio: "Spécialiste en ingénierie d'Intelligence Artificielle (systèmes multi-agents, intégration LLM), en automatisation de processus complexes (workflows & interconnexions API), en développement logiciel et en cybersécurité (Pentest, défense active et durcissement système), Ousmane Barry a fondé AEGIFLOW pour permettre aux entreprises en France, en Espagne et à l'international d'accélérer leurs opérations avec des architectures fiables, performantes et sécurisées dès la conception.",
    kpis: [
      { val: '+8 ans', n: 8, dec: 0, pre: '+', suf: ' ans', label: "d'expérience" },
      { val: '+40', n: 40, dec: 0, pre: '+', suf: '', label: 'projets réalisés' },
      { val: '98,7%', n: 98.7, dec: 1, pre: '', suf: '%', label: 'satisfaction client' },
      { val: '99,4%', n: 99.4, dec: 1, pre: '', suf: '%', label: 'délais respectés' },
      { val: '100%', n: 100, dec: 0, pre: '', suf: '%', label: 'Qualité' },
      { val: '100%', n: 100, dec: 0, pre: '', suf: '%', label: 'Conformité RGPD' }
    ],

    faq_tag: 'FAQ',
    faq_title: 'Questions fréquentes sur AEGIFLOW',
    faq: [
      {
        q: "Qu'est-ce qu'AEGIFLOW ?",
        a: "AEGIFLOW est une société d'ingénierie fondée par Ousmane Barry, spécialisée en agents IA et LLM sur mesure, automatisation de processus par API, développement logiciel (Web, Mobile et PC) et cybersécurité. Chaque projet est conçu selon le principe Security by Design."
      },
      {
        q: 'Dans quelles zones et quelles langues intervenez-vous ?',
        a: "Nous accompagnons des PME, agences et grandes entreprises en France, en Espagne, dans toute l'Union européenne et à l'international, en français, en anglais et en espagnol, à distance ou sur site."
      },
      {
        q: 'Mes données sont-elles envoyées à des IA publiques ?',
        a: "Non. Nous concevons des architectures IA privées et cloisonnées : modèles hébergés en Europe ou en local, API configurées sans rétention ni entraînement, chiffrement et contrôle d'accès par rôle. Vos données restent sous votre contrôle, conformément au RGPD."
      },
      {
        q: 'Quels outils pouvez-vous connecter et automatiser ?',
        a: "Pratiquement tout outil disposant d'une API, de webhooks ou d'une base de données : CRM (HubSpot, Salesforce, Pipedrive), ERP (Odoo, SAP), Google Workspace, Microsoft 365, outils de facturation, bases SQL/NoSQL et applications métiers internes."
      },
      {
        q: 'Développez-vous aussi des applications web, mobiles et PC ?',
        a: "Oui. Nous développons des applications web et SaaS, des portails clients, des apps mobiles iOS et Android et des logiciels desktop Windows, macOS et Linux, avec l'IA et vos API intégrées nativement et une sécurité pensée dès la conception."
      },
      {
        q: 'Comment démarrer un projet avec AEGIFLOW ?',
        a: 'Décrivez votre besoin via le formulaire sécurisé ou écrivez directement à Ousmane Barry sur LinkedIn. Nous revenons vers vous sous 24 à 48 heures ouvrées pour un premier échange et un diagnostic.'
      }
    ],

    cta_tag: 'Contact & Diagnostic',
    cta_title: "Discutons de votre projet d'IA, d'automatisation ou de logiciel.",
    cta_sub: 'Expliquez-nous votre besoin via le formulaire sécurisé ci-contre ou contactez directement Ousmane Barry en message privé sur LinkedIn pour une réponse rapide.',
    cta_btn_li: 'Écrire directement sur LinkedIn',
    cta_mail_label: 'Ou par email :',
    cta_b: [
      'Réponse sous 24 à 48 h ouvrées & confidentialité totale',
      'Architecture 100 % sur mesure (IA, Automatisation, Logiciel & Security by Design)',
      'Accompagnement en France, Espagne & International (FR / EN / ES)'
    ],
    form: {
      aria: 'Formulaire de contact sécurisé',
      name_l: 'Nom complet *',
      name_p: 'Votre nom',
      email_l: 'Email professionnel *',
      email_p: 'nom@entreprise.com',
      comp_l: 'Entreprise (facultatif)',
      comp_p: 'Nom de votre structure',
      msg_l: 'Détails de votre projet *',
      msg_p: 'Décrivez brièvement les processus que vous souhaitez automatiser, développer ou sécuriser...',
      rgpd: "J'accepte que mes informations soient traitées par AEGIFLOW uniquement pour répondre à ma demande de contact (conformément à la politique de confidentialité).",
      submit: 'Envoyer ma demande',
      sending: 'Envoi en cours...',
      ok: 'Votre demande a bien été envoyée. Un email de confirmation vous a été adressé et nous vous répondrons sous 24 à 48 h ouvrées.',
      err: "Une erreur est survenue lors de l'envoi. Veuillez réessayer ou nous contacter sur LinkedIn."
    }
  },

  // ---------------------------------------------------------------------------
  // Pages services
  // ---------------------------------------------------------------------------
  services: {
    ai: {
      meta_title: 'Agents IA & LLM sur mesure pour entreprises | AEGIFLOW',
      meta_desc: "Conception d'agents IA, de systèmes multi-agents et de LLM privés (RAG) pour automatiser documents, support et opérations. Zéro fuite de données, conforme RGPD.",
      nav: 'Agents IA & LLM',
      nav_sub: 'Multi-agents, LLM privés & RAG',
      tag: 'Agents IA & LLM',
      h1: 'Agents IA & LLM sur mesure, privés et sécurisés',
      lead: "AEGIFLOW conçoit des agents IA et des systèmes multi-agents qui traitent vos documents, répondent à vos équipes et exécutent des tâches dans vos outils, sur des modèles privés, cloisonnés et conformes au RGPD.",
      highlights: [
        { t: 'Multi-agents autonomes', d: 'Des agents spécialisés qui coopèrent pour exécuter des processus complets.' },
        { t: 'LLM privés & RAG', d: 'Vos connaissances internes interrogées sans quitter votre périmètre.' },
        { t: 'Zéro fuite de données', d: 'Aucune donnée utilisée pour entraîner des modèles tiers.' }
      ],
      deliver_title: 'Ce que nous concevons pour vous',
      deliver: [
        { t: 'Agents IA métiers', d: 'Des agents capables de lire, décider et agir dans vos outils (CRM, ERP, messagerie, bases de données) selon des règles métier précises.' },
        { t: 'Systèmes multi-agents', d: "Orchestration de plusieurs agents spécialisés (extraction, validation, rédaction, contrôle) pour automatiser des chaînes de tâches complexes." },
        { t: 'Assistants internes (RAG)', d: 'Un assistant connecté à vos documents, procédures et bases de connaissances, qui répond avec ses sources et respecte les droits de chacun.' },
        { t: 'Traitement documentaire IA', d: 'Extraction structurée de contrats, factures, emails et PDF, puis injection directe dans vos systèmes.' },
        { t: 'Intégration LLM par API', d: 'Intégration sécurisée de modèles (OpenAI, Azure OpenAI, Mistral, Claude ou open source) dans vos applications existantes.' },
        { t: 'LLM auto-hébergés', d: 'Déploiement de modèles open source en local ou sur cloud européen pour vos données les plus sensibles.' }
      ],
      uc_title: 'Exemples de déploiements',
      usecases: [
        { t: 'Tri automatique des emails entrants', d: 'Un agent classe, résume et route chaque email vers la bonne équipe, prépare un brouillon de réponse et met à jour le CRM.' },
        { t: 'Analyse de contrats et factures', d: "Extraction des montants, dates, clauses et parties, contrôle de cohérence et alerte en cas d'anomalie." },
        { t: 'Assistant support & base de connaissances', d: 'Vos équipes obtiennent en quelques secondes une réponse sourcée à partir de vos procédures internes.' }
      ],
      steps: [
        { t: "Cadrage & cas d'usage", d: 'Identification des tâches à fort retour sur investissement, des données disponibles et des contraintes de sécurité.' },
        { t: 'Prototype mesurable', d: 'Un premier agent testé sur vos données réelles, avec des indicateurs de qualité clairs.' },
        { t: 'Industrialisation sécurisée', d: "Cloisonnement, gestion des secrets, journalisation, contrôle d'accès et intégration à vos outils." },
        { t: 'Suivi & amélioration', d: 'Monitoring des réponses, évaluation continue et mises à jour des modèles.' }
      ],
      security_title: 'Une IA puissante, sans compromis sur vos données',
      security_text: "Un agent IA a accès à vos données et à vos outils : il doit être conçu comme un composant critique de votre système d'information.",
      security: [
        'Modèles privés ou API configurées sans rétention ni entraînement sur vos données.',
        'Cloisonnement par client, par service et par rôle (RBAC), avec journalisation des accès.',
        "Protection contre l'injection de prompt et la fuite d'informations sensibles.",
        'Hébergement en Europe possible et conformité RGPD documentée.'
      ],
      faq: [
        { q: 'Quelle est la différence entre un chatbot et un agent IA ?', a: "Un chatbot répond à des questions. Un agent IA raisonne, utilise des outils et exécute des actions : lire un document, interroger une base de données, créer une fiche CRM ou envoyer un email, dans un cadre de règles et de permissions défini." },
        { q: 'Quels modèles de langage utilisez-vous ?', a: "Nous choisissons le modèle selon votre besoin et la sensibilité de vos données : modèles commerciaux via API (OpenAI, Azure OpenAI, Mistral, Anthropic) configurés sans rétention, ou modèles open source auto-hébergés lorsque les données ne doivent jamais quitter votre infrastructure." },
        { q: "Mes données servent-elles à entraîner l'IA ?", a: "Non. Nos architectures excluent toute réutilisation de vos données pour l'entraînement de modèles tiers. Les accès sont cloisonnés, chiffrés et journalisés." },
        { q: "Peut-on connecter l'agent à nos outils existants ?", a: 'Oui. Nos agents s’intègrent à vos CRM, ERP, messageries, GED, bases SQL/NoSQL et API internes, avec des permissions limitées au strict nécessaire.' },
        { q: "Comment mesurez-vous la qualité d'un agent IA ?", a: "Chaque agent est évalué sur un jeu de cas réels avant sa mise en production (exactitude, taux d'escalade, temps de traitement), puis suivi en continu pour détecter toute dérive." }
      ],
      cta_title: 'Un processus que vous aimeriez confier à un agent IA ?',
      cta_text: 'Décrivez-le en quelques lignes : nous vous indiquons ce qui est automatisable, avec quel niveau de sécurité et quel retour sur investissement.'
    },

    automation: {
      meta_title: 'Automatisation de processus & intégration API | AEGIFLOW',
      meta_desc: 'Automatisation de workflows, interconnexion API et synchronisation CRM, ERP et bases de données. Des flux robustes, sécurisés et maintenables pour PME et entreprises.',
      nav: 'Automatisation & APIs',
      nav_sub: 'Workflows, CRM, ERP & données',
      tag: 'Automatisation & APIs',
      h1: 'Automatisation de processus et interconnexion API sur mesure',
      lead: "AEGIFLOW connecte vos outils métiers et automatise vos processus de bout en bout : moins de saisie manuelle, moins d'erreurs, des données synchronisées en temps réel, avec des flux robustes et sécurisés.",
      highlights: [
        { t: 'Workflows de bout en bout', d: "Du déclencheur à l'action finale, sans intervention manuelle." },
        { t: 'CRM · ERP · Bases de données', d: 'Vos outils parlent enfin le même langage.' },
        { t: 'Robustesse & supervision', d: 'Gestion des erreurs, reprises automatiques et alertes.' }
      ],
      deliver_title: 'Ce que nous automatisons',
      deliver: [
        { t: 'Workflows métiers complexes', d: 'Orchestration de processus multi-étapes avec conditions, validations humaines et règles métier.' },
        { t: "Interconnexion d'API", d: 'Connecteurs sur mesure REST, GraphQL et webhooks entre vos logiciels, même sans intégration native.' },
        { t: 'Synchronisation CRM & ERP', d: 'Clients, commandes, factures et stocks synchronisés automatiquement entre vos systèmes.' },
        { t: 'Pipelines de données', d: 'Collecte, nettoyage, transformation et chargement de données vers vos bases et tableaux de bord.' },
        { t: 'Génération de documents', d: 'Devis, contrats, rapports et factures générés et envoyés automatiquement.' },
        { t: "Automatisation augmentée par l'IA", d: 'Des étapes intelligentes (classification, extraction, rédaction) intégrées dans vos flux.' }
      ],
      uc_title: 'Exemples de déploiements',
      usecases: [
        { t: 'Du lead au client, sans ressaisie', d: 'Formulaire, qualification, création CRM, devis, signature et onboarding enchaînés automatiquement.' },
        { t: 'Facturation et relances automatisées', d: "Factures générées depuis l'ERP, envoyées, suivies et relancées selon vos règles." },
        { t: 'Reporting consolidé en temps réel', d: 'Les données de vos outils centralisées dans un tableau de bord fiable, mis à jour en continu.' }
      ],
      steps: [
        { t: 'Cartographie des processus', d: "Analyse des flux actuels, des outils utilisés et des goulots d'étranglement." },
        { t: 'Architecture des flux', d: 'Choix des outils (n8n, Make, code sur mesure), sécurisation des accès et gestion des erreurs.' },
        { t: 'Développement & tests', d: 'Construction des flux, tests sur données réelles et validation avec vos équipes.' },
        { t: 'Mise en production & suivi', d: 'Supervision, alertes, documentation et évolutions continues.' }
      ],
      security_title: 'Des automatisations qui ne deviennent pas une faille',
      security_text: 'Chaque flux manipule des identifiants et des données sensibles : nous les traitons comme une infrastructure critique.',
      security: [
        'Clés API, tokens et webhooks chiffrés, jamais exposés en clair dans les scénarios.',
        'Comptes de service à privilèges minimaux et rotation régulière des secrets.',
        'Validation et signature des webhooks entrants pour bloquer les appels frauduleux.',
        "Journalisation, alertes et plans de reprise en cas d'erreur."
      ],
      faq: [
        { q: 'Utilisez-vous n8n, Make ou du code sur mesure ?', a: 'Les trois, selon le contexte. n8n auto-hébergé est idéal pour garder la maîtrise des données, Make pour des flux rapides à mettre en place, et le code sur mesure (Node.js, Python) pour les volumes élevés ou les logiques complexes.' },
        { q: "Pouvez-vous connecter un logiciel qui n'a pas d'intégration native ?", a: "Oui, dès lors qu'il expose une API, une base de données, des exports ou des webhooks. Nous développons alors un connecteur sur mesure, documenté et sécurisé." },
        { q: 'Que se passe-t-il si une API change ou tombe en panne ?', a: 'Nos flux intègrent la gestion des erreurs, les reprises automatiques et des alertes. En suivi continu, nous adaptons les connecteurs lorsque les API évoluent.' },
        { q: 'Quels processus automatiser en priorité ?', a: "Les tâches répétitives, à fort volume et sujettes aux erreurs : saisie de données, relances, synchronisation entre outils, génération de documents et reporting. L'Audit Flash permet de les identifier et de les prioriser." },
        { q: 'Mes données restent-elles en Europe ?', a: 'Nous privilégions des outils auto-hébergés ou des fournisseurs avec hébergement européen, et documentons chaque flux de données pour votre conformité RGPD.' }
      ],
      cta_title: "Combien d'heures perdez-vous chaque semaine en tâches manuelles ?",
      cta_text: 'Décrivez votre processus actuel : nous identifions ce qui peut être automatisé et le gain attendu.'
    },

    software: {
      meta_title: 'Développement logiciel sur mesure Web, Mobile & PC | AEGIFLOW',
      meta_desc: "Développement d'applications web, d'apps mobiles iOS & Android et de logiciels desktop sur mesure, sécurisés dès la conception, avec l'IA et vos API intégrées.",
      nav: 'Développement Web, Mobile & PC',
      nav_sub: 'Applications, SaaS, apps & logiciels',
      tag: 'Développement Web, Mobile & PC',
      h1: 'Développement logiciel sur mesure : Web, Mobile & PC',
      lead: "Applications web, apps mobiles iOS et Android, logiciels desktop : AEGIFLOW conçoit des produits rapides, maintenables et sécurisés dès la conception, avec l'IA et vos API intégrées nativement.",
      highlights: [
        { t: 'Web, mobile & desktop', d: 'Une seule équipe pour toutes vos plateformes.' },
        { t: 'IA & API intégrées', d: 'Vos logiciels connectés à vos outils et à vos agents IA.' },
        { t: 'Sécurisé dès la conception', d: 'Authentification, rôles et données protégés par défaut.' }
      ],
      deliver_title: 'Ce que nous développons',
      deliver: [
        { t: 'Applications web & SaaS', d: 'Plateformes métiers, SaaS et outils internes performants, accessibles depuis n’importe quel navigateur.' },
        { t: 'Portails clients & extranets', d: 'Espaces sécurisés pour vos clients et partenaires : documents, suivi de dossiers, paiements et support.' },
        { t: 'Applications mobiles iOS & Android', d: "Apps natives ou multiplateformes, rapides et fiables, publiées sur l'App Store et Google Play." },
        { t: 'Logiciels desktop (PC)', d: 'Logiciels Windows, macOS et Linux pour les usages métiers exigeants, en ligne ou hors ligne.' },
        { t: 'Back-ends & API', d: 'Architectures serveur robustes, API documentées et bases de données conçues pour évoluer.' },
        { t: 'Tableaux de bord & back-offices', d: 'Interfaces d’administration et de pilotage claires pour gérer vos opérations au quotidien.' }
      ],
      uc_title: 'Exemples de réalisations',
      usecases: [
        { t: 'Portail client avec suivi en temps réel', d: "Vos clients suivent l'avancement de leurs dossiers, échangent des documents et reçoivent des notifications automatiques." },
        { t: 'Application mobile terrain', d: 'Vos équipes saisissent interventions, photos et signatures sur mobile, synchronisées avec votre back-office.' },
        { t: "Outil interne connecté à l'IA", d: "Une application métier qui centralise vos données et s'appuie sur des agents IA pour accélérer chaque tâche." }
      ],
      steps: [
        { t: 'Spécifications & UX', d: 'Ateliers, parcours utilisateurs, maquettes et priorisation des fonctionnalités.' },
        { t: 'Architecture & sécurité', d: 'Choix technologiques, modèle de données, authentification et gestion des rôles.' },
        { t: 'Développement itératif', d: 'Livraisons régulières, démonstrations et ajustements à chaque étape.' },
        { t: 'Déploiement & maintenance', d: 'Mise en production, publication sur les stores, monitoring et évolutions.' }
      ],
      security_title: 'Un logiciel sécurisé avant même sa première ligne de code',
      security_text: "La sécurité n'est pas une option ajoutée en fin de projet : elle structure l'architecture dès le premier jour.",
      security: [
        "Authentification forte, gestion des sessions et contrôle d'accès par rôle.",
        "Prise en compte de l'OWASP Top 10 et revue de code orientée sécurité.",
        'Chiffrement des données sensibles en transit et au repos.',
        "Tests d'intrusion avant mise en production."
      ],
      faq: [
        { q: 'Quelles technologies utilisez-vous ?', a: 'Nous choisissons la stack selon votre projet : React, Next.js ou Vue pour le web, React Native ou Flutter pour le mobile, Electron ou Tauri pour le desktop, et Node.js, Python ou des services serverless côté back-end.' },
        { q: 'Développez-vous en natif ou en multiplateforme ?', a: "Les deux. Le multiplateforme réduit les coûts et les délais pour la plupart des projets ; le natif reste pertinent pour des besoins très spécifiques de performance ou d'accès matériel." },
        { q: 'Qui est propriétaire du code ?', a: 'Vous. Le code source, la documentation et les accès vous sont remis à la livraison, sans dépendance cachée.' },
        { q: 'Pouvez-vous reprendre ou moderniser un logiciel existant ?', a: "Oui. Nous auditons l'existant (code, sécurité, performance), puis proposons une modernisation progressive ou une refonte selon le rapport bénéfice/risque." },
        { q: 'Proposez-vous la maintenance après livraison ?', a: "Oui, via l'accompagnement continu : mises à jour de sécurité, correctifs, évolutions fonctionnelles et support prioritaire." }
      ],
      cta_title: "Un projet d'application web, mobile ou PC ?",
      cta_text: 'Présentez-nous votre idée ou votre besoin métier : nous revenons vers vous avec une première approche technique.'
    },

    security: {
      meta_title: 'Cybersécurité, Pentest & Security by Design | AEGIFLOW',
      meta_desc: "Tests d'intrusion web, API et Active Directory, durcissement système, protection des clés API et architectures Security by Design pour vos projets IA et logiciels.",
      nav: 'Cybersécurité & Pentest',
      nav_sub: 'Pentest, Hardening & Security by Design',
      tag: 'Cybersécurité & Security by Design',
      h1: 'Cybersécurité offensive & défensive, Security by Design',
      lead: "Issue de la cybersécurité offensive, l'approche AEGIFLOW protège vos applications, vos automatisations et vos agents IA dès la conception : tests d'intrusion, durcissement des systèmes et protection stricte de vos secrets.",
      highlights: [
        { t: 'Pentest web, API & AD', d: 'Vos failles identifiées avant les attaquants.' },
        { t: 'Hardening', d: 'Systèmes Linux, Windows et cloud durcis selon les bonnes pratiques.' },
        { t: "Sécurité de l'IA", d: 'Agents et automatisations protégés contre les nouveaux risques.' }
      ],
      deliver_title: 'Nos prestations de sécurité',
      deliver: [
        { t: "Tests d'intrusion web & API", d: "Évaluation offensive de vos applications et API selon l'OWASP, avec preuves d'exploitation et plan de remédiation priorisé." },
        { t: 'Audit Active Directory & interne', d: "Identification des chemins d'attaque, des privilèges excessifs et des mauvaises configurations de votre réseau interne." },
        { t: 'Durcissement des systèmes', d: 'Hardening de serveurs Linux et Windows, de postes de travail et d’environnements cloud selon les référentiels reconnus.' },
        { t: 'Gestion des secrets & des accès', d: "Coffre-fort de secrets, rotation des clés API, moindre privilège et contrôle d'accès par rôle (RBAC)." },
        { t: 'Sécurité des agents IA & automatisations', d: "Protection contre l'injection de prompt, la fuite de données et l'abus de webhooks ou de connecteurs." },
        { t: 'Accompagnement Security by Design', d: "Revue d'architecture, modélisation des menaces et exigences de sécurité intégrées dès la conception de vos projets." }
      ],
      uc_title: "Exemples d'interventions",
      usecases: [
        { t: 'Pentest avant mise en production', d: 'Une application ou une API testée en conditions réelles avant son lancement, avec correctifs vérifiés.' },
        { t: "Sécurisation d'un parc d'automatisations", d: 'Inventaire des flux, des clés API et des webhooks, puis remédiation des expositions.' },
        { t: "Durcissement d'une infrastructure", d: "Réduction de la surface d'attaque des serveurs et des comptes à privilèges." }
      ],
      steps: [
        { t: "Périmètre & règles d'engagement", d: "Définition des cibles, des objectifs et du cadre légal de l'intervention." },
        { t: 'Analyse & tests offensifs', d: 'Reconnaissance, recherche de vulnérabilités et exploitation contrôlée.' },
        { t: 'Rapport & remédiation', d: 'Rapport clair (direction et technique), priorisation des risques et accompagnement aux correctifs.' },
        { t: 'Contre-audit & suivi', d: 'Vérification des corrections et contrôles de sécurité réguliers.' }
      ],
      security_title: "Pourquoi une approche issue de l'offensif ?",
      security_text: "Pour défendre efficacement un système, il faut savoir comment il est réellement attaqué.",
      security: [
        "Nous testons vos systèmes comme le ferait un attaquant réel, pas avec une simple checklist.",
        'Chaque recommandation est priorisée selon son impact réel sur votre activité.',
        "La même exigence s'applique à tout ce que nous livrons : IA, automatisations et logiciels.",
        'Interventions encadrées, confidentielles et conformes au RGPD.'
      ],
      faq: [
        { q: "Qu'est-ce que le Security by Design ?", a: "C'est le principe d'intégrer la sécurité dès la conception d'un système plutôt que de la corriger après coup : moindre privilège, cloisonnement, protection des secrets, validation des entrées et tests offensifs avant livraison." },
        { q: "Quelle est la différence entre un audit et un test d'intrusion ?", a: "Un audit évalue la conformité et la configuration par rapport à des référentiels. Un test d'intrusion simule une attaque réelle pour démontrer concrètement ce qu'un attaquant pourrait obtenir. Les deux sont complémentaires." },
        { q: 'Le pentest peut-il perturber ma production ?', a: "Les tests sont planifiés avec vous et encadrés par des règles d'engagement. Les actions à risque sont évitées ou réalisées sur un environnement de préproduction." },
        { q: 'Que contient le rapport ?', a: 'Une synthèse pour la direction, le détail technique de chaque vulnérabilité avec preuves, son niveau de risque et des recommandations de correction priorisées.' },
        { q: "Sécurisez-vous des projets que vous n'avez pas développés ?", a: "Oui. Nous auditons et sécurisons des applications, des API, des automatisations et des infrastructures existantes, quel que soit le prestataire d'origine." }
      ],
      cta_title: "Vous voulez savoir ce qu'un attaquant verrait de votre système ?",
      cta_text: 'Parlez-nous de votre périmètre : application, API, automatisations ou infrastructure.'
    }
  }
};
