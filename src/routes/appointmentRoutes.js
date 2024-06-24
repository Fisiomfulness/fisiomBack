const { Router } = require('express');
const { createAppointment } = require('../controllers/index');

const router = Router();

router.post('/create', createAppointment);

module.exports = router;
