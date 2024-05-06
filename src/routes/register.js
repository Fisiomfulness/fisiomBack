const { Router } = require('express');
const { uploadCurriculum } = require('../config/multerConfig');
const { validationMiddleware } = require('#src/middleware/validationMiddleware');
const { userSchema, professionalSchema } = require('#src/util/validationSchemas');
const ProfesionalRegister = require('../controllers/login/register/ProfesionalRegister');
const UserRegister = require('../controllers/login/register/UserRegister');
const { addressMiddleware } = require('../middleware/addressMiddleware');

const router = Router();

router.post('/professional', addressMiddleware, uploadCurriculum, validationMiddleware(professionalSchema), ProfesionalRegister);
router.post('/user', addressMiddleware, validationMiddleware(userSchema), UserRegister);

module.exports = router;
