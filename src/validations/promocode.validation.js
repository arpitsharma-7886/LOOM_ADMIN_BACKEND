import Joi from 'joi';

export const promoCodeSchema = Joi.object({
  code: Joi.string().required(),
  description: Joi.string().required(),
  discountType: Joi.string().valid('percentage', 'flat').required(),
  discountValue: Joi.number().required(),
  minimumPurchase: Joi.number().optional(),
  validFor: Joi.array().items(Joi.string()).optional(),
  isActive: Joi.boolean().optional(),
  startDate: Joi.date().optional(),
  expiryDate: Joi.date().required()
});

export const updatePromoCodeSchema = Joi.object({
  code: Joi.string().optional(),
  description: Joi.string().optional(),
  discountType: Joi.string().valid('percentage', 'flat').optional(),
  discountValue: Joi.number().optional(),
  minimumPurchase: Joi.number().optional(),
  validFor: Joi.array().items(Joi.string()).optional(),
  isActive: Joi.boolean().optional(),
  startDate: Joi.date().optional(),
  expiryDate: Joi.date().optional()
});