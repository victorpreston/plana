import { Request, Response, NextFunction } from 'express';

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