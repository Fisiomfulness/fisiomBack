const { z } = require('zod');
const { nameRegex, phoneRegExp, numericRegex } = require('../regExp');
const { isDateOnRange } = require('../helpers');
const addressSchema = require('./addressSchema');

const acceptedYears = { min: 18, max: 100 };
const MAX_PICTURE_SIZE = 1024 * 1024 * 3; // ? 3MB

const professionalSchema = z.object({
  name: z
    .string()
    .trim()
    .regex(nameRegex, 'debe contener solo letras')
    .min(3, 'el nombre debe tener al menos 3 caracteres')
    .max(30, 'no mas de 30 caracteres'),
  phone: z
    .string()
    .trim()
    .regex(phoneRegExp, 'no es un teléfono valido (sin espacios)'),
  email: z.string().trim().email('no es un email'),
  birthDate: z
    .string()
    .date('no es una fecha valida YYYY-MM-DD')
    .refine(
      (value) => isDateOnRange(value, acceptedYears.min, acceptedYears.max),
      `debes tener mas de ${acceptedYears.min} y menos de ${acceptedYears.max} años`
    ),
  password: z
    .string()
    .trim()
    .min(8, 'la contraseña debe tener al menos 8 caracteres')
    .max(50, 'no mas de 50 caracteres'),
  gender: z.enum(['Femenino', 'Masculino', 'Prefiero no responder']),
  license: z
    .string()
    .trim()
    .min(3, 'el n° colegiado debe tener mas de 3 dígitos')
    .max(10, 'el n° colegiado no puede tener mas de 10 dígitos')
    .regex(numericRegex, 'el n° colegiado debe ser numérico')
    .optional(),
  address: addressSchema,
  image: z
    .instanceof(File)
    .refine((value) => value.type.startsWith('image/'), 'no es una imagen')
    .refine(
      (value) => value && value.size <= MAX_PICTURE_SIZE,
      'tamaño de imagen máxima: 3MB'
    )
    .optional(),
});

module.exports = professionalSchema;
