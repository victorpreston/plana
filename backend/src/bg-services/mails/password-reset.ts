import sendMail from '../email.service';
import { EmailOptions } from '../interfaces/email.interface';

export const sendPasswordResetEmail = async (email: string, resetCode: string): Promise<void> => {
  const emailOptions: EmailOptions = {
    email,
    subject: 'Password Reset Request',
    template: 'password-reset',
    body: { resetCode },
  };

  await sendMail(emailOptions);
};