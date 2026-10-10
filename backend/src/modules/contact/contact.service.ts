import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ContactRequest } from './contact.controller';

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function requireEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Configuration SMTP incomplète: ${name} manquant`);
  }
  return value;
}

@Injectable()
export class ContactService {
  private transporter: nodemailer.Transporter | null = null;

  private getTransporter(): nodemailer.Transporter {
    if (this.transporter) return this.transporter;

    const host = requireEnv('SMTP_HOST');
    const port = Number.parseInt(requireEnv('SMTP_PORT'), 10);
    if (!Number.isFinite(port) || port <= 0) {
      throw new Error('SMTP_PORT doit être un entier positif');
    }
    const secureRaw = (process.env.SMTP_SECURE || '').trim().toLowerCase();
    const secure = secureRaw === 'true' || secureRaw === '1' || secureRaw === 'yes' || port === 465;

    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: {
        user: requireEnv('SMTP_USER'),
        pass: requireEnv('SMTP_PASSWORD'),
      },
    });
    return this.transporter;
  }

  async sendContactEmail(contactData: ContactRequest): Promise<void> {
    const firstName = escapeHtml(contactData.firstName || '');
    const lastName = escapeHtml(contactData.lastName || '');
    const company = contactData.company ? escapeHtml(contactData.company) : '';
    const email = escapeHtml(contactData.email || '');
    const message = escapeHtml(contactData.message || '');
    const recipients = requireEnv('EMAIL_RECIPIENTS')
      .split(',')
      .map((item) => item.trim())
      .filter((item) => item.length > 0);

    if (recipients.length === 0) {
      throw new Error('EMAIL_RECIPIENTS est vide');
    }

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 10px 10px 0 0; text-align: center;">
          <h1 style="margin: 0; font-size: 24px;">Nouvelle demande de contact</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">ManageTransport</p>
        </div>
        
        <div style="padding: 30px; background-color: #f9f9f9;">
          <h2 style="color: #333; margin-bottom: 20px; font-size: 20px;">Informations du contact :</h2>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #555; width: 120px;">Prénom :</td>
                <td style="padding: 8px 0; color: #333;">${firstName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #555;">Nom :</td>
                <td style="padding: 8px 0; color: #333;">${lastName}</td>
              </tr>
              ${
                company
                  ? `
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #555;">Entreprise :</td>
                <td style="padding: 8px 0; color: #333;">${company}</td>
              </tr>
              `
                  : ''
              }
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #555;">Email :</td>
                <td style="padding: 8px 0; color: #333;"><a href="mailto:${email}" style="color: #667eea; text-decoration: none;">${email}</a></td>
              </tr>
            </table>
          </div>
          
          <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h3 style="margin: 0 0 15px 0; color: #555; font-size: 16px;">Message :</h3>
            <div style="background: #f8f9fa; padding: 15px; border-radius: 6px; border-left: 4px solid #667eea;">
              <p style="margin: 0; line-height: 1.6; color: #333;">${message}</p>
            </div>
          </div>
        </div>
        
        <div style="background: #f1f1f1; padding: 20px; border-radius: 0 0 10px 10px; text-align: center;">
          <p style="margin: 0; color: #666; font-size: 14px;">
            Email reçu le ${new Date().toLocaleDateString('fr-FR', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>
      </div>
    `;

    await this.getTransporter().sendMail({
      from: requireEnv('SMTP_FROM'),
      to: recipients,
      subject: `Nouvelle demande de contact - ${contactData.firstName || ''} ${contactData.lastName || ''}`.trim(),
      html: htmlContent,
      replyTo: contactData.email,
    });
  }
}
