const { z } = require('zod');
const {
  nameRegex,
  phoneRegExp,
  cityRegex,
  numericRegex,
} = require('../util/regExp');
const {
  validateId,
  countHtmlCharacters,
  isDateOnRange,
} = require('../util/helpers');

const acceptedYears = { min: 18, max: 100 };

const addressSchema = z.object({
  streetName: z
    .string()
    .min(2, 'la calle debe tener al menos 2 caracteres')
    .max(50, 'la calle no puede tener mas de 50 caracteres'),
  streetNumber: z
    .string()
    .min(1, 'el n° de calle debe tener al menos 1 dígito')
    .max(6, 'el n° de calle no puede tener mas de 5 dígitos'),
  city: z
    .string()
    .min(2, 'la ciudad debe tener al menos 2 caracteres')
    .max(50, 'la ciudad no puede tener mas de 50 caracteres'),
  state: z
    .string()
    .max(50, 'el estado/provincia no puede tener mas de 50 caracteres')
    .optional(),
  country: z
    .string()
    .min(2, 'el pais debe tener al menos 2 caracteres')
    .max(30, 'no mas de 30 caracteres')
})

const userSchema = z.object({
  name: z
    .string()
    .regex(nameRegex, 'debe contener solo letras')
    .min(3, 'el nombre debe tener al menos 3 caracteres')
    .max(30, 'no mas de 30 caracteres'),
  phone: z.string().regex(phoneRegExp, 'no es un teléfono valido').optional(),
  email: z.string().email('no es un email'),
  dateOfBirth: z
    .string()
    .date('no es una fecha valida YYYY-MM-DD')
    .refine(
      (value) => isDateOnRange(value, acceptedYears.min, acceptedYears.max),
      `debes tener mas de ${acceptedYears.min} y menos de ${acceptedYears.max} años`
    ),
  gender: z.enum(['Femenino', 'Masculino', 'Prefiero no responder'], {
    message: 'Genero debe ser Femenino | Masculino | Prefiero no responder',
  }),
  password: z
    .string()
    .min(8, 'la contraseña debe tener al menos 8 caracteres')
    .max(50, 'no mas de 50 caracteres'),
  address: addressSchema
});

const professionalSchema = z.object({
  name: z
    .string()
    .regex(nameRegex, 'debe contener solo letras')
    .min(3, 'el nombre debe tener al menos 3 caracteres')
    .max(30, 'no mas de 30 caracteres'),
  phone: z
    .string()
    .regex(phoneRegExp, 'no es un teléfono valido (sin espacios)'),
  email: z.string().email('no es un email'),
  dateOfBirth: z
    .string()
    .date('no es una fecha valida YYYY-MM-DD')
    .refine(
      (value) => isDateOnRange(value, acceptedYears.min, acceptedYears.max),
      `debes tener mas de ${acceptedYears.min} y menos de ${acceptedYears.max} años`
    ),
  password: z
    .string()
    .min(8, 'la contraseña debe tener al menos 8 caracteres')
    .max(50, 'no mas de 50 caracteres'),
  gender: z.enum(['Femenino', 'Masculino', 'Prefiero no responder']),
  license: z
    .string()
    .min(3, 'el n° colegiado debe tener mas de 3 dígitos')
    .max(10, 'el n° colegiado no puede tener mas de 10 dígitos')
    .regex(numericRegex, 'el n° colegiado debe ser numérico')
    .optional(),
  address: addressSchema
});

const blogSchema = z.object({
  title: z
    .string()
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
  image: z.string().url('no es una url valida'),
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


module.exports = { userSchema, professionalSchema, blogSchema, commentSchema };
