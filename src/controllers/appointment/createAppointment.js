const moment = require('moment');
const Appointment = require('../../models/appointment/Appointment');
const Profesional = require('../../models/profesional/Profesional');
const User = require('../../models/user/User');
const Availability = require('#src/models/profesional/availabilitySchema');
moment.locale('es'); // Establecemos el locale a español

const createAppointment = async (req, res) => {
  try {
    const {
      _professional,
      _patient,
      title,
      start,
      end,
      additionalDescription,
      status,
    } = req.body;

    const formatData = (data) => moment(data).format('YYYY-MM-DDTHH:mm');

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

    // Validate start and end formats (YYYY-MM-DDTHH:mm)
    if (
      !moment(formatData(start), 'YYYY-MM-DDTHH:mm', true).isValid() ||
      !moment(formatData(end), 'YYYY-MM-DDTHH:mm', true).isValid()
    ) {
      res.status(401).json({
        message: 'Formato de fecha de cita no válido',
      });
      return;
    }

    // Validate start is not after end
    if (moment(start) > moment(end)) {
      return res.status(401).json({
        message:
          'La fecha/hora de inicio debe ser menor a la fecha/hora de finalización',
      });
    }

    // Validate that start and end are on the same day
    const startDate = start.split('T')[0];
    const endDate = end.split('T')[0];
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
        { end: { $gt: start } },
        { dateTime: { $lt: end } },
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
    const dayOfWeek = moment(start).format('dddd').toLowerCase(); // Obtener el día de la semana
    console.log(dayOfWeek);

    // Buscar la disponibilidad del profesional para el día específico
    const professionalAvailability = await Availability.find({
      userId: _professional,
    });

    console.log('profesionalAVA', professionalAvailability[0].availability);

    const availabilityForDay = professionalAvailability[0].availability.find(
      (availability) => availability.day.toLowerCase() === dayOfWeek,
    );

    console.log('day', availabilityForDay);

    /* CHECK IF WORK */

    if (availabilityForDay.day) {
      // Validar si la cita está dentro de algún intervalo de tiempo disponible
      const isWithinWorkingHours = availabilityForDay.timeSlots.some(
        (timeSlot) => {
          return (
            moment(start)
              .format('HH:mm')
              .isBetween(
                moment(timeSlot.start).format('HH:mm'),
                moment(timeSlot.end).format('HH:mm'),
                null,
                '[]',
              ) &&
            moment(end)
              .format('HH:mm')
              .isBetween(
                moment(timeSlot.start).format('HH:mm'),
                moment(timeSlot.end).format('HH:mm'),
                null,
                '[]',
              )
          );
        },
      );

      if (!isWithinWorkingHours) {
        return res.status(401).json({
          message:
            'La fecha y hora seleccionada no está dentro de la disponibilidad del profesional',
        });
      }
    }

    /* CHECK IF WORK */

    const patientName = patient.name;

    // Create appointment
    const appointment = await Appointment.create({
      _professional,
      _patient,
      patientName,
      additionalDescription,
      title,
      start,
      end,
      status,
    });
    return res
      .status(201)
      .json({ appointment, message: 'Agendado con exito!' });
  } catch (error) {
    res
      .status(500)
      .json({ error: error.message, message: 'Ups, Algo salio mal!' });
  }
};

module.exports = { createAppointment };
