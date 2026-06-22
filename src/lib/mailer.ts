import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export interface QuoteEnquiry {
  name: string;
  company?: string | null;
  email: string;
  phone?: string | null;
  message: string;
}

function buildEmailHtml(data: QuoteEnquiry): string {
  const row = (label: string, value: string) =>
    `<tr>
      <td style="padding:10px 16px;font-weight:600;color:#374151;background:#f9fafb;width:140px;border-bottom:1px solid #e5e7eb;">${label}</td>
      <td style="padding:10px 16px;color:#111827;border-bottom:1px solid #e5e7eb;">${value}</td>
    </tr>`;

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);max-width:600px;width:100%;">
        <!-- Header -->
        <tr>
          <td style="background:#1e293b;padding:28px 32px;">
            <h1 style="margin:0;color:#ffffff;font-size:20px;font-weight:700;">New Quote Enquiry</h1>
            <p style="margin:6px 0 0;color:#94a3b8;font-size:13px;">Received via CS Glaze website</p>
          </td>
        </tr>
        <!-- Details -->
        <tr>
          <td style="padding:24px 32px 8px;">
            <p style="margin:0 0 16px;font-size:14px;color:#6b7280;">A new proposal request has been submitted. Details below:</p>
            <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e7eb;border-radius:6px;overflow:hidden;font-size:14px;">
              ${row("Name", data.name)}
              ${row("Email", `<a href="mailto:${data.email}" style="color:#2563eb;">${data.email}</a>`)}
              ${data.phone ? row("Phone", `<a href="tel:${data.phone}" style="color:#2563eb;">${data.phone}</a>`) : ""}
              ${data.company ? row("Company", data.company) : ""}
              <tr>
                <td style="padding:10px 16px;font-weight:600;color:#374151;background:#f9fafb;vertical-align:top;">Message</td>
                <td style="padding:10px 16px;color:#111827;white-space:pre-wrap;">${data.message}</td>
              </tr>
            </table>
          </td>
        </tr>
        <!-- CTA -->
        <tr>
          <td style="padding:24px 32px 32px;">
            <a href="mailto:${data.email}" style="display:inline-block;background:#2563eb;color:#ffffff;text-decoration:none;padding:10px 24px;border-radius:6px;font-size:14px;font-weight:600;">Reply to ${data.name}</a>
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="background:#f9fafb;padding:16px 32px;border-top:1px solid #e5e7eb;">
            <p style="margin:0;font-size:12px;color:#9ca3af;">This email was sent automatically from the CS Glaze contact form.</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export async function sendQuoteEnquiryEmail(data: QuoteEnquiry): Promise<void> {
  await transporter.sendMail({
    from: `"CS Glaze Website" <${process.env.SMTP_USER}>`,
    to: process.env.OWNER_EMAIL,
    replyTo: data.email,
    subject: `New Quote Enquiry from ${data.name}${data.company ? ` (${data.company})` : ""}`,
    html: buildEmailHtml(data),
  });
}
