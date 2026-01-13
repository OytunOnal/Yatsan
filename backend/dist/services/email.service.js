"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const resend_1 = require("resend");
/**
 * Email service for sending password reset emails
 */
class EmailService {
    static getResendInstance() {
        if (!this.resend && process.env.RESEND_API_KEY) {
            this.resend = new resend_1.Resend(process.env.RESEND_API_KEY);
        }
        return this.resend;
    }
    /**
     * Sends an email confirmation email with the verification link
     * @param email - Recipient email address
     * @param verificationLink - Email verification link containing the token
     */
    static async sendEmailConfirmationEmail(email, verificationLink) {
        const resend = this.getResendInstance();
        if (resend) {
            try {
                await resend.emails.send({
                    from: 'Yatsan <onboarding@resend.dev>',
                    to: email,
                    subject: 'Email Doğrulama',
                    html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #333;">Email Doğrulama</h2>
              <p>Merhaba,</p>
              <p>Hesabınızı doğrulamak için aşağıdaki linke tıklayın:</p>
              <a href="${verificationLink}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Emaili Doğrula</a>
              <p>Bu link 24 saat içinde geçerliliğini yitirecektir.</p>
              <p>Eğer bu talebi siz yapmadıysanız, bu emaili görmezden gelebilirsiniz.</p>
              <br>
              <p>Saygılarımla,<br>Yatsan Ekibi</p>
            </div>
          `,
                });
                console.log(`Email confirmation sent to ${email}`);
            }
            catch (error) {
                console.error('Failed to send email:', error);
                throw new Error('Email gönderilemedi');
            }
        }
        else {
            // Fallback to console log for development
            console.log(`Email confirmation sent to ${email}`);
            console.log(`Verification link: ${verificationLink}`);
        }
    }
    /**
     * Sends a password reset email with the reset link
     * @param email - Recipient email address
     * @param resetLink - Password reset link containing the token
     */
    static async sendPasswordResetEmail(email, resetLink) {
        const resend = this.getResendInstance();
        if (resend) {
            try {
                await resend.emails.send({
                    from: 'Yatsan <onboarding@resend.dev>',
                    to: email,
                    subject: 'Şifre Sıfırlama Talebi',
                    html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #333;">Şifre Sıfırlama</h2>
              <p>Merhaba,</p>
              <p>Şifrenizi sıfırlamak için aşağıdaki linke tıklayın:</p>
              <a href="${resetLink}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Şifreyi Sıfırla</a>
              <p>Bu link 1 saat içinde geçerliliğini yitirecektir.</p>
              <p>Eğer bu talebi siz yapmadıysanız, bu emaili görmezden gelebilirsiniz.</p>
              <br>
              <p>Saygılarımla,<br>Yatsan Ekibi</p>
            </div>
          `,
                });
                console.log(`Password reset email sent to ${email}`);
            }
            catch (error) {
                console.error('Failed to send email:', error);
                throw new Error('Email gönderilemedi');
            }
        }
        else {
            // Fallback to console log for development
            console.log(`Password reset email sent to ${email}`);
            console.log(`Reset link: ${resetLink}`);
        }
    }
}
exports.EmailService = EmailService;
EmailService.resend = null;
