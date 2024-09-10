const { createAppointment } = require('./createAppointment');
const { deleteAppointment } = require('./deleteAppointment');
const { getAppointments } = require('./getAppointments');
const { updateAppointment } = require('./updateAppointment');
const {
  sendAppointmentConfirmation,
} = require('../mail/appointmentController');

module.exports = {
  createAppointment,
  getAppointments,
  updateAppointment,
  deleteAppointment,
  sendAppointmentConfirmation,
};
