import { Request, Response } from 'express';
import { createEvent, updateEvent, getAllEvents, getEventById, deleteEvent } from '../services/event.services';

// Create a new event
export const create = async (req: Request, res: Response) => {
  try {
    const eventData = req.body;
    const event = await createEvent(eventData);
    res.status(201).json(event);
  } catch (error) {
    const err = error as Error;
    res.status(400).json({ error: err.message });
  }
};

// Update an event
export const update = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const eventData = req.body;
    const event = await updateEvent(id, eventData);
    res.status(200).json(event);
  } catch (error) {
    const err = error as Error;
    res.status(400).json({ error: err.message });
  }
};

// Get all events
export const getAll = async (req: Request, res: Response) => {
  try {
    const events = await getAllEvents();
    res.status(200).json(events);
  } catch (error) {
    const err = error as Error;
    res.status(400).json({ error: err.message });
  }
};

// Get an event by ID
export const getById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const event = await getEventById(id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.status(200).json(event);
  } catch (error) {
    const err = error as Error;
    res.status(400).json({ error: err.message });
  }
};

// Delete an event (soft delete)
export const remove = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const event = await getEventById(id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    await deleteEvent(id);
    res.status(204).send();
  } catch (error) {
    const err = error as Error;
    res.status(400).json({ error: err.message });
  }
};