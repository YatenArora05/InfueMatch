import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: Number(process.env.SMTP_PORT) === 465, // true only for port 465 (SSL), false for 587 (STARTTLS)
  requireTLS: Number(process.env.SMTP_PORT || 587) === 587, // enforce STARTTLS on port 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false, // avoids self-signed cert errors in dev
  },
});

function getWelcomeTransporter() {
  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    return nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }
  return transporter;
}

/**
 * Welcome email for new users. Uses EMAIL_USER / EMAIL_PASS (Gmail) when set, otherwise SMTP_* transport.
 */
export async function sendWelcomeEmail(email: string, name: string) {
  const transport = getWelcomeTransporter();
  const fromAddr =
    process.env.EMAIL_USER ||
    process.env.SMTP_FROM?.match(/<([^>]+)>/)?.[1] ||
    process.env.SMTP_USER;
  const from =
    fromAddr != null && fromAddr !== ""
      ? `"InflueMatch" <${fromAddr}>`
      : '"InflueMatch" <no-reply@influematch.com>';

  await transport.sendMail({
    from,
    to: email,
    subject: "Welcome to InflueMatch 🚀",
    html: getWelcomeEmailHtml(name),
  });
}

export async function sendResetOtpEmail(to: string, otp: string) {
  const html = getResetOtpEmailHtml(otp);

  await transporter.sendMail({
    from: process.env.SMTP_FROM || '"InflueMatch" <no-reply@influematch.com>',
    to,
    subject: "Your InflueMatch password reset code",
    html,
  });
}

export async function sendCollaborationEmail(
  to: string,
  influencerName: string,
  brandName: string,
  brandEmail: string
) {
  const html = getCollaborationEmailHtml(influencerName, brandName, brandEmail);

  await transporter.sendMail({
    from: process.env.SMTP_FROM || '"InflueMatch" <no-reply@influematch.com>',
    to,
    replyTo: brandEmail,
    subject: `${brandName} wants to collaborate with you on InflueMatch`,
    html,
  });
}

function getWelcomeEmailHtml(name: string) {
  const displayName = name?.trim() || "there";
  return `
  <html>
    <body style="margin:0;padding:0;background:#020617;font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="padding:32px 0;">
        <tr>
          <td align="center">
            <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#0b1120;border-radius:20px;padding:36px 32px;box-shadow:0 12px 40px rgba(59,130,246,0.15);border:1px solid #1f2937;">
              <!-- Header -->
              <tr>
                <td style="padding-bottom:24px;">
                  <table cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="width:36px;height:36px;border-radius:10px;background:linear-gradient(135deg,#1e3a8a,#3b82f6);text-align:center;vertical-align:middle;">
                        <span style="font-size:16px;font-weight:800;color:#ffffff;">IM</span>
                      </td>
                      <td style="padding-left:10px;font-size:18px;font-weight:800;color:#e5e7eb;">InflueMatch</td>
                    </tr>
                  </table>
                  <div style="font-size:11px;font-weight:600;letter-spacing:0.16em;color:#3b82f6;text-transform:uppercase;margin-top:8px;">Welcome aboard</div>
                </td>
              </tr>
              <!-- Title -->
              <tr>
                <td style="font-size:22px;font-weight:800;color:#e5e7eb;padding-bottom:12px;">
                  Welcome, ${displayName}! 🚀
                </td>
              </tr>
              <!-- Body -->
              <tr>
                <td style="font-size:15px;color:#9ca3af;line-height:1.65;padding-bottom:16px;">
                  Thank you for joining <strong style="color:#3b82f6;">InflueMatch</strong>. We're excited to have you on the platform.
                </td>
              </tr>
              <tr>
                <td style="font-size:15px;color:#9ca3af;line-height:1.65;padding-bottom:24px;">
                  InflueMatch connects creators and brands so you can discover partnerships, manage collaborations, and grow together — all in one place.
                </td>
              </tr>
              <!-- CTA box -->
              <tr>
                <td style="background:linear-gradient(135deg,#1e3a8a,#1d4ed8);border-radius:14px;padding:18px 20px;margin-bottom:24px;">
                  <p style="font-size:14px;color:#bfdbfe;line-height:1.6;margin:0;">
                    If you have questions, just reply to this email or visit your dashboard to get started.
                  </p>
                </td>
              </tr>
              <!-- Sign off -->
              <tr>
                <td style="font-size:14px;font-weight:600;color:#60a5fa;padding-top:20px;">
                  — Team InflueMatch
                </td>
              </tr>
              <!-- Footer -->
              <tr>
                <td style="font-size:11px;color:#4b5563;border-top:1px solid #1f2937;padding-top:20px;margin-top:16px;">
                  © ${new Date().getFullYear()} InflueMatch. All rights reserved.
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>`;
}

