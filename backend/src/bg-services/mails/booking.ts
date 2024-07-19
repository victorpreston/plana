import { Booking } from '../../interfaces/booking.interfaces';
import sendMail from '../email.service';
import PDFDocument from 'pdfkit';
import path from 'path';
import fs from 'fs-extra';
import QRCode from 'qrcode';

export const sendBookingConfirmationEmail = async (booking: Booking): Promise<void> => {
  const pdfPath = await generateBookingPDF(booking);

  /*Generate QR code*/
  const qrCodeData = await QRCode.toDataURL(booking.ticketCode);

  const emailOptions = {
    email: booking.user.email,
    subject: 'Booking Confirmation',
    template: 'booking-confirmation',
    body: {
      event: booking.event,
      booking,
      qrCodeData,
    },
    attachments: [
      {
        filename: 'booking-confirmation.pdf',
        path: pdfPath,
        contentType: 'application/pdf',
      },
    ],
  };

  try {
    await sendMail(emailOptions);
    /* Clean up the generated PDF after sending the email */
    await fs.remove(pdfPath);
    await fs.remove(path.join(__dirname, '../attachments', `qrcode-${booking.id}.png`));
  } catch (error) {
    console.error('Error sending booking confirmation email:', error);
  }
};

const generateBookingPDF = async (booking: Booking): Promise<string> => {
  const doc = new PDFDocument();
  const pdfPath = path.join(__dirname, '../attachments', `booking-${booking.id}.pdf`);
  const writeStream = fs.createWriteStream(pdfPath);

  doc.pipe(writeStream);

  
  const primaryColor = '#0f3462';
  const secondaryColor = '#333';

  
  doc.rect(0, 0, doc.page.width, 100)
    .fill(primaryColor)
    .stroke();
  doc.fontSize(30)
    .fillColor('#fff')
    .text('Plana Booking Confirmation', {
      align: 'center'
    });

  
  const logoPath = path.join(__dirname, '../attachments/oig.png');
  doc.image(logoPath, doc.page.width / 2 - 25, 0, {
    width: 100,
    height: 100
  });

  doc.moveDown(4);
  doc.fontSize(22)
    .fillColor(primaryColor)
    .text('Booking Details', { align: 'center' });

  doc.moveDown();
  doc.fontSize(16)
    .fillColor(secondaryColor)
    .text(`Event: ${booking.event.title}`, { align: 'center' });

  doc.moveDown();
  doc.fontSize(16)
    .fillColor(secondaryColor)
    .text(`Date: ${booking.event.date}`, { align: 'center' });

  doc.moveDown();
  doc.fontSize(16)
    .fillColor(secondaryColor)
    .text(`Location: ${booking.event.location}`, { align: 'center' });

  doc.moveDown();
  doc.fontSize(16)
    .fillColor(secondaryColor)
    .text(`Ticket Type: ${booking.ticketType.type}`, { align: 'center' });

  doc.moveDown();
  doc.fontSize(16)
    .fillColor(secondaryColor)
    .text(`Persons: ${booking.tickets}`, { align: 'center' });

  doc.moveDown();
  doc.fontSize(16)
    .fillColor(secondaryColor)
    .text(`Total Price: $${booking.totalPrice}`, { align: 'center' });

  doc.moveDown();
  doc.fontSize(16)
    .fillColor(secondaryColor)
    .text(`Ticket Code: ${booking.ticketCode}`, { align: 'center' });

  // Generate and add QR code
  const qrCodeData = await QRCode.toDataURL(booking.ticketCode);
  const qrCodeImagePath = path.join(__dirname, '../attachments', `qrcode-${booking.id}.png`);
  await fs.writeFile(qrCodeImagePath, qrCodeData.split(",")[1], 'base64');
  doc.moveDown(2);
  doc.image(qrCodeImagePath, { align: 'center', fit: [100, 100] });

  doc.moveDown(5);
  doc.fontSize(16)
    .fillColor(secondaryColor)
    .text('Thank you for booking with Plana! We look forward to seeing you at the event.', { align: 'center' });

  doc.end();

  await new Promise((resolve, reject) => {
    writeStream.on('finish', resolve);
    writeStream.on('error', reject);
  });

  return pdfPath;
};