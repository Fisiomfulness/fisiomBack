const { sendEmail } = require('./sendMail');
const { sendAppointmentConfirmation } = require('./appointmentController');

module.exports = {
  sendEmail,
  sendAppointmentConfirmation,
};
