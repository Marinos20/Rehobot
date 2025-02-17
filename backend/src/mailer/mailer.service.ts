import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailerService {
  private async createTransporter() {
    const testAccount = await nodemailer.createTestAccount();
    const transport = nodemailer.createTransport({
      host: 'localhost',
      port: 1025,
      ignoreTLS: true,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
    return transport;
  }

  async sendSignupConfirmation(userEmail: string, confirmationUrl: string) {
    const transporter = await this.createTransporter();

    const htmlContent = `
      <html>
        <body>
          <h3>Confirmez votre inscription</h3>
          <p>Bonjour,</p>
          <p>Merci pour votre inscription! Cliquez sur le lien ci-dessous pour confirmer votre adresse email :</p>
          <a href="${confirmationUrl}">Confirmer mon inscription</a>
          <p>Ce lien expire dans une heure.</p>
        </body>
      </html>
    `;

    await transporter.sendMail({
      from: 'anicetpotter@gmail.com',
      to: userEmail,
      subject: 'Confirmation de l\'inscription',
      html: htmlContent,
    });
  }
}
