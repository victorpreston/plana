import sendMail from '../email.service';
import { EmailOptions } from '../interfaces/email.interface';
import { User } from '../../interfaces/user.interfaces';
import logger from '../../config/logger.config';

/**
 * Function to send welcome email
 * @param user 
 */
export const sendWelcomeEmail = async (user: User) => {
  const emailOptions: EmailOptions = {
    email: user.email,
    subject: 'Welcome to Plana',
    template: 'welcome',
    body: {
      user: {
        firstName: user.profile?.firstName,
        lastName: user.profile?.lastName,
      },
    },
  };

  try {
    await sendMail(emailOptions);
  } catch (error) {
    const err = error as Error;
    logger.error('Failed to send welcome email:', err.message || err);
  }
};