import { Request, Response, NextFunction } from 'express';

/**
 * Validates the request body for creating a tag.
 * 
 * @param req - The request object.
 * @param res - The response object.
 * @param next - The next function.
 */
export const validateCreateTag = (req: Request, res: Response, next: NextFunction) => {
  const { name } = req.body;
  
  if (!name || typeof name !== 'string' || name.trim() === '') {
    return res.status(400).json({ error: 'Invalid or missing tag name' });
  }

  next();
};

export const validateUpdateTag = (req: Request, res: Response, next: NextFunction) => {
  const { name } = req.body;

  if (!name || typeof name !== 'string' || name.trim() === '') {
    return res.status(400).json({ error: 'Invalid or missing tag name' });
  }

  next();
};