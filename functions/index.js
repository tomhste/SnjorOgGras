const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const { defineSecret } = require("firebase-functions/params");
const { logger } = require("firebase-functions");
const nodemailer = require("nodemailer");

// Set these once via:
//   firebase functions:secrets:set SMTP_EMAIL
//   firebase functions:secrets:set SMTP_APP_PASSWORD
// (prompts for the value in your own terminal — never typed into chat or
// committed to this repo). SMTP_EMAIL is both the Gmail account that logs
// in to send, and the "From" address recipients see.
const smtpEmail = defineSecret("SMTP_EMAIL");
const smtpAppPassword = defineSecret("SMTP_APP_PASSWORD");

const ACCENT = "#1f5f3f";

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/**
 * Turns the plain "Nafn: X\nSími: Y\n..." text (built in OrderForm.tsx)
 * into a readable HTML email — each "Label: value" line becomes its own
 * row, with the phone number rendered as a tap-to-call link on mobile.
 */
function buildHtmlBody(subject, text) {
  const rows = text
    .split("\n")
    .filter(Boolean)
    .map((line) => {
      const [label, ...rest] = line.split(":");
      const value = rest.join(":").trim();
      const safeLabel = escapeHtml(label);
      let safeValue = escapeHtml(value);
      if (/sími/i.test(label)) {
        const digits = value.replace(/\D/g, "");
        safeValue = `<a href="tel:+354${digits}" style="color:${ACCENT};text-decoration:none;">${safeValue}</a>`;
      }
      return `<tr>
        <td style="padding:6px 12px 6px 0;color:#68705f;font-size:13px;white-space:nowrap;vertical-align:top;">${safeLabel}</td>
        <td style="padding:6px 0;color:#16181a;font-size:15px;">${safeValue}</td>
      </tr>`;
    })
    .join("");

  return `<div style="font-family:Georgia,'Times New Roman',serif;max-width:480px;margin:0 auto;">
    <div style="background:${ACCENT};color:#ffffff;padding:20px 24px;border-radius:12px 12px 0 0;">
      <h1 style="margin:0;font-size:20px;font-weight:600;">Snjór &amp; Gras</h1>
      <p style="margin:4px 0 0;font-size:14px;opacity:0.85;">${escapeHtml(subject)}</p>
    </div>
    <table style="width:100%;border-collapse:collapse;background:#f7f5ee;border-radius:0 0 12px 12px;padding:8px 24px;" cellpadding="0" cellspacing="0">
      ${rows}
    </table>
  </div>`;
}

/**
 * Watches the `mail` collection (written by the website's order form, see
 * src/components/OrderForm.tsx) and actually sends the email the moment a
 * new document appears — this is the self-managed replacement for
 * Firebase's "Trigger Email" extension, which is being retired in 2027.
 */
exports.sendOrderEmail = onDocumentCreated(
  {
    document: "mail/{mailId}",
    secrets: [smtpEmail, smtpAppPassword],
    region: "europe-west1",
  },
  async (event) => {
    const data = event.data?.data();
    if (!data) {
      logger.warn("sendOrderEmail: no data on created document, skipping");
      return;
    }

    const to = Array.isArray(data.to) ? data.to : [data.to];
    const subject = data.message?.subject ?? "Ný beiðni";
    const text = data.message?.text ?? "";

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: smtpEmail.value(),
        pass: smtpAppPassword.value(),
      },
    });

    try {
      await transporter.sendMail({
        from: `Snjór & Gras <${smtpEmail.value()}>`,
        to,
        subject,
        text,
        html: buildHtmlBody(subject, text),
      });
      logger.info(`sendOrderEmail: sent to ${to.join(", ")}`);
    } catch (err) {
      // Logged but not re-thrown: the order itself is already safely saved
      // in the `requests` collection regardless of whether this email
      // succeeds, so a flaky SMTP send shouldn't look like a failed order.
      logger.error("sendOrderEmail: failed to send", err);
    }
  }
);
