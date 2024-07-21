import request from 'supertest';
import express, { Application } from 'express';
import bodyParser from 'body-parser';
import {
  create,
  getRecent,
  cancel,
  update,
  getById,
  getForEvent,
  verify
} from '../../controllers/booking.controllers';
import {
  createBooking,
  getRecentBookings,
  cancelBooking,
  updateBooking,
  getBookingById,
  getBookingsForEvent,
  verifyTicketCode
} from '../../services/booking.services';

jest.mock('../../services/booking.services');

const app: Application = express();
app.use(bodyParser.json());

app.post('/bookings', create);
app.get('/bookings/recent/:userId', getRecent);
app.delete('/bookings/:id', cancel);
app.put('/bookings/:id', update);
app.get('/bookings/:id', getById);
app.get('/bookings/event/:eventId', getForEvent);
app.get('/bookings/verify/:ticketCode', verify);

describe('Booking Controllers', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new booking', async () => {
      const mockBooking = { 
        id: 'booking-1', 
        eventId: 'event-1', 
        userId: 'user-1', 
        tickets: 2, 
        status: 'confirmed' 
      };
      (createBooking as jest.Mock).mockResolvedValue(mockBooking);

      const response = await request(app)
        .post('/bookings')
        .send({ eventId: 'event-1', userId: 'user-1', tickets: 2 });

      expect(response.status).toBe(201);
      expect(response.body).toEqual(mockBooking);
      expect(createBooking)
      .toHaveBeenCalledWith(
        { 
          eventId: 'event-1', 
          userId: 'user-1', 
          tickets: 2 
        }
      );
    });

    it('should return 400 if there is an error', async () => {
      (createBooking as jest.Mock)
      .mockRejectedValue(new Error('Create booking error'));

      const response = await request(app)
        .post('/bookings')
        .send({ eventId: 'event-1', userId: 'user-1', tickets: 2 });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Create booking error');
    });
  });

  describe('getRecent', () => {
    it('should get recent bookings for a user', async () => {
      const mockBookings = [
        { 
          id: 'booking-1', 
          eventId: 'event-1', 
          userId: 'user-1', 
          tickets: 2, 
          status: 'confirmed' 
        }
      ];
      (getRecentBookings as jest.Mock).mockResolvedValue(mockBookings);

      const response = await request(app)
        .get('/bookings/recent/user-1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockBookings);
      expect(getRecentBookings).toHaveBeenCalledWith('user-1');
    });

    it('should return 400 if there is an error', async () => {
      (getRecentBookings as jest.Mock)
      .mockRejectedValue(new Error('Get recent bookings error'));

      const response = await request(app)
        .get('/bookings/recent/user-1');

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Get recent bookings error');
    });
  });

  describe('cancel', () => {
    it('should cancel a booking', async () => {
      (cancelBooking as jest.Mock).mockResolvedValue(undefined);

      const response = await request(app)
        .delete('/bookings/booking-1');

      expect(response.status).toBe(204);
      expect(cancelBooking).toHaveBeenCalledWith('booking-1');
    });

    it('should return 400 if there is an error', async () => {
      (cancelBooking as jest.Mock)
      .mockRejectedValue(new Error('Cancel booking error'));

      const response = await request(app)
        .delete('/bookings/booking-1');

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Cancel booking error');
    });
  });

  describe('update', () => {
    it('should update a booking', async () => {
      const mockBooking = { 
        id: 'booking-1', 
        eventId: 'event-1', 
        userId: 'user-1', 
        tickets: 2, 
        status: 'confirmed' 
      };
      (updateBooking as jest.Mock).mockResolvedValue(mockBooking);

      const response = await request(app)
        .put('/bookings/booking-1')
        .send({ tickets: 3 });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockBooking);
      expect(updateBooking).toHaveBeenCalledWith('booking-1', { tickets: 3 });
    });

    it('should return 400 if there is an error', async () => {
      (updateBooking as jest.Mock)
      .mockRejectedValue(new Error('Update booking error'));

      const response = await request(app)
        .put('/bookings/booking-1')
        .send({ tickets: 3 });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Update booking error');
    });
  });

  describe('getById', () => {
    it('should get a booking by ID', async () => {
      const mockBooking = { 
        id: 'booking-1',
        eventId: 'event-1', 
        userId: 'user-1', 
        tickets: 2, 
        status: 'confirmed' 
      };
      (getBookingById as jest.Mock).mockResolvedValue(mockBooking);

      const response = await request(app)
        .get('/bookings/booking-1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockBooking);
      expect(getBookingById).toHaveBeenCalledWith('booking-1');
    });

    it('should return 404 if booking is not found', async () => {
      (getBookingById as jest.Mock).mockResolvedValue(null);

      const response = await request(app)
        .get('/bookings/booking-1');

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Booking not found');
    });

    it('should return 400 if there is an error', async () => {
      (getBookingById as jest.Mock).mockRejectedValue(new Error('Get booking error'));

      const response = await request(app)
        .get('/bookings/booking-1');

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Get booking error');
    });
  });

  describe('getForEvent', () => {
    it('should get bookings for an event', async () => {
      const mockBookings = [
        { 
          id: 'booking-1', 
          eventId: 'event-1', 
          userId: 'user-1', 
          tickets: 2, 
          status: 'confirmed' 
        }
      ];
      (getBookingsForEvent as jest.Mock).mockResolvedValue(mockBookings);

      const response = await request(app)
        .get('/bookings/event/event-1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockBookings);
      expect(getBookingsForEvent).toHaveBeenCalledWith('event-1');
    });

    it('should return 400 if there is an error', async () => {
      (getBookingsForEvent as jest.Mock)
      .mockRejectedValue(new Error('Get bookings for event error'));

      const response = await request(app)
        .get('/bookings/event/event-1');

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Get bookings for event error');
    });
  });

  describe('verify', () => {
    it('should verify a ticket code', async () => {
      const mockBooking = { 
        id: 'booking-1', 
        eventId: 'event-1', 
        userId: 'user-1', 
        tickets: 2, 
        status: 'confirmed' 
      };
      (verifyTicketCode as jest.Mock).mockResolvedValue(mockBooking);

      const response = await request(app)
        .get('/bookings/verify/ABC123');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockBooking);
      expect(verifyTicketCode).toHaveBeenCalledWith('ABC123');
    });

    it('should return 404 if ticket code is invalid', async () => {
      (verifyTicketCode as jest.Mock).mockResolvedValue(null);

      const response = await request(app)
        .get('/bookings/verify/ABC123');

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Invalid or expired ticket');
    });

    it('should return 400 if there is an error', async () => {
      (verifyTicketCode as jest.Mock)
      .mockRejectedValue(new Error('Verify ticket error'));

      const response = await request(app)
        .get('/bookings/verify/ABC123');

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Verify ticket error');
    });
  });
});