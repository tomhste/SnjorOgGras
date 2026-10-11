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
        from: smtpEmail.value(),
        to,
        subject,
        text,
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
