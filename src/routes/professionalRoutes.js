const Router = require('express-promise-router').default;
const {
  getProfessionals,
  createProfessional,
  getProfessionalDetail,
  statusProfessional,
  updateProfessional,
  deleteProfessional,
  getProfessionalRating,
  createProfessionalRating,
  deleteProfessionalRating,
  checkUserRating,
  addSpecialty,
  removeSpecialty,
  addExperience,
  updateExperience,
  deleteExperience,
} = require('../controllers/index');

const { upload } = require('#src/config/multerConfig');
const { errorMiddleware } = require('#src/middleware/errorMiddleware');
const { addressMiddleware } = require('#src/middleware/addressMiddleware');
const { decodeTokenUser } = require('#src/middleware/decodeTokenUser');
const { validationMiddleware } = require('#src/middleware/validationMiddleware');
const { validateFileType } = require('#src/middleware/validateFileType');
const {
  experienceSchema,
  professionalSchema,
  professionalRatingSchema,
} = require('#src/util/validations/index');
const roles = require('#src/util/roles');
const authAll = require('#src/middleware/authAll');
const permit = require('#src/middleware/rolesMiddleware');

const router = Router();

router.get('/', decodeTokenUser, getProfessionals);
router.get('/detail/:id', getProfessionalDetail);

router.get('/rating/:professional_id', getProfessionalRating);
router.get('/rating/:professional_id/:user_id/hasCommented', checkUserRating);

router.post('/create', addressMiddleware, createProfessional);

// ? Rutas para agregar o quitar specialties
router.post('/:profesional_id/specialty/:specialty_id', addSpecialty);
router.delete('/:profesional_id/specialty/:specialty_id', removeSpecialty);

router.use(authAll);

// ? No actualiza contraseña [apropósito]
router.put(
  '/update/:id',
  upload,
  validateFileType('image'),
  addressMiddleware,
  validationMiddleware(professionalSchema, 'update'),
  permit(roles.PROFESSIONAL, roles.ADMIN, roles.SUPER_ADMIN),
  updateProfessional
);
router.patch(
  '/status/:id',
  permit(roles.ADMIN, roles.SUPER_ADMIN),
  statusProfessional
);
// ! Agregar rol professional si se añade funcionalidad para eliminar propia cuenta.
router.delete(
  '/delete/:id',
  permit(roles.ADMIN, roles.SUPER_ADMIN),
  deleteProfessional
);

// ? Los profesionales no pueden hacer comentarios a otros profesionales.
router.post(
  '/rating',
  validationMiddleware(professionalRatingSchema),
  permit(roles.USER, roles.ADMIN, roles.SUPER_ADMIN),
  createProfessionalRating
);
router.delete(
  '/rating/:id',
  permit(roles.ADMIN, roles.SUPER_ADMIN),
  deleteProfessionalRating
);

router.post(
  '/:id/experience',
  validationMiddleware(experienceSchema),
  permit(roles.PROFESSIONAL),
  addExperience
);
router.put(
  '/:id/experience/:experienceId',
  validationMiddleware(experienceSchema),
  permit(roles.PROFESSIONAL),
  updateExperience
);
router.delete(
  '/:id/experience/:experienceId',
  permit(roles.PROFESSIONAL, roles.ADMIN, roles.SUPER_ADMIN),
  deleteExperience
);

router.use(errorMiddleware);

module.exports = router;