function getResetOtpEmailHtml(otp: string) {
  return `
  <html>
    <body style="margin:0;padding:0;background:#020617;font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="padding:32px 0;">
        <tr>
          <td align="center">
            <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#0b1120;border-radius:24px;padding:32px;box-shadow:0 18px 45px rgba(59,130,246,0.15);border:1px solid #1f2937;">
              <!-- Header -->
              <tr>
                <td align="left" style="padding-bottom:24px;">
                  <table cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="width:36px;height:36px;border-radius:10px;background:linear-gradient(135deg,#1e3a8a,#3b82f6);text-align:center;vertical-align:middle;">
                        <span style="font-size:15px;font-weight:800;color:#ffffff;">IM</span>
                      </td>
                      <td style="padding-left:10px;font-size:18px;font-weight:800;color:#e5e7eb;">InflueMatch</td>
                    </tr>
                  </table>
                  <div style="font-size:11px;font-weight:600;letter-spacing:0.16em;color:#3b82f6;text-transform:uppercase;margin-top:8px;">Password Reset</div>
                </td>
              </tr>
              <!-- Title -->
              <tr>
                <td style="font-size:16px;color:#e5e7eb;font-weight:600;padding-bottom:8px;">
                  Reset your password
                </td>
              </tr>
              <!-- Body -->
              <tr>
                <td style="font-size:14px;color:#9ca3af;line-height:1.6;padding-bottom:24px;">
                  We received a request to reset your InflueMatch password.
                  Use the verification code below within the next <strong style="color:#e5e7eb;">10 minutes</strong>.
                </td>
              </tr>
              <!-- OTP boxes -->
              <tr>
                <td align="center" style="padding-bottom:24px;">
                  <table cellpadding="0" cellspacing="0">
                    <tr>
                      ${otp
                        .split("")
                        .map(
                          (d) => `
                      <td style="width:52px;height:56px;border-radius:14px;border:1px solid #1f2937;background:#020617;font-size:22px;font-weight:800;color:#3b82f6;text-align:center;vertical-align:middle;letter-spacing:0.1em;padding:0 6px;">
                        ${d}
                      </td>`
                        )
                        .join('<td style="width:8px;"></td>')}
                    </tr>
                  </table>
                </td>
              </tr>
              <!-- Disclaimer -->
              <tr>
                <td style="font-size:12px;color:#4b5563;padding-bottom:16px;">
                  If you didn't request this, you can safely ignore this email — your password will not change.
                </td>
              </tr>
              <!-- Footer -->
              <tr>
                <td style="font-size:11px;color:#4b5563;border-top:1px solid #1f2937;padding-top:16px;">
                  © ${new Date().getFullYear()} InflueMatch. All rights reserved.
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>`;
}

function getCollaborationEmailHtml(
  influencerName: string,
  brandName: string,
  brandEmail: string
) {
  return `
  <html>
    <body style="margin:0;padding:0;background:#020617;font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="padding:32px 0;">
        <tr>
          <td align="center">
            <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#0b1120;border-radius:24px;padding:32px;box-shadow:0 18px 45px rgba(59,130,246,0.15);border:1px solid #1f2937;">
              <!-- Header -->
              <tr>
                <td align="left" style="padding-bottom:24px;">
                  <table cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="width:36px;height:36px;border-radius:10px;background:linear-gradient(135deg,#1e3a8a,#3b82f6);text-align:center;vertical-align:middle;">
                        <span style="font-size:15px;font-weight:800;color:#ffffff;">IM</span>
                      </td>
                      <td style="padding-left:10px;font-size:18px;font-weight:800;color:#e5e7eb;">InflueMatch</td>
                    </tr>
                  </table>
                  <div style="font-size:11px;font-weight:600;letter-spacing:0.16em;color:#3b82f6;text-transform:uppercase;margin-top:8px;">Collaboration Opportunity</div>
                </td>
              </tr>
              <!-- Greeting -->
              <tr>
                <td style="font-size:18px;color:#e5e7eb;font-weight:700;padding-bottom:8px;">
                  Hello ${influencerName || "there"}! 👋
                </td>
              </tr>
              <!-- Body -->
              <tr>
                <td style="font-size:14px;color:#9ca3af;line-height:1.6;padding-bottom:16px;">
                  Great news! <strong style="color:#3b82f6;">${brandName}</strong> has viewed your profile on InflueMatch and is interested in collaborating with you.
                </td>
              </tr>
              <tr>
                <td style="font-size:14px;color:#9ca3af;line-height:1.6;padding-bottom:24px;">
                  They loved what they saw and would like to explore a potential partnership. This could be an exciting opportunity to work together!
                </td>
              </tr>
              <!-- CTA box -->
              <tr>
                <td style="background:linear-gradient(135deg,#1e3a8a,#1d4ed8);border-radius:14px;padding:20px;margin-bottom:24px;">
                  <p style="font-size:14px;color:#bfdbfe;font-weight:600;margin:0 0 8px 0;">
                    💌 Next Steps:
                  </p>
                  <p style="font-size:14px;color:#93c5fd;line-height:1.6;margin:0;">
                    Please reply directly to this email at <strong style="color:#ffffff;">${brandEmail}</strong> to start the conversation. They're waiting to hear from you!
                  </p>
                </td>
              </tr>
              <!-- Disclaimer -->
              <tr>
                <td style="font-size:12px;color:#4b5563;padding-bottom:16px;">
                  This email was sent through InflueMatch. You can manage your collaboration preferences in your dashboard.
                </td>
              </tr>
              <!-- Footer -->
              <tr>
                <td style="font-size:11px;color:#4b5563;border-top:1px solid #1f2937;padding-top:16px;">
                  © ${new Date().getFullYear()} InflueMatch. All rights reserved.
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>`;
}


