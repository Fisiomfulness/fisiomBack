const { z } = require('zod');

const serviceSchema = z.object({
  serviceDescription: z
    .string()
    .trim()
    .min(5, 'La descripción debe tener al menos 5 caracteres')
    .max(50, 'La descripción no puede tener más de 50 caracteres'),
  serviceCost: z
    .number()
    .min(5, 'El costo del servicio debe ser al menos 5')
    .max(150, 'El costo del servicio no puede ser más de 150')
});

module.exports = serviceSchema;
