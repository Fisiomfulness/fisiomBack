const moment = require('moment');
const Appointment = require('../../models/appointment/Appointment');

const getPendingAppointments = async (req, res) => {
  try {
    // Obtener el tiempo actual en UTC
    const nowUTC = moment().utc().toDate();

    // Actualizar el estado de citas pendientes que ya están expiradas a 'REJECTED'
    await Appointment.updateMany(
      { status: 'PENDING', expiration: { $lte: nowUTC } },
      { status: 'REJECTED' }
    );

    // Obtener citas pendientes que aún no han expirado
    const pendingAppointments = await Appointment.find({
      status: 'PENDING',
      expiration: { $gt: nowUTC },
    });

    // Validar si no hay citas pendientes activas
    if (pendingAppointments.length === 0) {
      return res.status(200).json({
        message: 'Actualmente no se encuentran turnos en estado pendiente o a la espera de confirmación.',
      });
    }

    // Convertir las fechas de UTC a zona local antes de devolverlas
    const formattedAppointments = pendingAppointments.map(appointment => ({
      ...appointment.toObject(),
      start: moment(appointment.start).local().format('YYYY-MM-DD HH:mm'),
      end: moment(appointment.end).local().format('YYYY-MM-DD HH:mm'),
      expiration: moment(appointment.expiration).local().format('YYYY-MM-DD HH:mm'),
    }));

    // Devolver citas pendientes activas con fechas formateadas
    return res.status(200).json({ pendingAppointments: formattedAppointments });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

module.exports = { getPendingAppointments };
