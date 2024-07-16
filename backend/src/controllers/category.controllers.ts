import { Request, Response } from 'express';
import { createCategory, updateCategory, getAllCategories, getCategoryById, deleteCategory } from '../services/category.services';

// Create a new category
export const create = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    const category = await createCategory(name);
    res.status(201).json(category);
  } catch (error) {
    const err = error as Error;
    res.status(400).json({ error: err.message });
  }
};

// Update a category
export const update = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const category = await updateCategory(id, name);
    res.status(200).json(category);
  } catch (error) {
    const err = error as Error;
    res.status(400).json({ error: err.message });
  }
};

// Get all categories
export const getAll = async (req: Request, res: Response) => {
  try {
    const categories = await getAllCategories();
    res.status(200).json(categories);
  } catch (error) {
    const err = error as Error;
    res.status(400).json({ error: err.message });
  }
};

// Get a category by ID
export const getById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const category = await getCategoryById(id);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.status(200).json(category);
  } catch (error) {
    const err = error as Error;
    res.status(400).json({ error: err.message });
  }
};

// Delete a category (soft delete)
export const remove = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await deleteCategory(id);
    res.status(204).send();
  } catch (error) {
    const err = error as Error;
    res.status(400).json({ error: err.message });
  }
};