const { Router } = require('express');
const {
  createAppointment,
  getAppointments,
  updateAppointment,
  deleteAppointment,
  adminConfirmAppointment,
  getPendingAppointments,
} = require('../../controllers/index');


const router = Router();

router.post('/create', createAppointment);
router.post('/update', updateAppointment);
router.post('/delete/:_id', deleteAppointment);
router.get('/', getAppointments);
router.patch('/confirm/:appointmentId', adminConfirmAppointment)
router.get('/pending', getPendingAppointments);


module.exports = router;
