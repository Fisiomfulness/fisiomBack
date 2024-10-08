const { z } = require('zod');
const { nameRegex, phoneRegExp } = require('../regExp');
const { isDateOnRange } = require('../helpers');
const addressSchema = require('./addressSchema');

const acceptedYears = { min: 18, max: 100 };
const MAX_PICTURE_SIZE = 1024 * 1024 * 3; // ? 3MB

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
    .optional()
    .or(z.literal('')),
  email: z.string().trim().email('no es un email'),
  birthDate: z
    .string()
    .date('no es una fecha valida YYYY-MM-DD')
    .refine(
      (value) => isDateOnRange(value, acceptedYears.min, acceptedYears.max),
      `debes tener mas de ${acceptedYears.min} y menos de ${acceptedYears.max} años`,
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
  coordinates: z
    .array(z.number())
    .length(2, 'debe tener el formato => [number, number]')
    .optional(),
  interests: z.preprocess(
    (value) => {
      // ? FormData solo acepta strings/archivos [key value], asi que esto viene puede venir con un JSON.stringify
      // ? por lo tanto de ser asi debemos parsearlo antes de hacer la validación.
      if (typeof value === 'string') {
        try {
          return JSON.parse(value);
        } catch (e) {
          return value;
        }
      }
      return value;
    },
    z
      .array(z.string())
      .max(5, 'No puede elegir mas de 5 intereses')
      .optional()
      .or(z.literal([])),
  ),
  image: z
    .instanceof(File)
    .refine(
      (value) => value.type.startsWith('image/'),
      'el archivo enviado no es una imagen',
    )
    .refine(
      (value) => value && value.size <= MAX_PICTURE_SIZE,
      'tamaño de imagen máxima: 3MB',
    )
    .optional(),
});

module.exports = userSchema;
