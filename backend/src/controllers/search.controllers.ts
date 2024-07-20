import { Request, Response } from 'express';
import { 
    searchUsers, 
    searchEvents, 
    searchBookings, 
    searchCategories, 
    searchTags, 
    searchTickets 
} from '../services/search.services';

export const searchForUsers = async (req: Request, res: Response) => {
  try {
    const { query } = req.query;

    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: 'Invalid search query' });
    }

    const users = await searchUsers(query);
    res.status(200).json(users);
  } catch (error) {
    const err = error as Error;
    res.status(400).json({ error: err.message });
  }
};

export const searchForEvents = async (req: Request, res: Response) => {
  try {
    const { query } = req.query;

    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: 'Invalid search query' });
    }

    const events = await searchEvents(query);
    res.status(200).json(events);
  } catch (error) {
    const err = error as Error;
    res.status(400).json({ error: err.message });
  }
};

export const searchForBookings = async (req: Request, res: Response) => {
  try {
    const { query } = req.query;

    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: 'Invalid search query' });
    }

    const bookings = await searchBookings(query);
    res.status(200).json(bookings);
  } catch (error) {
    const err = error as Error;
    res.status(400).json({ error: err.message });
  }
};

export const searchForCategories = async (req: Request, res: Response) => {
  try {
    const { query } = req.query;

    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: 'Invalid search query' });
    }

    const categories = await searchCategories(query);
    res.status(200).json(categories);
  } catch (error) {
    const err = error as Error;
    res.status(400).json({ error: err.message });
  }
};

export const searchForTags = async (req: Request, res: Response) => {
  try {
    const { query } = req.query;

    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: 'Invalid search query' });
    }

    const tags = await searchTags(query);
    res.status(200).json(tags);
  } catch (error) {
    const err = error as Error;
    res.status(400).json({ error: err.message });
  }
};

export const searchForTickets = async (req: Request, res: Response) => {
  try {
    const { query } = req.query;

    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: 'Invalid search query' });
    }

    const tickets = await searchTickets(query);
    res.status(200).json(tickets);
  } catch (error) {
    const err = error as Error;
    res.status(400).json({ error: err.message });
  }
};
