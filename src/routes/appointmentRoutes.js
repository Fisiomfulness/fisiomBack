const { Router } = require('express');
const { 
    createAppointment,
    getAppointments 
} = require('../controllers/index');

const router = Router();

router.post('/create', createAppointment);
router.get('/', getAppointments);

module.exports = router;
