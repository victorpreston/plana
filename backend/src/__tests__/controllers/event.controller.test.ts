import request from 'supertest';
import express, { Application } from 'express';
import bodyParser from 'body-parser';
import {
  create,
  update,
  getAll,
  getById,
  remove
} from '../../controllers/event.controllers';
import {
  createEvent,
  updateEvent,
  getAllEvents,
  getEventById,
  deleteEvent
} from '../../services/event.services';

jest.mock('../../services/event.services');

const app: Application = express();
app.use(bodyParser.json());

app.post('/events', create);
app.put('/events/:id', update);
app.get('/events', getAll);
app.get('/events/:id', getById);
app.delete('/events/:id', remove);

describe('Event Controllers', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new event', async () => {
      const mockEvent = { 
        id: 'event-1', 
        name: 'Test Event' 
      };
      (createEvent as jest.Mock)
      .mockResolvedValue(mockEvent);

      const response = await request(app)
        .post('/events')
        .send({ name: 'Test Event' });

      expect(response.status).toBe(201);
      expect(response.body).toEqual(mockEvent);
      expect(createEvent)
      .toHaveBeenCalledWith({ name: 'Test Event' });
    });

    it('should return 400 if there is an error', async () => {
      (createEvent as jest.Mock)
      .mockRejectedValue(new Error('Create event error'));

      const response = await request(app)
        .post('/events')
        .send({ name: 'Test Event' });

      expect(response.status).toBe(400);
      expect(response.body.error)
      .toBe('Create event error');
    });
  });

  describe('update', () => {
    it('should update an event', async () => {
      const mockEvent = { 
        id: 'event-1', 
        name: 'Updated Event' 
      };
      (updateEvent as jest.Mock)
      .mockResolvedValue(mockEvent);

      const response = await request(app)
        .put('/events/event-1')
        .send({ name: 'Updated Event' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockEvent);
      expect(updateEvent)
      .toHaveBeenCalledWith('event-1', { name: 'Updated Event' });
    });

    it('should return 400 if there is an error', async () => {
      (updateEvent as jest.Mock)
      .mockRejectedValue(new Error('Update event error'));

      const response = await request(app)
        .put('/events/event-1')
        .send({ name: 'Updated Event' });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Update event error');
    });
  });

  describe('getAll', () => {
    it('should get all events', async () => {
      const mockEvents = [
        { 
          id: 'event-1', 
          name: 'Event 1' 
        },
        { 
          id: 'event-2', 
          name: 'Event 2' 
        }
      ];
      (getAllEvents as jest.Mock)
      .mockResolvedValue(mockEvents);

      const response = await request(app)
        .get('/events');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockEvents);
      expect(getAllEvents).toHaveBeenCalled();
    });

    it('should return 400 if there is an error', async () => {
      (getAllEvents as jest.Mock)
      .mockRejectedValue(new Error('Get all events error'));

      const response = await request(app)
        .get('/events');

      expect(response.status).toBe(400);
      expect(response.body.error)
      .toBe('Get all events error');
    });
  });

  describe('getById', () => {
    it('should get an event by ID', async () => {
      const mockEvent = { id: 'event-1', name: 'Event 1' };
      (getEventById as jest.Mock)
      .mockResolvedValue(mockEvent);

      const response = await request(app)
        .get('/events/event-1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockEvent);
      expect(getEventById)
      .toHaveBeenCalledWith('event-1');
    });

    it('should return 404 if event is not found', async () => {
      (getEventById as jest.Mock)
      .mockResolvedValue(null);

      const response = await request(app)
        .get('/events/event-1');

      expect(response.status).toBe(404);
      expect(response.body.error)
      .toBe('Event not found');
    });

    it('should return 400 if there is an error', async () => {
      (getEventById as jest.Mock)
      .mockRejectedValue(new Error('Get event error'));

      const response = await request(app)
        .get('/events/event-1');

      expect(response.status).toBe(400);
      expect(response.body.error)
      .toBe('Get event error');
    });
  });

  describe('remove', () => {
    it('should delete an event', async () => {
      const mockEvent = { id: 'event-1', name: 'Event 1' };
      (getEventById as jest.Mock)
      .mockResolvedValue(mockEvent);
      (deleteEvent as jest.Mock)
      .mockResolvedValue(undefined);

      const response = await request(app)
        .delete('/events/event-1');

      expect(response.status).toBe(204);
      expect(getEventById)
      .toHaveBeenCalledWith('event-1');
      expect(deleteEvent)
      .toHaveBeenCalledWith('event-1');
    });

    it('should return 404 if event is not found', async () => {
      (getEventById as jest.Mock)
      .mockResolvedValue(null);

      const response = await request(app)
        .delete('/events/event-1');

      expect(response.status).toBe(404);
      expect(response.body.error)
      .toBe('Event not found');
    });

    it('should return 400 if there is an error', async () => {
      (getEventById as jest.Mock)
      .mockRejectedValue(new Error('Delete event error'));

      const response = await request(app)
        .delete('/events/event-1');

      expect(response.status).toBe(400);
      expect(response.body.error)
      .toBe('Delete event error');
    });
  });
});