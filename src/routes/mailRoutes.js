const { Router } = require('express');
const { sendEmail, sendEmailRequestingBudget } = require('../controllers/index');
const { uploadCurriculum } = require('../config/multerConfig');

const router = Router();

router.post('/job-request', uploadCurriculum, sendEmail);
router.post('/request-budget', sendEmailRequestingBudget);

module.exports = router;
