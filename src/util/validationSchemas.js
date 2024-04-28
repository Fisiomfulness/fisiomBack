const { z } = require('zod');
const { validateId, countHtmlCharacters } = require('../util/helpers');

const blogSchema = z.object({
  title: z
    .string()
    .min(3, 'minimum of 3 characters')
    .max(100, 'no more than 100 characters'),
  text: z
    .string()
    .refine((value) => countHtmlCharacters(value) >= 300, 'minimum of 300 characters')
    .refine((value) => countHtmlCharacters(value) <= 8000, 'no more than 8000 characters'),
  image: z.string().url('not a valid url'),
  professional_id: z
    .string()
    .refine(
      async (value) => await validateId(value, 'Profesional'),
      'professional not found'
    ),
  type_id: z
    .string()
    .refine(async (value) => await validateId(value, 'Type'), 'type not found'),
});

const commentSchema = z.object({
  rating: z.number().min(1, 'minimum is 1').max(5, 'maximum is 5'),
  content: z
    .string()
    .min(3, 'at least 3 characters')
    .max(100, 'no more than 100 characters'),
  sender_id: z
    .string()
    .refine(async (value) => await validateId(value, 'User'), 'user not found'),
  blog_id: z
    .string()
    .refine(async (value) => await validateId(value, 'Blog'), 'blog not found'),
});

module.exports = { blogSchema, commentSchema };
