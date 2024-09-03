const { Router } = require('express');
const {
  createAppointment,
  getAppointments,
  updateAppointment,
  deleteAppointment,
} = require('../../controllers/index');

const router = Router();

router.post('/create', createAppointment);
router.post('/update', updateAppointment);
router.post('/delete/:_id', deleteAppointment);

router.get('/', getAppointments);

module.exports = router;
