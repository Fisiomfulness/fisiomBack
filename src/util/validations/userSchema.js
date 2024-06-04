const { z } = require('zod');
const { nameRegex, phoneRegExp } = require('../regExp');
const { isDateOnRange } = require('../helpers');
const addressSchema = require('./addressSchema');

const acceptedYears = { min: 18, max: 100 };

const userSchema = z.object({
  name: z
    .string()
    .trim()
    .regex(nameRegex, 'debe contener solo letras')
    .min(3, 'el nombre debe tener al menos 3 caracteres')
    .max(30, 'no mas de 30 caracteres'),
  phone: z
    .string()
    .trim()
    .regex(phoneRegExp, 'no es un teléfono valido')
    .optional(),
  email: z.string().trim().email('no es un email'),
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
    .trim()
    .min(8, 'la contraseña debe tener al menos 8 caracteres')
    .max(50, 'no mas de 50 caracteres'),
  address: addressSchema,
});

module.exports = userSchema;
