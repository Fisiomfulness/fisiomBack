const { createAppointment } = require('./createAppointment');
const { deleteAppointment } = require('./deleteAppointment');
const { getAppointments } = require('./getAppointments');
const { updateAppointment } = require('./updateAppointment');
const { getPendingAppointments } = require('./getPendingAppointments');
const { adminConfirmAppointment } = require('./adminConfirmAppointment');


module.exports = {
  createAppointment,
  getAppointments,
  updateAppointment,
  deleteAppointment,
  adminConfirmAppointment,
  getPendingAppointments,
};
