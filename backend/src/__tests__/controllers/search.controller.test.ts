import request from 'supertest';
import express, { Application } from 'express';
import bodyParser from 'body-parser';
import { 
  searchForUsers, 
  searchForEvents, 
  searchForBookings, 
  searchForCategories, 
  searchForTags, 
  searchForTickets 
} from '../../controllers/search.controllers';
import { 
  searchUsers, 
  searchEvents, 
  searchBookings, 
  searchCategories, 
  searchTags, 
  searchTickets 
} from '../../services/search.services';

jest.mock('../../services/search.services');

const app: Application = express();
app.use(bodyParser.json());
app.get('/search/users', searchForUsers);
app.get('/search/events', searchForEvents);
app.get('/search/bookings', searchForBookings);
app.get('/search/categories', searchForCategories);
app.get('/search/tags', searchForTags);
app.get('/search/tickets', searchForTickets);

describe('Search Controllers', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('searchForUsers', () => {
    it('should return users matching the search query', async () => {
      const mockUsers = [{ id: 'user-1', name: 'John Doe' }];
      (searchUsers as jest.Mock).mockResolvedValue(mockUsers);

      const response = await request(app).get('/search/users').query({ query: 'John' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockUsers);
      expect(searchUsers).toHaveBeenCalledWith('John');
    });

    it('should return 400 for invalid search query', async () => {
      const response = await request(app).get('/search/users').query({ query: '' });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Invalid search query');
    });

    it('should return 400 if there is an error', async () => {
      (searchUsers as jest.Mock).mockRejectedValue(new Error('Search error'));

      const response = await request(app).get('/search/users').query({ query: 'John' });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Search error');
    });
  });

  describe('searchForEvents', () => {
    it('should return events matching the search query', async () => {
      const mockEvents = [{ id: 'event-1', title: 'Tech Conference' }];
      (searchEvents as jest.Mock).mockResolvedValue(mockEvents);

      const response = await request(app).get('/search/events').query({ query: 'Tech' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockEvents);
      expect(searchEvents).toHaveBeenCalledWith('Tech');
    });

    it('should return 400 for invalid search query', async () => {
      const response = await request(app).get('/search/events').query({ query: '' });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Invalid search query');
    });

    it('should return 400 if there is an error', async () => {
      (searchEvents as jest.Mock).mockRejectedValue(new Error('Search error'));

      const response = await request(app).get('/search/events').query({ query: 'Tech' });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Search error');
    });
  });

  describe('searchForBookings', () => {
    it('should return bookings matching the search query', async () => {
      const mockBookings = [{ id: 'booking-1', userId: 'user-1' }];
      (searchBookings as jest.Mock).mockResolvedValue(mockBookings);

      const response = await request(app).get('/search/bookings').query({ query: 'user-1' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockBookings);
      expect(searchBookings).toHaveBeenCalledWith('user-1');
    });

    it('should return 400 for invalid search query', async () => {
      const response = await request(app).get('/search/bookings').query({ query: '' });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Invalid search query');
    });

    it('should return 400 if there is an error', async () => {
      (searchBookings as jest.Mock).mockRejectedValue(new Error('Search error'));

      const response = await request(app).get('/search/bookings').query({ query: 'user-1' });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Search error');
    });
  });

  describe('searchForCategories', () => {
    it('should return categories matching the search query', async () => {
      const mockCategories = [{ id: 'category-1', name: 'Technology' }];
      (searchCategories as jest.Mock).mockResolvedValue(mockCategories);

      const response = await request(app).get('/search/categories').query({ query: 'Tech' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockCategories);
      expect(searchCategories).toHaveBeenCalledWith('Tech');
    });

    it('should return 400 for invalid search query', async () => {
      const response = await request(app).get('/search/categories').query({ query: '' });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Invalid search query');
    });

    it('should return 400 if there is an error', async () => {
      (searchCategories as jest.Mock).mockRejectedValue(new Error('Search error'));

      const response = await request(app).get('/search/categories').query({ query: 'Tech' });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Search error');
    });
  });

  describe('searchForTags', () => {
    it('should return tags matching the search query', async () => {
      const mockTags = [{ id: 'tag-1', name: 'Technology' }];
      (searchTags as jest.Mock).mockResolvedValue(mockTags);

      const response = await request(app).get('/search/tags').query({ query: 'Tech' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockTags);
      expect(searchTags).toHaveBeenCalledWith('Tech');
    });

    it('should return 400 for invalid search query', async () => {
      const response = await request(app).get('/search/tags').query({ query: '' });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Invalid search query');
    });

    it('should return 400 if there is an error', async () => {
      (searchTags as jest.Mock).mockRejectedValue(new Error('Search error'));

      const response = await request(app).get('/search/tags').query({ query: 'Tech' });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Search error');
    });
  });

  describe('searchForTickets', () => {
    it('should return tickets matching the search query', async () => {
      const mockTickets = [{ id: 'ticket-1', code: 'ABC123' }];
      (searchTickets as jest.Mock).mockResolvedValue(mockTickets);

      const response = await request(app).get('/search/tickets').query({ query: 'ABC123' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockTickets);
      expect(searchTickets).toHaveBeenCalledWith('ABC123');
    });

    it('should return 400 for invalid search query', async () => {
      const response = await request(app).get('/search/tickets').query({ query: '' });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Invalid search query');
    });

    it('should return 400 if there is an error', async () => {
      (searchTickets as jest.Mock).mockRejectedValue(new Error('Search error'));

      const response = await request(app).get('/search/tickets').query({ query: 'ABC123' });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Search error');
    });
  });
});
