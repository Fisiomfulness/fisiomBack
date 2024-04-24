const { Router } = require('express');
const ProfesionalRegister = require('../controllers/register/ProfesionalRegister');
const UserRegister = require('../controllers/register/UserRegister');
const { uploadCurriculum } = require('../config/multerConfig');

const router = Router();

router.post('/professional', uploadCurriculum, ProfesionalRegister);
router.post('/user', UserRegister);

module.exports = router;
