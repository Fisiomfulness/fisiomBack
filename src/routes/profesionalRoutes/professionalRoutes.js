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
  approveProfessional,
  declineProfessional,
  getPendingProfessionals,
} = require('../../controllers/index');

const { adminAuthMiddleware } = require('../../middleware/adminMiddleware');

const { upload } = require('#src/config/multerConfig');
const { errorMiddleware } = require('#src/middleware/errorMiddleware');
const { addressMiddleware } = require('#src/middleware/addressMiddleware');
const { decodeTokenUser } = require('#src/middleware/decodeTokenUser');
const {
  validationMiddleware,
} = require('#src/middleware/validationMiddleware');
const { validateFileType } = require('#src/middleware/validateFileType');
const {
  experienceSchema,
  professionalSchema,
  professionalRatingSchema,
} = require('#src/util/validations/index');
const roles = require('#src/util/roles');
const authAll = require('#src/middleware/authAll');
const permit = require('#src/middleware/rolesMiddleware');

const getAvailability = require('#src/controllers/availability/getAvailability');
const updateAvailability = require('#src/controllers/availability/updateAvailability');

const router = Router();

router.get('/', decodeTokenUser, getProfessionals);

// Obtener disponibilidad
router.get('/availability/:userId', getAvailability);

// Actualizar disponibilidad
router.post('/availability/:userId', updateAvailability);

router.get('/detail/:id', decodeTokenUser, getProfessionalDetail);

router.get('/rating/:professional_id', getProfessionalRating);
router.get('/rating/:professional_id/:user_id/hasCommented', checkUserRating);

router.post('/create', addressMiddleware, createProfessional);

// ? Rutas para agregar o quitar specialties
router.post('/:profesional_id/specialty/:specialty_id', addSpecialty);
router.delete('/:profesional_id/specialty/:specialty_id', removeSpecialty);

// Middleware para autorizacion
router.use(authAll);

// ? No actualiza contraseña [apropósito]
router.put(
  '/update/:id',
  upload,
  validateFileType('image'),
  addressMiddleware,
  validationMiddleware(professionalSchema, 'update'),
  permit(roles.PROFESSIONAL, roles.ADMIN, roles.SUPER_ADMIN),
  updateProfessional,
);
router.patch(
  '/status/:id',
  permit(roles.ADMIN, roles.SUPER_ADMIN),
  statusProfessional,
);
// ! Agregar rol professional si se añade funcionalidad para eliminar propia cuenta.
router.delete(
  '/delete/:id',
  permit(roles.ADMIN, roles.SUPER_ADMIN),
  deleteProfessional,
);

// Ruta para que el administrador apruebe a un profesional
router.patch(
  '/approve/:professionalId',
  permit(roles.ADMIN, roles.SUPER_ADMIN),
  approveProfessional,
);

//Ruta para que el administrador desapruebe a un profesional
router.patch(
  '/disapprove/:professionalId',
  permit(roles.ADMIN, roles.SUPER_ADMIN),
  declineProfessional,
);

// Ruta para obtener profesionales pendientes de aprobación
router.get(
  '/pending',
  permit(roles.ADMIN, roles.SUPER_ADMIN),
  getPendingProfessionals,
);

// ? Los profesionales no pueden hacer comentarios a otros profesionales.
router.post(
  '/rating',
  validationMiddleware(professionalRatingSchema),
  permit(roles.USER, roles.ADMIN, roles.SUPER_ADMIN),
  createProfessionalRating,
);
router.delete(
  '/rating/:id',
  permit(roles.ADMIN, roles.SUPER_ADMIN),
  deleteProfessionalRating,
);

router.post(
  '/:id/experience',
  validationMiddleware(experienceSchema),
  permit(roles.PROFESSIONAL),
  addExperience,
);
router.put(
  '/:id/experience/:experienceId',
  validationMiddleware(experienceSchema),
  permit(roles.PROFESSIONAL),
  updateExperience,
);
router.delete(
  '/:id/experience/:experienceId',
  permit(roles.PROFESSIONAL, roles.ADMIN, roles.SUPER_ADMIN),
  deleteExperience,
);

router.use(errorMiddleware);

module.exports = router;
