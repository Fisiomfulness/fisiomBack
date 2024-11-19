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

const adminConfirmAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    console.log(appointmentId);
    
    // Encuentra la cita por ID
    const appointment = await Appointment.findById(appointmentId)
    .populate('_professional', 'name email')
    .populate('_patient', 'name email');
  
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

    console.log(professional, patient);
    
    // Enviar correo al profesional
    const professionalEmailContent = `
      <p>Estimado ${professional.name},</p>
      <p>Se ha agendado una nueva cita para usted. A continuación, los detalles de la cita:</p>
      <ul>
        <li><strong>Paciente:</strong> ${patient.name}</li>
        <li><strong>Fecha y hora de inicio:</strong> ${appointment.start}</li>
        <li><strong>Fecha y hora de finalización:</strong> ${appointment.end}</li>
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
      <p>Estimado ${patient.name},</p>
      <p>Su pago ha sido confirmado y su cita ha sido reservada. Aquí están los detalles de su cita:</p>
      <ul>
        <li><strong>Profesional:</strong> ${professional.name}</li>
        <li><strong>Fecha y hora de inicio:</strong> ${appointment.start}</li>
        <li><strong>Fecha y hora de finalización:</strong> ${appointment.end}</li>
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
