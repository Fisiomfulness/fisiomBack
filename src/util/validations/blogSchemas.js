const { z } = require('zod');
const { countHtmlCharacters, validateId } = require('../helpers');

const blogSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, 'el titulo debe tener mas de 3 caracteres')
    .max(100, 'el titulo no puede tener mas de 100 caracteres'),
  text: z
    .string()
    .refine(
      (value) => countHtmlCharacters(value) >= 300,
      'el texto del blog debe tener al menos 300 caracteres'
    )
    .refine(
      (value) => countHtmlCharacters(value) <= 8000,
      'el blog no puede tener mas de 8000 caracteres'
    ),
  professional_id: z
    .string()
    .refine(
      async (value) => await validateId(value, 'Profesional'),
      'profesional no encontrado'
    ),
  type_id: z
    .string()
    .refine(
      async (value) => await validateId(value, 'Type'),
      'tipo de blog no encontrado'
    ),
});

const commentSchema = z.object({
  rating: z
    .number()
    .min(1, 'el rating mínimo es 1')
    .max(5, 'el rating máximo es de 5'),
  content: z
    .string()
    .min(3, 'el comentario debe tener al menos 3 caracteres')
    .max(100, 'el comentario no puede tener mas de 100 caracteres'),
  sender_id: z
    .string()
    .refine(
      async (value) => await validateId(value, 'User'),
      'usuario no encontrado'
    ),
  blog_id: z
    .string()
    .refine(
      async (value) => await validateId(value, 'Blog'),
      'blog no encontrado'
    ),
});

module.exports = { blogSchema, commentSchema };
