import nodemailer, { Transporter } from 'nodemailer';
import ejs from 'ejs';
import path from 'path';
import { EmailOptions } from './interfaces/email.interface';
import { env } from '../config/env.config';
import logger from '../config/logger.config';

const sendMail = async (options: EmailOptions, retries: number = 3): Promise<void> => {
  try {
    logger.info('Creating transport...');
    const transporter: Transporter = nodemailer.createTransport({
      host: env.emailHost,
      port: env.emailPort,
      secure: env.emailPort === 465,
      auth: {
        user: env.emailUser,
        pass: env.emailPass,
      },
      tls: {
        rejectUnauthorized: false,
      },
      socketTimeout: 30000,
      connectionTimeout: 30000,
    });

    logger.info('Transport created successfully');

    const { email, subject, template, body, attachments } = options;
    logger.info('Rendering email template...');
    const templatePath = path.join(__dirname, 'templates', `${template}.ejs`);
    const html: string = await ejs.renderFile(templatePath, body);

    logger.info('Email template rendered successfully');

    const mailOptions = {
      from: env.emailUser,
      to: email,
      subject,
      html,
      attachments,
    };

    logger.info('Sending email to:', email);
    const result = await transporter.sendMail(mailOptions);
    logger.info('Email sent successfully:', result);
  } catch (error) {
    const err = error as Error;
    logger.error('Error sending email:', err.message || err);
    if (retries > 0) {
      logger.info(`Retrying to send email... Attempts left: ${retries}`);
      await sendMail(options, retries - 1);
    } else {
      logger.error('Failed to send email after multiple attempts.');
    }
  }
};

export default sendMail;