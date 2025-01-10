const { sendEmail } = require('./sendMail');
const { sendBlogNotification } = require('./sendBlogNotification');
const { sendProfessionalNotification } = require('./sendProfesionalNotification');
const { sendEmailRequestingBudget } = require('./enterpriseRequestBudget');
const { sendEmailRequestingInfo } = require('./requestInfo');

module.exports = {
  sendEmail,
  sendProfessionalNotification,
  sendBlogNotification,
  sendEmailRequestingBudget,
  sendEmailRequestingInfo,
};

