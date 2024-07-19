import { Booking } from '../../interfaces/booking.interfaces';
import sendMail from '../email.service';

export const sendTicketVerificationEmail = async (booking: Booking): Promise<void> => {
  const emailOptions = {
    email: booking.user.email,
    subject: 'Ticket Verification Successful',
    template: 'ticket-verified',
    body: {
      event: booking.event,
      booking,
    },
  };

  try {
    await sendMail(emailOptions);
  } catch (error) {
    console.error('Error sending ticket verification email:', error);
  }
};