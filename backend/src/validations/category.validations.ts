import { Request, Response, NextFunction } from 'express';

/**
 * Validates the request body for creating a category.
 * 
 * @param req - The request object.
 * @param res - The response object.
 * @param next - The next function to call.
 */
export const validateCreateCategory = (req: Request, res: Response, next: NextFunction) => {
  const { name } = req.body;
  
  if (!name || typeof name !== 'string' || name.trim() === '') {
    return res.status(400).json({ error: 'Invalid or missing category name' });
  }

  next();
};

export const validateUpdateCategory = (req: Request, res: Response, next: NextFunction) => {
  const { name } = req.body;

  if (!name || typeof name !== 'string' || name.trim() === '') {
    return res.status(400).json({ error: 'Invalid or missing category name' });
  }

  next();
};