const nodemailer = require('nodemailer');

const {
  MAIL_PORT,
  MAIL_HOST,
  MAIL_USER,
  MAIL_PASSWORD,
} = require('../config/envConfig');

const sendEmailNodemailer = async (options) => {
  try {
    var transport = nodemailer.createTransport({
      host: MAIL_HOST,
      port: MAIL_PORT,
      auth: {
        user: MAIL_USER,
        pass: MAIL_PASSWORD,
      },
    });

    const emailOptions = {
      from: 'fisiumfulness', // sender address
      to: options.to, // list of receivers
      subject: options.subject, // Subject line
      text: options.text, // plain text body
      html: options.html,
    };

    await transport.sendMail(emailOptions);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  sendEmailNodemailer,
};
