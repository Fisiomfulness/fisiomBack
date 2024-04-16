const { Router } = require('express');
const ProfesionalRegister = require('../controllers/register/ProfesionalRegister');
const UserRegister = require('../controllers/register/UserRegister');

const router = Router();

router.post('/profesional', ProfesionalRegister);
router.post('/user', UserRegister);

module.exports = router;
