const { z } = require('zod');

const currentYear = new Date().getFullYear();

const experienceSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'El titulo es requerido')
    .max(50, 'No mas de 50 caracteres'),
  company: z
    .string()
    .trim()
    .min(1, 'La compañía es requerida')
    .max(25, 'No mas de 25 caracteres'),
  startDateMonth: z
    .number({
      coerce: true,
      required_error: 'Mes de inicio requerido',
      invalid_type_error: 'Debe ser un numero',
    })
    .int('Debe ser un entero')
    .refine((value) => value >= 1 && value <= 12, {
      message: 'No es un mes valido (1 a 12)',
    }),
  startDateYear: z
    .number({
      coerce: true,
      required_error: 'Año de inicio requerido',
      invalid_type_error: 'Debe ser un numero',
    })
    .int('Debe ser un numero entero')
    .min(currentYear - 100, `Mínimo: ${currentYear - 100}`)
    .max(currentYear, `Máximo: ${currentYear}`),
  endDateMonth: z
    .number({
      coerce: true,
      required_error: 'Mes de finalización requerido',
      invalid_type_error: 'Debe ser un numero',
    })
    .int('Debe ser un numero entero')
    .refine((value) => value >= 1 && value <= 12, {
      message: 'No es un numero de mes valido [1 - 12]',
    })
    .or(z.literal('')),
  endDateYear: z
    .number({
      coerce: true,
      required_error: 'Año de finalización requerido',
      invalid_type_error: 'Debe ser un numero',
    })
    .int('Debe ser un numero entero')
    .min(currentYear - 100, `Mínimo: ${currentYear - 100}`)
    .max(currentYear, `Máximo: ${currentYear}`)
    .or(z.literal('')),
  description: z
    .string()
    .trim()
    .min(1, 'La descripción es requerida')
    .max(1000, 'La descripción no puede tener mas de 1000 caracteres'),
  current: z.boolean({
    required_error: 'Requerido',
    invalid_type_error: 'Debe ser true o false',
  }),
});

module.exports = experienceSchema;
