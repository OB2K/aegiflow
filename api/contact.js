// ==============================================================================
// AEGIFLOW — Serverless Contact API Handler (Vercel Node.js Function)
// Path: /api/contact
// Hardened according to Security by Design:
//   - Strict HTML escaping on all user inputs (zero HTML/XSS injection)
//   - Anti-relay auto-responder (never echoes user-supplied message/URLs to third parties)
//   - Honeypot + minimum fill-time check + per-IP rate limiting
//   - Localized responses (FR / EN / ES)
// ==============================================================================

const RATE_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const RATE_MAX_REQUESTS = 4;
const ipBuckets = new Map();

function checkRateLimit(ip) {
  const now = Date.now();
  if (ipBuckets.size > 500) {
    for (const [key, entry] of ipBuckets.entries()) {
      if (now - entry.start > RATE_WINDOW_MS) ipBuckets.delete(key);
    }
  }
  const current = ipBuckets.get(ip);
  if (!current || now - current.start > RATE_WINDOW_MS) {
    ipBuckets.set(ip, { start: now, count: 1 });
    return true;
  }
  if (current.count >= RATE_MAX_REQUESTS) {
    return false;
  }
  current.count += 1;
  return true;
}

function escapeHtml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function stripHeaderNewlines(value = "") {
  return String(value).replace(/[\r\n]+/g, " ").trim();
}

function sanitizeGreetingName(value = "") {
  return stripHeaderNewlines(value)
    .replace(/https?:\/\/\S+/gi, "")
    .replace(/www\.\S+/gi, "")
    .replace(/[<>[\]{}]/g, "")
    .trim()
    .slice(0, 80);
}

const MESSAGES = {
  fr: {
    ok: "Votre demande a été enregistrée avec succès. Nous vous répondrons sous 24 à 48 heures ouvrées.",
    missing: "Veuillez remplir tous les champs obligatoires (Nom, Email, Message).",
    invalidEmail: "Adresse email invalide.",
    rateLimit: "Trop de tentatives. Veuillez patienter quelques minutes ou nous écrire à contact@aegiflow.eu.",
    sendFail: "Échec de l'envoi. Veuillez nous écrire à contact@aegiflow.eu ou sur LinkedIn.",
    serverErr: "Une erreur interne est survenue. Veuillez nous contacter à contact@aegiflow.eu."
  },
  en: {
    ok: "Your inquiry has been received. We will get back to you within 24 to 48 business hours.",
    missing: "Please fill in all required fields (Name, Email, Message).",
    invalidEmail: "Invalid email address.",
    rateLimit: "Too many attempts. Please wait a few minutes or email us at contact@aegiflow.eu.",
    sendFail: "Could not send your message. Please write to contact@aegiflow.eu or reach out on LinkedIn.",
    serverErr: "An internal error occurred. Please contact us at contact@aegiflow.eu."
  },
  es: {
    ok: "Su solicitud ha sido registrada con éxito. Le responderemos en un plazo de 24 a 48 horas laborables.",
    missing: "Por favor complete todos los campos obligatorios (Nombre, Email, Mensaje).",
    invalidEmail: "Dirección de email no válida.",
    rateLimit: "Demasiados intentos. Por favor espere unos minutos o escríbanos a contact@aegiflow.eu.",
    sendFail: "No se pudo enviar el mensaje. Escríbanos a contact@aegiflow.eu o por LinkedIn.",
    serverErr: "Ocurrió un error interno. Por favor contáctenos en contact@aegiflow.eu."
  }
};

