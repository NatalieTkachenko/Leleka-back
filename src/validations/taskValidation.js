import { Joi, Segments } from 'celebrate';

export const taskValidationSchema = {
  [Segments.BODY]: Joi.object({
    name: Joi.string().min(1).max(96).required(),
    date: Joi.string()

      .pattern(/^\d{4}-\d{2}-\d{2}$/)
      .required(),
  }).unknown(true),
};

export const taskStatusUpdateValidationSchema = {
  [Segments.BODY]: Joi.object({
    isDone: Joi.boolean().required(),
  }).unknown(false),
};
