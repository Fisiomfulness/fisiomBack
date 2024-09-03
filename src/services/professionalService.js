const Professional = require('#src/models/profesional/Profesional');

/**
 * Actualiza el rating de un profesional.
 *
 * @param {import('mongoose').Types.ObjectId} professionalId - ID del profesional.
 * @param {number} scoreChange - Cambio en el puntaje total.
 * @param {number} commentChange - Cambio en el número de comentarios.
 * @returns {Promise<{total: number, totalComments: number, average: number}>} El rating actualizado.
 * @throws {Error} Si el profesional no se encuentra o no se reciben los parámetros correctamente.
 */
const updateProfessionalRating = async (
  professionalId,
  scoreChange,
  commentChange,
) => {
  if (typeof scoreChange !== 'number' || typeof commentChange !== 'number') {
    throw new Error('scoreChange and commentChange must be numbers');
  }

  const professional = await Professional.findById(professionalId);
  if (!professional) throw new Error('Professional not found');

  const total = professional.rating.total + scoreChange;
  const totalComments = professional.rating.totalComments + commentChange;
  const average = totalComments > 0 ? Math.round(total / totalComments) : 0;

  const updatedRating = {
    total,
    totalComments,
    average,
  };

  professional.rating = updatedRating;
  await professional.save();

  return updatedRating;
};

module.exports = { updateProfessionalRating };
