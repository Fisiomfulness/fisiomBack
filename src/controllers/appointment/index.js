const { createAppointment } = require('./createAppointment');
const { deleteAppointment } = require('./deleteAppointment');
const { getAppointments } = require('./getAppointments');
const { updateAppointment } = require('./updateAppointment');

module.exports = {
  createAppointment,
  getAppointments,
  updateAppointment,
  deleteAppointment,
};
