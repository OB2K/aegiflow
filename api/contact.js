// ==============================================================================
// AEGIFLOW — Serverless Contact API Handler (Vercel Node.js Function)
// Path: /api/contact
// ==============================================================================

module.exports = async function handler(req, res) {
  // Cabeceras de seguridad
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");

  // Permitir únicamente peticiones POST
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({
      success: false,
      error: "Method Not Allowed. Use POST."
    });
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : (req.body || {});
    const {
      name,
      email,
      company,
      topic,
      message,
      lang = "fr",
      website_hp = ""
    } = body;

    // 1. Trampa Honeypot contra Bots automatizados
    // Si el campo invisible contiene algún valor, responder 200 sin procesar para engañar al bot.
    if (website_hp && website_hp.trim() !== "") {
      return res.status(200).json({
        success: true,
        message: "Demande reçue avec succès."
      });
    }

    // 2. Validación y saneamiento de entradas
    const trimmedName = (name || "").trim().slice(0, 150);
    const trimmedEmail = (email || "").trim().slice(0, 150);
    const trimmedCompany = (company || "").trim().slice(0, 150);
    const trimmedMessage = (message || "").trim().slice(0, 5000);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!trimmedName || !trimmedEmail || !trimmedMessage) {
      return res.status(400).json({
        success: false,
        error: "Veuillez remplir tous les champs obligatoires (Nom, Email, Message)."
      });
    }

    if (!emailRegex.test(trimmedEmail)) {
      return res.status(400).json({
        success: false,
        error: "Adresse email invalide."
      });
    }

    const companySubject = trimmedCompany ? ` (${trimmedCompany})` : "";
    const emailSubject = `[AEGIFLOW Lead] Nouveau Projet — ${trimmedName}${companySubject}`;

    // 3. Integración Segura con la API de Brevo (Transactional Email)
    const BREVO_API_KEY = process.env.BREVO_API_KEY;
    const NOTIFICATION_EMAIL = process.env.NOTIFICATION_EMAIL || "contact@aegiflow.eu";
    const SENDER_EMAIL = process.env.SENDER_EMAIL || "contact@aegiflow.eu";

    if (BREVO_API_KEY) {
      // Envío real a través de Brevo API v3
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
              <p style="color:#94A3B8; font-size:12px; margin:5px 0 0;">Origine : https://www.aegiflow.eu | Langue : ${lang.toUpperCase()}</p>
            </div>
            
            <table style="width:100%; border-collapse:collapse; margin-bottom:20px; font-size:14px; color:#E2E8F0;">
              <tr>
                <td style="padding:8px 0; width:140px; color:#94A3B8; font-weight:600;">Nom complet :</td>
                <td style="padding:8px 0; font-weight:700; color:#ffffff;">${trimmedName}</td>
              </tr>
              <tr>
                <td style="padding:8px 0; color:#94A3B8; font-weight:600;">Email :</td>
                <td style="padding:8px 0;"><a href="mailto:${trimmedEmail}" style="color:#00F0FF; text-decoration:none;">${trimmedEmail}</a></td>
              </tr>
              <tr>
                <td style="padding:8px 0; color:#94A3B8; font-weight:600;">Entreprise :</td>
                <td style="padding:8px 0;">${trimmedCompany || "Non renseignée"}</td>
              </tr>
            </table>

            <div style="background:#060B19; border:1px solid rgba(0,240,255,0.25); border-radius:8px; padding:18px;">
              <p style="color:#94A3B8; font-size:12px; margin:0 0 8px; text-transform:uppercase; letter-spacing:0.5px;">Message du prospect :</p>
              <p style="white-space:pre-wrap; line-height:1.6; margin:0; color:#FFFFFF;">${trimmedMessage}</p>
            </div>

            <div style="margin-top:25px; padding-top:15px; border-top:1px solid rgba(255,255,255,0.1); font-size:11px; color:#64748B;">
              Conforme RGPD & Security by Design · Ce message provient directement de la fonction serverless protégée de aegiflow.eu
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
        console.error("Erreur API Brevo:", errData);
        return res.status(502).json({
          success: false,
          error: "Échec de l'envoi via le service de messagerie. Veuillez utiliser LinkedIn."
        });
      }

      // 3.2 Envío automático de confirmación al cliente (Auto-responder multilingüe)
      try {
        const confirmationTemplates = {
          fr: {
            subject: "AEGIFLOW — Confirmation de votre demande de contact",
            greeting: `Bonjour ${trimmedName},`,
            p1: "Nous avons bien reçu votre demande de contact concernant votre projet.",
            p2: "Notre équipe analyse vos besoins et reviendra vers vous sous 24 à 48 heures ouvrées pour échanger sur vos objectifs d'ingénierie IA, d'automatisation et de sécurité.",
            summaryTitle: "RÉCAPITULATIF DE VOTRE MESSAGE",
            signTeam: "L'équipe AEGIFLOW",
            signPillars: "Ingénierie IA · Automatisation de processus · Security by Design"
          },
          en: {
            subject: "AEGIFLOW — Inquiry Confirmation",
            greeting: `Hello ${trimmedName},`,
            p1: "We have successfully received your inquiry regarding your project.",
            p2: "Our team is reviewing your requirements and will get back to you within 24 to 48 business hours to discuss your AI engineering, workflow automation, and security goals.",
            summaryTitle: "SUMMARY OF YOUR MESSAGE",
            signTeam: "The AEGIFLOW Team",
            signPillars: "AI Engineering · Process Automation · Security by Design"
          },
          es: {
            subject: "AEGIFLOW — Confirmación de su solicitud de contacto",
            greeting: `Hola ${trimmedName},`,
            p1: "Hemos recibido correctamente su mensaje sobre su proyecto.",
            p2: "Nuestro equipo está analizando sus necesidades y se pondrá en contacto con usted en un plazo de 24 a 48 horas laborables para abordar sus objetivos de ingeniería de IA, automatización y seguridad.",
            summaryTitle: "RESUMEN DE SU MENSAJE",
            signTeam: "El equipo de AEGIFLOW",
            signPillars: "Ingeniería de IA · Automatización de procesos · Security by Design"
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
              name: trimmedName
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

              <div style="background:#060B19; border:1px solid rgba(0,240,255,0.22); border-radius:8px; padding:18px; margin-bottom:26px;">
                <p style="color:#00F0FF; font-size:11px; margin:0 0 8px; text-transform:uppercase; letter-spacing:0.6px; font-weight:700;">${t.summaryTitle}</p>
                <p style="white-space:pre-wrap; line-height:1.6; margin:0; color:#E2E8F0; font-size:13px;">${trimmedMessage}</p>
              </div>

              <div style="border-top:1px solid rgba(255,255,255,0.1); padding-top:18px;">
                <p style="margin:0; font-size:14px; font-weight:700; color:#FFFFFF;">${t.signTeam}</p>
                <p style="margin:4px 0 0; font-size:12px; color:#00F0FF; font-weight:600;">${t.signPillars}</p>
                <p style="margin:6px 0 0; font-size:12px;"><a href="https://www.aegiflow.eu" style="color:#94A3B8; text-decoration:none;">AEGIFLOW.eu</a></p>
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
        console.error("[AEGIFLOW API] Erreur auto-responder client:", autoErr);
      }
    } else {
      // Modo preparación segura: BREVO_API_KEY aún no configurada en las variables de entorno de Vercel
      console.log("[AEGIFLOW API] Formulario recibido correctamente. Configura BREVO_API_KEY en Vercel para activación en producción.");
    }

    return res.status(200).json({
      success: true,
      message: "Votre demande a été enregistrée avec succès. Nous vous répondrons dans les plus brefs délais."
    });

  } catch (error) {
    console.error("Erreur serveur handler /api/contact:", error);
    return res.status(500).json({
      success: false,
      error: "Une erreur interne est survenue lors de l'envoi."
    });
  }
};
