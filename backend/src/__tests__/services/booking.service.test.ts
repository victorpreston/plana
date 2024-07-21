import {
  createBooking, 
  getRecentBookings, 
  cancelBooking, 
  updateBooking, 
  getBookingById, 
  getBookingsForEvent, 
  verifyTicketCode
} from '../../services/booking.services';
import { Booking } from '../../interfaces/booking.interfaces';
import { sendBookingConfirmationEmail } from '../../bg-services/mails/booking';
import { sendTicketVerificationEmail } from '../../bg-services/mails/ticket-verified';
import { getBookingDetails } from '../../bg-services/booking.helper';

jest.mock('../../config/database.config', () => ({
  __esModule: true,
  default: {
    booking: {
      create: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      findUnique: jest.fn(),
    },
    ticketType: {
      findUnique: jest.fn(),
    },
  },
}));
jest.mock('../../bg-services/mails/booking');
jest.mock('../../bg-services/mails/ticket-verified');
jest.mock('../../bg-services/booking.helper');

const prisma = require('../../config/database.config').default;

describe('Booking Services', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createBooking', () => {
    it('should create a new booking', async () => {
      const mockTicketType = { id: 'ticket-1', price: 100, quantity: 50 };
      const mockBooking = {
        id: 'booking-1',
        userId: 'user-1',
        eventId: 'event-1',
        ticketTypeId: 'ticket-1',
        tickets: 2,
        status: 'confirmed',
        ticketCode: 'ABC1234567',
        totalPrice: 200,
        user: { id: 'user-1', email: 'user@example.com', role: 'USER', createdAt: new Date(), updatedAt: new Date(), isDeleted: false },
        event: {
          id: 'event-1',
          title: 'Test Event',
          description: 'Test Description',
          date: new Date(),
          time: new Date(),
          location: 'Test Location',
          bannerImage: 'http://example.com/image.png',
          managerId: 'manager-1',
          categoryId: 'category-1',
          ticketTypes: [],
          bookings: [],
          manager: { id: 'manager-1', email: 'manager@example.com', role: 'MANAGER', createdAt: new Date(), updatedAt: new Date(), isDeleted: false },
          category: { id: 'category-1', name: 'Test Category', createdAt: new Date(), updatedAt: new Date(), isDeleted: false },
          tags: [],
          createdAt: new Date(),
          updatedAt: new Date(),
          isDeleted: false,
        },
        ticketType: { id: 'ticket-1', eventId: 'event-1', type: 'VIP', price: 100, quantity: 50, createdAt: new Date(), updatedAt: new Date(), isDeleted: false },
        createdAt: new Date(),
        updatedAt: new Date(),
        isDeleted: false,
      };

      (prisma.ticketType.findUnique as jest.Mock).mockResolvedValue(mockTicketType);
      (prisma.booking.create as jest.Mock).mockResolvedValue(mockBooking);
      (getBookingDetails as jest.Mock).mockResolvedValue(mockBooking);
      (sendBookingConfirmationEmail as jest.Mock).mockResolvedValue(Promise.resolve());

      const result = await createBooking({
        userId: 'user-1',
        eventId: 'event-1',
        ticketTypeId: 'ticket-1',
        tickets: 2,
      });

      expect(prisma.ticketType.findUnique).toHaveBeenCalledWith({ where: { id: 'ticket-1' } });
      expect(prisma.booking.create).toHaveBeenCalledWith({
        data: {
          userId: 'user-1',
          eventId: 'event-1',
          ticketTypeId: 'ticket-1',
          tickets: 2,
          status: 'confirmed',
          ticketCode: expect.any(String),
          totalPrice: 200,
        },
        include: {
          user: true,
          event: {
            include: {
              ticketTypes: true,
              bookings: true,
              manager: true,
              category: true,
              tags: {
                include: {
                  tag: true,
                },
              },
            },
          },
          ticketType: true,
        },
      });
      expect(sendBookingConfirmationEmail).toHaveBeenCalledWith(mockBooking);
      expect(result).toEqual(mockBooking);
    });
  });

  describe('verifyTicketCode', () => {
    it('should verify a ticket code and send verification email', async () => {
      const mockBooking = {
        id: 'booking-1',
        userId: 'user-1',
        eventId: 'event-1',
        ticketTypeId: 'ticket-1',
        tickets: 2,
        status: 'confirmed',
        ticketCode: 'ABC1234567',
        totalPrice: 200,
        user: { id: 'user-1', email: 'user@example.com', role: 'USER', createdAt: new Date(), updatedAt: new Date(), isDeleted: false },
        event: {
          id: 'event-1',
          title: 'Test Event',
          description: 'Test Description',
          date: new Date(),
          time: new Date(),
          location: 'Test Location',
          bannerImage: 'http://example.com/image.png',
          managerId: 'manager-1',
          categoryId: 'category-1',
          ticketTypes: [],
          bookings: [],
          manager: { id: 'manager-1', email: 'manager@example.com', role: 'MANAGER', createdAt: new Date(), updatedAt: new Date(), isDeleted: false },
          category: { id: 'category-1', name: 'Test Category', createdAt: new Date(), updatedAt: new Date(), isDeleted: false },
          tags: [],
          createdAt: new Date(),
          updatedAt: new Date(),
          isDeleted: false,
        },
        ticketType: { id: 'ticket-1', eventId: 'event-1', type: 'VIP', price: 100, quantity: 50, createdAt: new Date(), updatedAt: new Date(), isDeleted: false },
        createdAt: new Date(),
        updatedAt: new Date(),
        isDeleted: false,
      };

      (prisma.booking.findUnique as jest.Mock).mockResolvedValue(mockBooking);
      (getBookingDetails as jest.Mock).mockResolvedValue(mockBooking);
      (sendTicketVerificationEmail as jest.Mock).mockResolvedValue(Promise.resolve());

      const result = await verifyTicketCode('ABC1234567');

      expect(prisma.booking.findUnique).toHaveBeenCalledWith({
        where: { ticketCode: 'ABC1234567' },
        include: {
          user: true,
          event: {
            include: {
              ticketTypes: true,
              bookings: true,
              manager: true,
              category: true,
              tags: {
                include: {
                  tag: true,
                },
              },
            },
          },
          ticketType: true,
        },
      });

      expect(sendTicketVerificationEmail).toHaveBeenCalledWith(mockBooking);
      expect(result).toEqual(mockBooking);
    });

    it('should return null if ticket code is invalid or booking is not confirmed', async () => {
      (prisma.booking.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await verifyTicketCode('INVALID_CODE');

      expect(result).toBeNull();
    });
  });
});