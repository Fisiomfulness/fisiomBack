const moment = require('moment');
const Appointment = require('../../models/appointment/Appointment');

const getPendingAppointments = async (req, res) => {
  try {
    const now = Date.now();

    // Actualizar el estado de citas pendientes que ya están expiradas a 'REJECTED'
    await Appointment.updateMany(
      { status: 'PENDING', expiration: { $lte: now } },
      { status: 'REJECTED' }
    );

    // Obtener citas pendientes que aún no han expirado
    const pendingAppointments = await Appointment.find({
      status: 'PENDING',
      expiration: { $gt: now },
    });

    // Validar si no hay citas pendientes activas
    if (pendingAppointments.length === 0) {
      return res.status(200).json({
        message: 'Actualmente no se encuentran turnos en estado pendiente o a la espera de confirmación.',
      });
    }

    // Devolver citas pendientes activas
    return res.status(200).json({ pendingAppointments });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

module.exports = { getPendingAppointments };
