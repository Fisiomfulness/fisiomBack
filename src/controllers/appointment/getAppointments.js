const moment = require('moment');
const Appointment = require('../../models/appointment/Appointment');

const getAppointments = async (req, res) => {
  try {
    const {
      from = '',
      to = '',
      _professional = '',
      _patient = '',
      status = '',
    } = req.query;
    if (!moment(from).isValid() || !moment(to).isValid()) {
      return res.status(400).json({
        message: 'Debe proveer una fecha inicial "from:" y final "to:" válida',
      });
    }

    // Convertir `from` y `to` a UTC antes de construir la consulta
    const fromUTC = moment(from).utc().toISOString();
    const toUTC = moment(to).utc().toISOString();

    let appointmentQuery = {
      start: { $gt: fromUTC },
      end: { $lt: toUTC },
    };

    if (_professional) {
      appointmentQuery = { ...appointmentQuery, _professional };
    }
    if (_patient) {
      appointmentQuery = { ...appointmentQuery, _patient };
    }

    if (status) {
      appointmentQuery = { ...appointmentQuery, status };
    } else {
      appointmentQuery = {
        ...appointmentQuery,
        $or: [
          { status: 'ACCEPTED' },
          {
            $and: [{ status: 'PENDING' }], // { expiration: { $gt: Date.now() } }], lo comento por ahora para testear el calendario
          },
        ],
      };
    }

    const appointments = await Appointment.find(appointmentQuery);

    // Convertir fechas a UTC antes de enviarlas
    const formattedAppointments = appointments.map((appointment) => ({
      ...appointment.toObject(),
      start: moment(appointment.start).utc().format('YYYY-MM-DD HH:mm'),
      end: moment(appointment.end).utc().format('YYYY-MM-DD HH:mm'),
      expiration: moment(appointment.expiration)
        .utc()
        .format('YYYY-MM-DD HH:mm'),
    }));

    return res.status(200).json({ appointments: formattedAppointments });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

module.exports = { getAppointments };
