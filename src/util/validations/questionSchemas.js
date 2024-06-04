const { z } = require('zod');
const { validateId } = require('../helpers');

const questionSchema = z.object({
  text: z
    .string()
    .trim()
    .min(10, 'la pregunta debe tener al menos 10 caracteres')
    .max(500, 'la pregunta no puede tener mas de 500 caracteres'),
  specialtyId: z
    .string()
    .refine(
      async (value) => await validateId(value, 'Specialty'),
      'especialidad no encontrada'
    )
    .optional(),
});

const questionResponseSchema = z.object({
  text: z
    .string()
    .trim()
    .min(5, 'la respuesta debe tener al menos 5 caracteres')
    .max(800, 'la respuesta no puede tener mas de 800 caracteres'),
  professionalId: z
    .string()
    .refine(
      async (value) => await validateId(value, 'Profesional'),
      'profesional no encontrado'
    ),
});

module.exports = { questionSchema, questionResponseSchema };
