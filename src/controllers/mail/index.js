const { sendEmail } = require('./sendMail');
const { sendBlogNotification } = require('./sendBlogNotification');
const { sendProfessionalNotification } = require('./sendProfesionalNotification');

module.exports = {
  sendEmail,
  sendProfessionalNotification,
  sendBlogNotification,
};

