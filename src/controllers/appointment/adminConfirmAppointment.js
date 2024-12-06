const moment = require('moment-timezone');
const nodemailer = require('nodemailer');
const Appointment = require('../../models/appointment/Appointment');
const Profesional = require('../../models/profesional/Profesional');
const User = require('../../models/user/User');
const {
  MAIL_PORT,
  MAIL_HOST,
  MAIL_USER,
  MAIL_PASSWORD,
} = require('../../config/envConfig');

const transporter = nodemailer.createTransport({
  host: MAIL_HOST,
  port: MAIL_PORT,
  secure: false,
  auth: {
    user: MAIL_USER,
    pass: MAIL_PASSWORD,
  },
});
const countryToTimezone = {
  'Argentina': 'America/Argentina/Buenos_Aires',
  'Bolivia': 'America/La_Paz',
  'Brasil': 'America/Sao_Paulo',
  'Chile': 'America/Santiago',
  'Colombia': 'America/Bogota',
  'Costa Rica': 'America/Costa_Rica',
  'Cuba': 'America/Havana',
  'Ecuador': 'America/Guayaquil',
  'El Salvador': 'America/El_Salvador',
  'Guatemala': 'America/Guatemala',
  'Honduras': 'America/Tegucigalpa',
  'México': 'America/Mexico_City',
  'Nicaragua': 'America/Managua',
  'Panamá': 'America/Panama',
  'Paraguay': 'America/Asuncion',
  'Perú': 'America/Lima',
  'República Dominicana': 'America/Santo_Domingo',
  'Uruguay': 'America/Montevideo',
  'Venezuela': 'America/Caracas',
  'Belice': 'America/Belize',
  'Guyana': 'America/Guyana',
  'Surinam': 'America/Paramaribo',
  'Bermudas': 'Atlantic/Bermuda',
  'Francia de ultramar': 'Europe/Paris',
  // Si hay más países o territorios, agréguelos aquí con sus respectivas zonas horarias.
};
// Función para obtener la zona horaria del usuario a partir de su país
const getUserTimezone = (country) => {
  return countryToTimezone[country] || 'UTC'; // Devuelve UTC si el país no está en el mapa
};

const adminConfirmAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    console.log(appointmentId);
    
    // Encuentra la cita por ID
    const appointment = await Appointment.findById(appointmentId)
    .populate('_professional', 'name email address') // Agregar address para el profesional
    .populate('_patient', 'name email address');    // Agregar address para el paciente
  
    if (!appointment) {
      return res.status(404).json({ message: 'Cita no encontrada' });
    }

    // Verifica si la cita ya fue rechazada por expiración
    if (appointment.status === 'REJECTED') {
      return res.status(400).json({
        message: 'No se pudo aceptar la cita porque ya se agotó su tiempo de espera.',
      });
    }

    // Cambia el estado de la cita a "ACCEPTED" y guarda
    appointment.status = 'ACCEPTED';
    await appointment.save();


    // Información del profesional y del paciente
    const professional = appointment._professional;
    const patient = appointment._patient;

    const professionalTimezone = getUserTimezone(professional.address.country);

    // Convertir las fechas de la cita a la zona horaria del profesional
    const startInProfessionalTimezone = moment(appointment.start).tz(professionalTimezone).format('YYYY-MM-DD HH:mm:ss');
    const endInProfessionalTimezone = moment(appointment.end).tz(professionalTimezone).format('YYYY-MM-DD HH:mm:ss');

    console.log(startInProfessionalTimezone);
    // Enviar correo al profesional
    const professionalEmailContent = `
    <p>Estimado ${professional.name},</p>
    <p>Se ha agendado una nueva cita para usted. A continuación, los detalles de la cita:</p>
    <ul>
      <li><strong>Paciente:</strong> ${appointment._patient.name}</li>
      <li><strong>Fecha y hora de inicio (su hora - ${professional.address.country}):</strong> ${startInProfessionalTimezone}</li>
      <li><strong>Fecha y hora de finalización (su hora - ${professional.address.country}):</strong> ${endInProfessionalTimezone}</li>
      <li><strong>Descripción adicional:</strong> ${appointment.additionalDescription}</li>
    </ul>
  `;

    await transporter.sendMail({
      from: MAIL_USER,
      to: professional.email,
      subject: 'Nueva cita agendada',
      html: professionalEmailContent,
    });

    console.log('Correo de confirmación enviado al profesional.');

    // Enviar correo al paciente
    const patientEmailContent = `
    <p>Estimado ${appointment._patient.name},</p>
    <p>Su cita ha sido agendada. A continuación, los detalles de la cita:</p>
    <ul>
      <li><strong>Profesional:</strong> ${professional.name}</li>
      <li><strong>Fecha y hora de inicio (su hora - ${professional.address.country}):</strong> ${startInProfessionalTimezone}</li>
      <li><strong>Fecha y hora de finalización (su hora - ${professional.address.country}):</strong> ${endInProfessionalTimezone}</li>
      <li><strong>Descripción adicional:</strong> ${appointment.additionalDescription}</li>
    </ul>
  `;

    await transporter.sendMail({
      from: MAIL_USER,
      to: patient.email,
      subject: 'Confirmación de pago y reserva de cita',
      html: patientEmailContent,
    });

    console.log('Correo de confirmación enviado al paciente.');
    
    return res.status(200).json({ success: true, message: 'Cita confirmada y correos enviados.' });

  } catch (error) {
    console.error('Error al confirmar la cita y enviar correos:', error);
    res.status(500).json({ message: 'Error al confirmar la cita y enviar correos.' });
  }
};

module.exports = { adminConfirmAppointment};
