import { Joi, Segments } from 'celebrate';

const ONE_WEEK = 7 * 24 * 60 * 60 * 1000;
const FORTY_WEEKS = 40 * ONE_WEEK;

export const userUpdateSchema = {
  [Segments.BODY]: Joi.object({
    name: Joi.string().max(32).optional(),
    gender: Joi.string().valid('boy', 'girl', 'null').optional(),
    dueDate: Joi.string()
      .pattern(/^\d{4}-\d{2}-\d{2}$/)
      .custom((value, helpers) => {
        const inputDate = new Date(value);
        if (Number.isNaN(inputDate.getTime())) {
          return helpers.error('date.invalid');
        }

        const now = new Date();
        const minDate = new Date(now.getTime() + ONE_WEEK);
        const maxDate = new Date(now.getTime() + FORTY_WEEKS);

        if (inputDate < minDate) {
          return helpers.error('date.min');
        }

        if (inputDate > maxDate) {
          return helpers.error('date.max');
        }

        return value;
      })
      .optional(),
  })

    .min(1)
    .unknown(false),
};
