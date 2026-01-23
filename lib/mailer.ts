import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendResetOtpEmail(to: string, otp: string) {
  const html = getResetOtpEmailHtml(otp);

  await transporter.sendMail({
    from: process.env.SMTP_FROM || '"InflueMatch" <no-reply@influematch.com>',
    to,
    subject: "Your InflueMatch password reset code",
    html,
  });
}

function getResetOtpEmailHtml(otp: string) {
  return `
  <html>
    <body style="margin:0;padding:0;background:#f8f9fd;font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="padding:32px 0;">
        <tr>
          <td align="center">
            <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#ffffff;border-radius:24px;padding:32px;box-shadow:0 18px 45px rgba(88,28,135,0.12);border:1px solid #f3e8ff;">
              <tr>
                <td align="left" style="padding-bottom:24px;">
                  <div style="display:inline-flex;align-items:center;gap:10px;margin-bottom:8px;">
                    <div style="width:32px;height:32px;border-radius:12px;background:linear-gradient(135deg,#7c3aed,#4f46e5);display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;font-size:16px;">IM</div>
                    <span style="font-size:20px;font-weight:800;color:#111827;">InflueMatch</span>
                  </div>
                  <div style="font-size:12px;font-weight:600;letter-spacing:.16em;color:#a855f7;text-transform:uppercase;">
                    Password Reset
                  </div>
                </td>
              </tr>
              <tr>
                <td style="font-size:16px;color:#111827;font-weight:600;padding-bottom:8px;">
                  Reset your password
                </td>
              </tr>
              <tr>
                <td style="font-size:14px;color:#4b5563;line-height:1.6;padding-bottom:24px;">
                  We received a request to reset your InflueMatch password. 
                  Use the verification code below within the next <strong>10 minutes</strong>.
                </td>
              </tr>
              <tr>
                <td align="center" style="padding-bottom:24px;">
                  <div style="display:inline-flex;gap:8px;">
                    ${otp
                      .split("")
                      .map(
                        (d) => `
                      <div style="width:52px;height:56px;border-radius:18px;border:1px solid #e5e7eb;background:#f9fafb;font-size:22px;font-weight:800;color:#111827;display:flex;align-items:center;justify-content:center;letter-spacing:.1em;">
                        ${d}
                      </div>`
                      )
                      .join("")}
                  </div>
                </td>
              </tr>
              <tr>
                <td style="font-size:12px;color:#6b7280;padding-bottom:16px;">
                  If you didn’t request this, you can safely ignore this email — your password will not change.
                </td>
              </tr>
              <tr>
                <td style="font-size:11px;color:#9ca3af;border-top:1px solid #f3f4f6;padding-top:16px;">
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


