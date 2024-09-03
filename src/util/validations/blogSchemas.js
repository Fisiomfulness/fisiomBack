const { z } = require('zod');
const { countHtmlCharacters, validateId } = require('../helpers');

const blogSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, 'El titulo debe tener mas de 3 caracteres')
    .max(100, 'El titulo no puede tener mas de 100 caracteres'),
  text: z
    .string()
    .refine(
      (value) => countHtmlCharacters(value) >= 300,
      'El texto del blog debe tener al menos 300 caracteres'
    )
    .refine(
      (value) => countHtmlCharacters(value) <= 8000,
      'El blog no puede tener mas de 8000 caracteres'
    ),
  professional_id: z
    .string()
    .refine(
      async (value) => await validateId(value, 'Profesional'),
      'Profesional no encontrado'
    ),
  type_id: z
    .string()
    .refine(
      async (value) => await validateId(value, 'Type'),
      'Tipo de blog no encontrado'
    ),
});

const commentSchema = z.object({
  rating: z
    .number()
    .min(1, 'La puntuación minima es de 1')
    .max(5, 'La puntuación maxima es de 5'),
  content: z
    .string()
    .min(3, 'El comentario debe tener al menos 3 caracteres')
    .max(100, 'El comentario no puede tener mas de 100 caracteres'),
  sender_id: z
    .string()
    .refine(
      async (value) => await validateId(value, 'User'),
      'Usuario no encontrado'
    ),
  blog_id: z
    .string()
    .refine(
      async (value) => await validateId(value, 'Blog'),
      'Blog no encontrado'
    ),
});

module.exports = { blogSchema, commentSchema };
