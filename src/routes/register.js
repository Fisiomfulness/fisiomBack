const { Router } = require('express');
const ProfesionalRegister = require('../controllers/login/register/ProfesionalRegister');
const UserRegister = require('../controllers/login/register/UserRegister');
const { uploadCurriculum } = require('../config/multerConfig');

const router = Router();

router.post('/professional', uploadCurriculum, ProfesionalRegister);
router.post('/user', UserRegister);

module.exports = router;
