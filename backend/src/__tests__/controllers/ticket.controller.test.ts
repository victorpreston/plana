import request from 'supertest';
import express, { Application } from 'express';
import bodyParser from 'body-parser';
import { create, update, getByEventId, remove } from '../../controllers/ticket.controllers';
import { 
  createTicketType, 
  updateTicketType, 
  getTicketTypesByEventId, 
  deleteTicketType 
} from '../../services/ticket.services';

jest.mock('../../services/ticket.services');

const app: Application = express();
app.use(bodyParser.json());
app.post('/tickets', create);
app.put('/tickets/:id', update);
app.get('/tickets/event/:eventId', getByEventId);
app.delete('/tickets/:id', remove);

describe('Ticket Controllers', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new ticket type', async () => {
      const mockTicketType = { id: 'ticket-1', name: 'VIP', price: 100 };
      (createTicketType as jest.Mock).mockResolvedValue(mockTicketType);

      const response = await request(app)
        .post('/tickets')
        .send({ name: 'VIP', price: 100 });

      expect(response.status).toBe(201);
      expect(response.body).toEqual(mockTicketType);
      expect(createTicketType).toHaveBeenCalledWith({ name: 'VIP', price: 100 });
    });

    it('should return 400 if there is an error', async () => {
      (createTicketType as jest.Mock).mockRejectedValue(new Error('Failed to create ticket type'));

      const response = await request(app)
        .post('/tickets')
        .send({ name: 'VIP', price: 100 });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Failed to create ticket type');
    });
  });

  describe('update', () => {
    it('should update a ticket type', async () => {
      const mockTicketType = { id: 'ticket-1', name: 'VIP', price: 150 };
      (updateTicketType as jest.Mock).mockResolvedValue(mockTicketType);

      const response = await request(app)
        .put('/tickets/ticket-1')
        .send({ name: 'VIP', price: 150 });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockTicketType);
      expect(updateTicketType).toHaveBeenCalledWith('ticket-1', { name: 'VIP', price: 150 });
    });

    it('should return 400 if there is an error', async () => {
      (updateTicketType as jest.Mock).mockRejectedValue(new Error('Failed to update ticket type'));

      const response = await request(app)
        .put('/tickets/ticket-1')
        .send({ name: 'VIP', price: 150 });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Failed to update ticket type');
    });
  });

  describe('getByEventId', () => {
    it('should get all ticket types for an event', async () => {
      const mockTicketTypes = [{ id: 'ticket-1', name: 'VIP', price: 100 }];
      (getTicketTypesByEventId as jest.Mock).mockResolvedValue(mockTicketTypes);

      const response = await request(app).get('/tickets/event/event-1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockTicketTypes);
      expect(getTicketTypesByEventId).toHaveBeenCalledWith('event-1');
    });

    it('should return 400 if there is an error', async () => {
      (getTicketTypesByEventId as jest.Mock).mockRejectedValue(new Error('Failed to get ticket types'));

      const response = await request(app).get('/tickets/event/event-1');

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Failed to get ticket types');
    });
  });

  describe('remove', () => {
    it('should delete a ticket type', async () => {
      (deleteTicketType as jest.Mock).mockResolvedValue(undefined);

      const response = await request(app).delete('/tickets/ticket-1');

      expect(response.status).toBe(204);
      expect(deleteTicketType).toHaveBeenCalledWith('ticket-1');
    });

    it('should return 400 if there is an error', async () => {
      (deleteTicketType as jest.Mock).mockRejectedValue(new Error('Failed to delete ticket type'));

      const response = await request(app).delete('/tickets/ticket-1');

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Failed to delete ticket type');
    });
  });
});