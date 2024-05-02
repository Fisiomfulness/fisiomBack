const { Router } = require('express');

const { sendEmail, recoverAccount } = require('../controllers/index');

const router = Router();

router.post('/', recoverAccount);

module.exports = router;
