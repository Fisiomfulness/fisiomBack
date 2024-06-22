const Router = require('express-promise-router').default;
const {
  getProfessionals,
  createProfessional,
  getProfessionalDetail,
  statusProfessional,
  updateProfessional,
  deleteProfessional,
  createProfessionalScore,
  getProfessionalScore,
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
const professionalSchema = require('#src/util/validations/professionalSchema');
const experienceSchema = require('#src/util/validations/experienceSchema');
const roles = require('#src/util/roles');
const authAll = require('#src/middleware/authAll');
const permit = require('#src/middleware/rolesMiddleware');

const router = Router();

router.post('/create', addressMiddleware, createProfessional);
router.get('/', decodeTokenUser, getProfessionals);
router.get('/detail/:id', getProfessionalDetail);

// Rutas para crear y obtener professional_scores (rank, comentario)
router.post('/professional_score', createProfessionalScore);
router.get('/professional_score/:id', getProfessionalScore);

// rutas para agregar o quitar specialties
router.post('/:profesional_id/specialty/:specialty_id', addSpecialty);
router.delete('/:profesional_id/specialty/:specialty_id', removeSpecialty);

router.use(authAll);

router.put(
  '/update/:id',
  upload,
  addressMiddleware,
  validationMiddleware(professionalSchema),
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
