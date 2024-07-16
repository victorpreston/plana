import { Request, Response } from 'express';
import { createTag, updateTag, getAllTags, getTagById, deleteTag } from '../services/tag.services';

// Create a new tag
export const create = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    const tag = await createTag(name);
    res.status(201).json(tag);
  } catch (error) {
    const err = error as Error;
    res.status(400).json({ error: err.message });
  }
};

// Update a tag
export const update = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const tag = await updateTag(id, name);
    res.status(200).json(tag);
  } catch (error) {
    const err = error as Error;
    res.status(400).json({ error: err.message });
  }
};

// Get all tags
export const getAll = async (req: Request, res: Response) => {
  try {
    const tags = await getAllTags();
    res.status(200).json(tags);
  } catch (error) {
    const err = error as Error;
    res.status(400).json({ error: err.message });
  }
};

// Get a tag by ID
export const getById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const tag = await getTagById(id);
    if (!tag) {
      return res.status(404).json({ error: 'Tag not found' });
    }
    res.status(200).json(tag);
  } catch (error) {
    const err = error as Error;
    res.status(400).json({ error: err.message });
  }
};

// Delete a tag (soft delete)
export const remove = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await deleteTag(id);
    res.status(204).send();
  } catch (error) {
    const err = error as Error;
    res.status(400).json({ error: err.message });
  }
};