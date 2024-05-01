const { Router } = require('express');

const { sendEmail, recoverAccount } = require('../controllers/index');
const { uploadCurriculum } = require('../config/multerConfig');

const router = Router();

router.post('/', recoverAccount);
router.post('/job-request', uploadCurriculum, sendEmail);

module.exports = router;
