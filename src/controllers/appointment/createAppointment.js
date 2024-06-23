const moment = require('moment');
const Appointment = require('../../models/Appointment');
const Profesional = require('../../models/Profesional');
const User = require('../../models/User');

const createAppointment = async (req, res) => {
  try {
    const { _professional, _patient, title, fromDateTime, toDateTime } = req.body;

    const professional = await Profesional.findById(_professional)
    if (!professional) {
      res.status(401).json({ message: 'profesional ID no válido' });
    }
    const patient = await User.findById(_patient)
    if (!patient) {
      res.status(401).json({ message: 'paciente ID no válido' });
    }

    if (!moment(fromDateTime, 'YYYY-MM-DDTHH:mm', true).isValid() 
        || !moment(toDateTime, 'YYYY-MM-DDTHH:mm', true).isValid()) {
        res.status(401).json({
            message:
            'Formato de fecha de cita no válido. Por favor usa YYYY-MM-DDTHH:mm.',
        });
    }

    const overlapping = await Appointment.findOne({
      $and: [
        { toDateTime: { $gt: fromDateTime } },
        { dateTime: { $lt: toDateTime } },
        { $or: [{ _patient }, { _professional }] }
      ],
    });
    if (overlapping) {
      res.status(401).json({ 
        message: 'La fecha y hora seleccionada se superponen con otra cita del profesional o del paciente' 
      });
    }

    const appointment = await Appointment.create({
      _professional,
      _patient,
      title,
      fromDateTime,
      toDateTime
    });
    res.status(201).json({ appointment });

  } catch (error) {
    res.status(500).send(error.message);
  }
};

module.exports = { createAppointment };