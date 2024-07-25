const { Router } = require('express');
const { uploadCurriculum } = require('../../config/multerConfig');
const {
  validationMiddleware,
} = require('#src/middleware/validationMiddleware');
const { validateFileType } = require('#src/middleware/validateFileType');
const { addressMiddleware } = require('../../middleware/addressMiddleware');
const { userSchema, professionalSchema } = require('../../util/validations');
const ProfesionalRegister = require('../../controllers/login/register/ProfesionalRegister');
const UserRegister = require('../../controllers/login/register/UserRegister');

const router = Router();

router.post(
  '/professional',
  uploadCurriculum,
  validateFileType('pdf'),
  addressMiddleware,
  validationMiddleware(professionalSchema),
  ProfesionalRegister,
);
router.post(
  '/user',
  addressMiddleware,
  validationMiddleware(userSchema),
  UserRegister,
);

module.exports = router;
