const { sendEmail } = require('./sendMail');
const { sendAppointmentConfirmation } = require('./appointmentController');
const { sendProfessionalApprovalNotification } = require('./approveProfessionalNotification');
const { sendProfessionalRejectionNotification } = require('./declineProfessionalNotification');
const { sendBlogApprovalNotification } = require('./approveBlogNotification');
const { sendBlogRejectionNotification } = require('./declineBlogNotification');

module.exports = {
  sendEmail,
  sendAppointmentConfirmation,
  sendProfessionalApprovalNotification,
  sendProfessionalRejectionNotification,
  sendBlogApprovalNotification,
  sendBlogRejectionNotification
};
