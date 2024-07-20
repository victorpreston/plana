import sendMail from '../email.service';

export const sendActivationEmail = async (email: string, activationCode: string) => {
  const emailOptions = {
    email,
    subject: 'Account Activation Code',
    template: 'account-activation',
    body: {
      activationCode,
    },
  };

  await sendMail(emailOptions);
};