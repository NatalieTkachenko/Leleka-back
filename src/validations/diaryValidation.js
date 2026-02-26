import { Joi, Segments } from 'celebrate';

export const NewNoteValidationSchema = {
  [Segments.BODY]: Joi.object({
    title: Joi.string().min(1).max(64).required(),
    description: Joi.string().min(1).max(1000).trim().required(),
    date: Joi.string()
      .pattern(/^\d{4}-\d{2}-\d{2}$/)
      .custom((value, helpers) => {
        const d = new Date(value);
        if (Number.isNaN(d.getTime())) return helpers.error('any.invalid');
        // додаткова перевірка: щоб не було автонормалізації типу 2026-02-40 -> березень
        const iso = d.toISOString().split('T')[0];
        if (iso !== value) return helpers.error('any.invalid');
        return value;
      })

      .default(() => {
        return new Date().toISOString().split('T')[0];
      }),
    emotions: Joi.array()
      .items(Joi.string().hex().length(24))
      .min(1)
      .max(12)
      .unique()
      .required(),
  }),
};

export const NoteUpdateValidationSchema = {
  [Segments.BODY]: Joi.object({
    title: Joi.string().min(1).max(64),
    description: Joi.string().min(1).max(1000).trim(),
    date: Joi.string()
      .pattern(/^\d{4}-\d{2}-\d{2}$/)
      .custom((value, helpers) => {
        const d = new Date(value);
        if (Number.isNaN(d.getTime())) return helpers.error('any.invalid');
        // додаткова перевірка: щоб не було автонормалізації типу 2026-02-40 -> березень
        const iso = d.toISOString().split('T')[0];
        if (iso !== value) return helpers.error('any.invalid');
        return value;
      })

      .default(() => {
        return new Date().toISOString().split('T')[0];
      }),
    emotions: Joi.array()
      .items(Joi.string().hex().length(24))
      .min(1)
      .max(12)
      .unique(),
  }).min(1),
};
