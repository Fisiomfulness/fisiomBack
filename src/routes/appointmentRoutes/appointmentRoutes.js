const { Router } = require('express');
const {
  createAppointment,
  getAppointments,
  updateAppointment,
  deleteAppointment,
  sendAppointmentConfirmation,
} = require('../../controllers/index');

const router = Router();

router.post('/create', createAppointment);
router.post('/update', updateAppointment);
router.post('/delete/:_id', deleteAppointment);
router.get('/', getAppointments);
// Nueva ruta para enviar confirmación de cita
router.post('/confirm', sendAppointmentConfirmation);

module.exports = router;
