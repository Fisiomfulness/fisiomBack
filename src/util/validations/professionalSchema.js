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
    .regex(nameRegex, 'El nombre debe contener solo letras')
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(30, 'El nombre no puede tener mas de 30 caracteres'),
  phone: z
    .string()
    .trim()
    .regex(phoneRegExp, 'No es un teléfono valido (sin espacios)'),
  email: z.string().trim().email('No es un email'),
  birthDate: z
    .string()
    .date('No es una fecha valida YYYY-MM-DD')
    .refine(
      (value) => isDateOnRange(value, acceptedYears.min, acceptedYears.max),
      `Debes tener mas de ${acceptedYears.min} y menos de ${acceptedYears.max} años`
    ),
  description: z
    .string()
    .trim()
    .max(500, 'La descripción no puede tener mas de 500 caracteres')
    .optional()
    .or(z.literal('')),
  password: z
    .string()
    .trim()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .max(50, 'La contraseña no puede tener mas de 50 caracteres'),
  gender: z.enum(['Femenino', 'Masculino', 'Prefiero no responder']),
  consultationPrice: z
    .union([z.string(), z.number()])
    .refine((value) => !isNaN(Number(value)), {
      message: 'El precio de consulta debe ser un número',
    })
    .refine((value) => value >= 0, {
      message: 'El precio de consulta debe ser positivo',
    })
    .refine((value) => value <= 400, {
      message: 'El precio de consulta no debe exceder los 400 soles peruanos',
    })
    .optional(),
  license: z
    .string()
    .trim()
    .min(3, 'El n° colegiado debe tener mas de 3 dígitos')
    .max(10, 'El n° colegiado no puede tener mas de 10 dígitos')
    .regex(numericRegex, 'El n° colegiado debe ser numérico')
    .optional()
    .or(z.literal('')),
  address: addressSchema,
  coordinates: z
    .array(z.number())
    .length(2, 'Debe tener el formato => [number, number]')
    .optional(),
  image: z
    .instanceof(File)
    .refine(
      (value) => value.type.startsWith('image/'),
      'El archivo no es una imagen'
    )
    .refine(
      (value) => value && value.size <= MAX_PICTURE_SIZE,
      'Tamaño de imagen máxima: 3MB'
    )
    .optional(),
});

module.exports = professionalSchema;