module.exports = async function handler(req, res) {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({
      success: false,
      error: "Method Not Allowed. Use POST."
    });
  }

  let lang = "fr";

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : (req.body || {});
    const rawLang = typeof body.lang === "string" ? body.lang.slice(0, 2).toLowerCase() : "fr";
    lang = ["fr", "en", "es"].includes(rawLang) ? rawLang : "fr";
    const m = MESSAGES[lang];

    // 1. Honeypot & fast-bot timing check
    const websiteHp = typeof body.website_hp === "string" ? body.website_hp.trim() : "";
    const elapsedMs = typeof body.elapsed_ms === "number" ? body.elapsed_ms : 5000;
    if (websiteHp !== "" || elapsedMs < 900) {
      return res.status(200).json({
        success: true,
        message: m.ok
      });
    }

    // 2. Per-IP rate limiting
    const forwarded = req.headers["x-forwarded-for"];
    const clientIp = (typeof forwarded === "string" ? forwarded.split(",")[0] : req.socket?.remoteAddress || "unknown").trim();
    if (!checkRateLimit(clientIp)) {
      return res.status(429).json({
        success: false,
        error: m.rateLimit
      });
    }

    // 3. Input validation & sanitization
    const trimmedName = stripHeaderNewlines(typeof body.name === "string" ? body.name : "").slice(0, 150);
    const trimmedEmail = stripHeaderNewlines(typeof body.email === "string" ? body.email : "").slice(0, 150);
    const trimmedCompany = stripHeaderNewlines(typeof body.company === "string" ? body.company : "").slice(0, 150);
    const trimmedMessage = (typeof body.message === "string" ? body.message : "").trim().slice(0, 5000);

    const emailRegex = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]{2,}$/;
    if (!trimmedName || !trimmedEmail || !trimmedMessage) {
      return res.status(400).json({
        success: false,
        error: m.missing
      });
    }

    if (!emailRegex.test(trimmedEmail)) {
      return res.status(400).json({
        success: false,
        error: m.invalidEmail
      });
    }

    const BREVO_API_KEY = process.env.BREVO_API_KEY;
    const NOTIFICATION_EMAIL = process.env.NOTIFICATION_EMAIL || "contact@aegiflow.eu";
    const SENDER_EMAIL = process.env.SENDER_EMAIL || "contact@aegiflow.eu";

    if (!BREVO_API_KEY) {
      console.error("[AEGIFLOW API] BREVO_API_KEY is not configured.");
      return res.status(503).json({
        success: false,
        error: m.sendFail
      });
    }

    const safeName = escapeHtml(trimmedName);
    const safeEmail = escapeHtml(trimmedEmail);
    const safeCompany = escapeHtml(trimmedCompany || "Non renseignée");
    const safeMessage = escapeHtml(trimmedMessage);
    const safeLang = escapeHtml(lang.toUpperCase());

    const companySubject = trimmedCompany ? ` (${trimmedCompany})` : "";
    const emailSubject = `[AEGIFLOW Lead] Nouveau Projet — ${trimmedName}${companySubject}`.slice(0, 200);

    // 4. Send lead notification to AEGIFLOW
    const brevoPayload = {
      sender: {
        name: "AEGIFLOW Formulaire",
        email: SENDER_EMAIL
      },
      to: [
        {
          email: NOTIFICATION_EMAIL,
          name: "AEGIFLOW"
        }
      ],
      replyTo: {
        email: trimmedEmail,
        name: trimmedName
      },
      subject: emailSubject,
      htmlContent: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background:#01030A; color:#ffffff; padding:30px; border-radius:12px; border:1px solid #00F0FF;">
          <div style="border-bottom:1px solid #00F0FF; padding-bottom:15px; margin-bottom:20px;">
            <h2 style="color:#00F0FF; margin:0; font-size:22px; letter-spacing:1px;">AEGIFLOW — Nouveau Contact Web</h2>
            <p style="color:#94A3B8; font-size:12px; margin:5px 0 0;">Origine : https://www.aegiflow.eu | Langue : ${safeLang}</p>
          </div>
          
          <table style="width:100%; border-collapse:collapse; margin-bottom:20px; font-size:14px; color:#E2E8F0;">
            <tr>
              <td style="padding:8px 0; width:140px; color:#94A3B8; font-weight:600;">Nom complet :</td>
              <td style="padding:8px 0; font-weight:700; color:#ffffff;">${safeName}</td>
            </tr>
            <tr>
              <td style="padding:8px 0; color:#94A3B8; font-weight:600;">Email :</td>
              <td style="padding:8px 0;"><a href="mailto:${safeEmail}" style="color:#00F0FF; text-decoration:none;">${safeEmail}</a></td>
            </tr>
            <tr>
              <td style="padding:8px 0; color:#94A3B8; font-weight:600;">Entreprise :</td>
              <td style="padding:8px 0;">${safeCompany}</td>
            </tr>
          </table>

          <div style="background:#060B19; border:1px solid rgba(0,240,255,0.25); border-radius:8px; padding:18px;">
            <p style="color:#94A3B8; font-size:12px; margin:0 0 8px; text-transform:uppercase; letter-spacing:0.5px;">Message du prospect :</p>
            <p style="white-space:pre-wrap; line-height:1.6; margin:0; color:#FFFFFF;">${safeMessage}</p>
          </div>

          <div style="margin-top:25px; padding-top:15px; border-top:1px solid rgba(255,255,255,0.1); font-size:11px; color:#64748B;">
            Conforme RGPD &amp; Security by Design · Fonction serverless protégée de aegiflow.eu
          </div>
        </div>
      `
    };

    const brevoResponse = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "api-key": BREVO_API_KEY
      },
      body: JSON.stringify(brevoPayload)
    });

    if (!brevoResponse.ok) {
      const errData = await brevoResponse.json().catch(() => ({}));
      console.error("[AEGIFLOW API] Brevo error:", errData);
      return res.status(502).json({
        success: false,
        error: m.sendFail
      });
    }

    // 5. Safe multilingual confirmation to prospect (never echoes user-supplied body/links)
    try {
      const greetingName = escapeHtml(sanitizeGreetingName(trimmedName) || "");
      const confirmationTemplates = {
        fr: {
          subject: "AEGIFLOW — Confirmation de votre demande de contact",
          greeting: greetingName ? `Bonjour ${greetingName},` : "Bonjour,",
          p1: "Nous avons bien reçu votre demande de contact concernant votre projet.",
          p2: "Notre équipe analyse votre besoin et reviendra vers vous sous 24 à 48 heures ouvrées pour échanger sur vos objectifs d'ingénierie IA, d'automatisation, de développement logiciel ou de cybersécurité.",
          signTeam: "L'équipe AEGIFLOW",
          signPillars: "Agents IA · Automatisation · Logiciel · Security by Design"
        },
        en: {
          subject: "AEGIFLOW — Inquiry Confirmation",
          greeting: greetingName ? `Hello ${greetingName},` : "Hello,",
          p1: "We have received your inquiry regarding your project.",
          p2: "Our team is reviewing your request and will get back to you within 24 to 48 business hours to discuss your AI engineering, workflow automation, software development or cybersecurity goals.",
          signTeam: "The AEGIFLOW Team",
          signPillars: "AI Agents · Automation · Software · Security by Design"
        },
        es: {
          subject: "AEGIFLOW — Confirmación de su solicitud de contacto",
          greeting: greetingName ? `Hola ${greetingName},` : "Hola,",
          p1: "Hemos recibido correctamente su solicitud de contacto sobre su proyecto.",
          p2: "Nuestro equipo está analizando sus necesidades y se pondrá en contacto con usted en un plazo de 24 a 48 horas laborables para abordar sus objetivos de ingeniería de IA, automatización, desarrollo de software o ciberseguridad.",
          signTeam: "El equipo de AEGIFLOW",
          signPillars: "Agentes de IA · Automatización · Software · Security by Design"
        }
      };

      const t = confirmationTemplates[lang] || confirmationTemplates.fr;

      const confirmationPayload = {
        sender: {
          name: "AEGIFLOW",
          email: SENDER_EMAIL
        },
        to: [
          {
            email: trimmedEmail,
            name: sanitizeGreetingName(trimmedName) || "Client"
          }
        ],
        replyTo: {
          email: NOTIFICATION_EMAIL,
          name: "AEGIFLOW"
        },
        subject: t.subject,
        htmlContent: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background:#01030A; color:#ffffff; padding:32px; border-radius:12px; border:1px solid #00F0FF; max-width:620px; margin:0 auto;">
            <div style="border-bottom:1px solid rgba(0,240,255,0.3); padding-bottom:16px; margin-bottom:24px;">
              <h1 style="color:#00F0FF; margin:0; font-size:22px; letter-spacing:1.5px; font-weight:800;">AEGIFLOW</h1>
              <p style="color:#94A3B8; font-size:11px; margin:4px 0 0; text-transform:uppercase; letter-spacing:0.8px;">${t.signPillars}</p>
            </div>

            <p style="font-size:16px; font-weight:600; color:#FFFFFF; margin:0 0 14px;">${t.greeting}</p>
            <p style="font-size:14px; color:#CBD5E1; line-height:1.65; margin:0 0 12px;">${t.p1}</p>
            <p style="font-size:14px; color:#CBD5E1; line-height:1.65; margin:0 0 24px;">${t.p2}</p>

            <div style="border-top:1px solid rgba(255,255,255,0.1); padding-top:18px;">
              <p style="margin:0; font-size:14px; font-weight:700; color:#FFFFFF;">${t.signTeam}</p>
              <p style="margin:4px 0 0; font-size:12px; color:#00F0FF; font-weight:600;">${t.signPillars}</p>
              <p style="margin:6px 0 0; font-size:12px;"><a href="https://www.aegiflow.eu" style="color:#94A3B8; text-decoration:none;">https://www.aegiflow.eu</a></p>
            </div>
          </div>
        `
      };

      await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "api-key": BREVO_API_KEY
        },
        body: JSON.stringify(confirmationPayload)
      });
    } catch (autoErr) {
      console.error("[AEGIFLOW API] Auto-responder error:", autoErr);
    }

    return res.status(200).json({
      success: true,
      message: m.ok
    });
  } catch (error) {
    console.error("[AEGIFLOW API] Server error:", error);
    const m = MESSAGES[lang] || MESSAGES.fr;
    return res.status(500).json({
      success: false,
      error: m.serverErr
    });
  }
};
