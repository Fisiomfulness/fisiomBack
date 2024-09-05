const { Router } = require('express');
const {
  createAppointment,
  getAppointments,
  updateAppointment,
  deleteAppointment,
} = require('../../controllers/index');

const {
  sendAppointmentConfirmation,
} = require('../../controllers/mail/appointmentController');

console.log(sendAppointmentConfirmation); // prueba

console.log(createAppointment); // super prueba
console.log(getAppointments);
console.log(updateAppointment);
console.log(deleteAppointment);

const router = Router();

router.post('/create', createAppointment);
router.post('/update', updateAppointment);
router.post('/delete/:_id', deleteAppointment);
router.get('/', getAppointments);
// Nueva ruta para enviar confirmación de cita
router.post('/confirm', sendAppointmentConfirmation);

module.exports = router;
