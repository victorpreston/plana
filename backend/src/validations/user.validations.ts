import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { Role } from '../interfaces/user.interfaces';

/**
 * Schema for user registration validation.
 * 
 * @remarks
 * This schema defines the validation rules for user registration data.
 */
const registerSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.empty': 'Email is required',
    'string.email': 'Email must be a valid email address',
  }),
  password: Joi.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/).required().messages({
    'string.empty': 'Password is required',
    'string.pattern.base': 'Password must be at least 8 characters long and contain uppercase, lowercase letters, and numbers',
  }),
  firstName: Joi.string().required().messages({
    'string.empty': 'First name is required',
  }),
  lastName: Joi.string().required().messages({
    'string.empty': 'Last name is required',
  }),
  phone: Joi.string().optional().messages({
    'string.empty': 'Phone is optional',
  }),
  role: Joi.string().valid(Role.ATTENDEE, Role.MANAGER, Role.ADMIN).optional().messages({
    'any.only': 'Role must be one of ATTENDEE, MANAGER, or ADMIN',
  }),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.empty': 'Email is required',
    'string.email': 'Email must be a valid email address',
  }),
  password: Joi.string().required().messages({
    'string.empty': 'Password is required',
  }),
});

const updateRoleSchema = Joi.object({
  role: Joi.string().valid(Role.ATTENDEE, Role.MANAGER, Role.ADMIN).required().messages({
    'any.only': 'Role must be one of ATTENDEE, MANAGER, or ADMIN',
    'string.empty': 'Role is required',
  }),
});

export const validateRegister = (req: Request, res: Response, next: NextFunction) => {
  const { error } = registerSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

export const validateLogin = (req: Request, res: Response, next: NextFunction) => {
  const { error } = loginSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

export const validateUpdateRole = (req: Request, res: Response, next: NextFunction) => {
  const { error } = updateRoleSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};