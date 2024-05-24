const { z } = require('zod');
const {
  streetNameRegex,
  numericRegex,
  cityRegex,
  nameRegex,
} = require('../regExp');

const addressSchema = z.object({
  streetName: z
    .string()
    .trim()
    .min(2, 'la calle debe tener al menos 2 caracteres')
    .max(50, 'la calle no puede tener mas de 50 caracteres')
    .regex(streetNameRegex, 'solo letras y números (min: 2 letras)'),
  streetNumber: z
    .string()
    .trim()
    .min(1, 'el n° de calle debe tener al menos 1 dígito')
    .max(8, 'el n° de calle no puede tener mas de 8 dígitos')
    .regex(numericRegex, 'Debe ser numérico'),
  floorAppartment: z
    .string()
    .trim()
    .max(5, 'no puede tener mas de 5 dígitos')
    .regex(numericRegex, 'Debe ser numérico')
    .optional(),
  city: z
    .string()
    .trim()
    .min(2, 'la ciudad debe tener al menos 2 caracteres')
    .max(50, 'la ciudad no puede tener mas de 50 caracteres')
    .regex(
      cityRegex,
      'el nombre de la ciudad solo puede contener letras y espacios'
    ),
  state: z
    .string()
    .trim()
    .min(2, 'el estado/provincia debe tener al menos 2 caracteres')
    .max(50, 'el estado/provincia no puede tener mas de 50 caracteres')
    .regex(nameRegex, 'solo puede contener letras')
    .optional(),
  country: z
    .string()
    .trim()
    .min(2, 'el pais debe tener al menos 2 caracteres')
    .max(50, 'no mas de 50 caracteres')
    .regex(nameRegex, 'solo puede contener letras'),
});

module.exports = addressSchema;
