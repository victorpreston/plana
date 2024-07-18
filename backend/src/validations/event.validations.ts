import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

/**
 * Schema for validating event data.
 */
const eventSchema = Joi.object({
  title: Joi.string().required().messages({
    'string.empty': 'Title is required',
  }),
  description: Joi.string().required().messages({
    'string.empty': 'Description is required',
  }),
  date: Joi.date().required().messages({
    'date.base': 'Date must be a valid date',
    'any.required': 'Date is required',
  }),
  time: Joi.date().required().messages({
    'date.base': 'Time must be a valid date',
    'any.required': 'Time is required',
  }),
  location: Joi.string().required().messages({
    'string.empty': 'Location is required',
  }),
  bannerImage: Joi.string().uri().optional().messages({
    'string.uri': 'Banner image must be a valid URL',
  }),
  managerId: Joi.string().required().messages({
    'string.empty': 'Manager ID is required',
  }),
  categoryId: Joi.string().required().messages({
    'string.empty': 'Category ID is required',
  }),
  ticketTypes: Joi.array().items(
    Joi.object({
      type: Joi.string().required().messages({
        'string.empty': 'Ticket type is required',
      }),
      price: Joi.number().positive().required().messages({
        'number.base': 'Price must be a positive number',
        'any.required': 'Price is required',
      }),
      quantity: Joi.number().integer().positive().required().messages({
        'number.base': 'Quantity must be a positive integer',
        'any.required': 'Quantity is required',
      }),
    })
  ).required().messages({
    'array.base': 'Ticket types must be an array',
    'any.required': 'Ticket types are required',
  }),
  tags: Joi.array().items(
    Joi.object({
      tagId: Joi.string().required().messages({
        'string.empty': 'Tag ID is required',
      }),
    })
  ).optional(),
});

export const validateEvent = (req: Request, res: Response, next: NextFunction) => {
  const { error } = eventSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};