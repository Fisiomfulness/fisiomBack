const moment = require('moment');
const Appointment = require('../../models/Appointment');
const Profesional = require('../../models/Profesional');
const User = require('../../models/User');

const createAppointment = async (req, res) => {
  try {
    const { _professional, _patient, title, fromDateTime, toDateTime } =
      req.body;

    // Validate professional
    const professional = await Profesional.findById(_professional);
    if (!professional || !professional.status) {
      res.status(401).json({ message: 'profesional ID no válido' });
      return;
    }
    // Validate patient
    const patient = await User.findById(_patient);
    if (!patient || !patient.status) {
      res.status(401).json({ message: 'paciente ID no válido' });
      return;
    }

    // Validate fromDateTime and toDateTime formats
    if (
      !moment(fromDateTime, 'YYYY-MM-DDTHH:mm', true).isValid() ||
      !moment(toDateTime, 'YYYY-MM-DDTHH:mm', true).isValid()
    ) {
      res.status(401).json({
        message:
          'Formato de fecha de cita no válido. Por favor usa YYYY-MM-DDTHH:mm.',
      });
      return;
    }

    // Validate fromDateTime is not after toDateTime
    if (moment(fromDateTime) > moment(toDateTime)) {
      return res.status(401).json({
        message:
          'La fecha/hora de inicio debe ser menor a la fecha/hora de finalización',
      });
    }

    // Validate that fromDateTime and toDateTime are on the same day
    const startDate = fromDateTime.split('T')[0];
    const endDate = toDateTime.split('T')[0];
    if (startDate !== endDate) {
      res.status(401).json({
        message:
          'La fecha de inicio y la fecha de finalización deben ser del mismo día',
      });
      return;
    }

    // Validate there are no valid overlapping appointments
    const overlapping = await Appointment.findOne({
      $and: [
        // Status is ACCEPTED or PENDING but not yet expired
        {
          $or: [
            { status: 'ACCEPTED' },
            {
              $and: [
                { status: 'PENDING' },
                { expiration: { $gt: Date.now() } },
              ],
            },
          ],
        },
        // Are overlaping
        { toDateTime: { $gt: fromDateTime } },
        { dateTime: { $lt: toDateTime } },
        // Are for the same professional or patient
        { $or: [{ _patient }, { _professional }] },
      ],
    });
    if (overlapping) {
      res.status(401).json({
        message:
          'La fecha y hora seleccionada se superponen con otra cita del profesional o del paciente',
      });
      return;
    }

    // Validate that the professional is available during the time of the appointment
    const daysOfWeekMap = {
      0: 'sunday',
      1: 'monday',
      2: 'tuesday',
      3: 'wednesday',
      4: 'thursday',
      5: 'friday',
      6: 'saturday',
    };
    // Get day of week key
    const startDateDay = daysOfWeekMap[moment(fromDateTime).day()];
    // Match key to day of week
    const workingHours = professional.availability[startDateDay];

    let insideWorkingHours = false;
    // Check through working hours timeLapses for that day of the week
    for (let i = 0; i < workingHours.length; i++) {
      if (
        moment(fromDateTime.split('T')[1], 'HH:mm').isBetween(
          moment(workingHours[i].start, 'HH:mm'),
          moment(workingHours[i].end, 'HH:mm'),
          null,
          [],
        ) &&
        moment(toDateTime.split('T')[1], 'HH:mm').isBetween(
          moment(workingHours[i].start, 'HH:mm'),
          moment(workingHours[i].end, 'HH:mm'),
          null,
          [],
        )
      ) {
        insideWorkingHours = true;
        break;
      }
    }
    if (!insideWorkingHours) {
      res.status(401).json({
        message:
          'La fecha y hora seleccionada no está dentro de la disponibilidad del profesional',
      });
      return;
    }

    // Create appointment
    const appointment = await Appointment.create({
      _professional,
      _patient,
      title,
      fromDateTime,
      toDateTime,
    });
    return res
      .status(201)
      .json({ appointment, message: 'Agendado con exito!' });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

module.exports = { createAppointment };
