const { z } = require('zod');
const { validateId } = require('../helpers');

const TITLE_LENGTH = {
  min: 3,
  max: 100,
};

const DESCRIPTION_LENGTH = {
  min: 10,
  max: 800,
};

const PRICE_INTERVAL = {
  // * Soles peruanos
  min: 50,
  max: 120,
};

const serviceSchema = z.object({
  title: z
    .string({ required_error: 'El titulo es requerido' })
    .trim()
    .min(
      TITLE_LENGTH.min,
      `El titulo debe tener mas de ${TITLE_LENGTH.min} caracteres`
    )
    .max(
      TITLE_LENGTH.max,
      `El titulo no puede tener mas de ${TITLE_LENGTH.max} caracteres`
    ),
  description: z
    .string({ required_error: 'La descripción es requerida' })
    .trim()
    .min(
      DESCRIPTION_LENGTH.min,
      `La descripción debe tener al menos ${DESCRIPTION_LENGTH.min} caracteres`
    )
    .max(
      DESCRIPTION_LENGTH.max,
      `La descripción no puede tener mas de ${DESCRIPTION_LENGTH.max} caracteres`
    ),
  price: z
    .number({
      coerce: true,
      required_error: 'Precio del servicio requerido (PEN)',
      invalid_type_error: 'El precio del servicio debe ser un numero',
    })
    .min(
      PRICE_INTERVAL.min,
      `El precio debe ser como mínimo ${PRICE_INTERVAL.min} (PEN)`
    )
    .max(
      PRICE_INTERVAL.max,
      `El precio no puede exceder de ${PRICE_INTERVAL.max} (PEN)`
    ),
  duration: z
    .number({
      coerce: true,
      invalid_type_error:
        'La duración debe ser un numero (Cantidad de minutos)',
    })
    .nonnegative('La duración debe ser un numero positivo')
    .int('La duración debe ser un numero entero (Minutos)')
    .optional(),
  _professional: z
    .string({ required_error: 'ID del profesional requerido' })
    .refine(
      async (value) => await validateId(value, 'Profesional'),
      'Profesional no encontrado'
    ),
});

module.exports = serviceSchema;
