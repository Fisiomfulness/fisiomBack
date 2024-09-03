const moment = require('moment');
const momentZone = require('moment-timezone');
const Appointment = require('../../models/appointment/Appointment');
const Profesional = require('../../models/profesional/Profesional');
const User = require('../../models/user/User');
const Availability = require('#src/models/profesional/availabilitySchema');
moment.locale('es'); // Establecemos el locale a español

const timeFormat = 'YYYY-MM-DDTHH:mm';

const createAppointment = async (req, res) => {
  try {
    let {
      _professional,
      _patient,
      title,
      start,
      end,
      additionalDescription,
      status,
    } = req.body;

    start = momentZone(start).tz('America/Lima').format(timeFormat);
    end = momentZone(end).tz('America/Lima').format(timeFormat);

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
      !moment(start, timeFormat, true).isValid() ||
      !moment(start, timeFormat, true).isValid()
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
    const verifySameDay = moment(start).isSame(end, 'day');
    if (!verifySameDay) {
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
                { end: { $gt: moment().toDate() } }, // Verifica que la cita pendiente no haya expirado
              ],
            },
          ],
        },
        // Are overlapping
        { end: { $gt: start } }, // La cita existente termina después de que comienza la nueva cita
        { start: { $lt: end } }, // La cita existente comienza antes de que termine la nueva cita
        // Are for the same professional or patient
        { $or: [{ _patient }, { _professional }] },
      ],
    });

    if (overlapping) {
      res.status(401).json({
        message: 'La cita se superpone con una existente.',
      });
      return;
    }

    // Validate that the professional is available during the time of the appointment
    const dayOfWeek = moment(start).format('dddd').toLowerCase(); // Obtener el día de la semana

    // search the availability of the professional for the specific day
    const findProfessionalAvailability = await Availability.find({
      userId: _professional,
    });

    //verify if exist any availability
    if (findProfessionalAvailability.length) {
      const professionalAvailability =
        findProfessionalAvailability[0].availability;

      const availabilityForDay = professionalAvailability.find(
        (availability) => availability.day.toLowerCase() === dayOfWeek,
      );

      const isTimeInRange = (time, range) => {
        const date = moment(time).format('HH:mm');
        const timeToCheck = moment(date, 'HH:mm');
        const startTime = moment(range.start, 'HH:mm');
        const endTime = moment(range.end, 'HH:mm');

        return timeToCheck.isBetween(startTime, endTime, null, '[]');
      };

      if (availabilityForDay?.day) {
        // Validar si la cita está dentro de algún intervalo de tiempo disponible
        const isWithinWorkingHours = availabilityForDay.timeSlots.some(
          (timeSlot) => {
            return (
              isTimeInRange(start, timeSlot) || isTimeInRange(end, timeSlot)
            );
          },
        );

        if (isWithinWorkingHours) {
          return res.status(401).json({
            message:
              'La fecha y hora seleccionada no está dentro de la disponibilidad del profesional',
          });
        }
      }
    }

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
    console.log(error);

    res
      .status(500)
      .json({ error: error.message, message: 'Ups, Algo salio mal!' });
  }
};

module.exports = { createAppointment };
