import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';
import { TypedConfigService } from 'src/config/typed-config.service';

@Injectable()
export class EmailService {
  private resend: Resend;

  constructor(private readonly typedConfigService: TypedConfigService) {
    this.resend = new Resend(typedConfigService.get('RESEND_API_KEY'));
  }

  async sendPasswordResetEmail(email: string, token: string) {
    const appUrl = this.typedConfigService.get('APP_URL');
    const resetUrl = `${appUrl}/reset-password?token=${token}`;

    await this.resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: 'Reset your password',
      html: `
        <h2>Password Reset Request</h2>
        <p>Click the link below to reset your password. This link expires in 1 hour.</p>
        <a href="${resetUrl}">Reset Password</a>
        <p>If you didn't request a password reset, you can safely ignore this email.</p> `,
    });
  }
}
