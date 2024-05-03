const { Router } = require('express');
const { sendEmail } = require('../controllers/index');
const { uploadCurriculum } = require('../config/multerConfig');

const router = Router();

router.post('/job-request', uploadCurriculum, sendEmail);

module.exports = router;
