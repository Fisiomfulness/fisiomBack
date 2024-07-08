const Router = require('express-promise-router').default;
const router = Router();

const { validationMiddleware } = require('#src/middleware/validationMiddleware');
const { errorMiddleware } = require('#src/middleware/errorMiddleware');
const { serviceSchema } = require('#src/util/validations/index');
const authAll = require('#src/middleware/authAll');
const permit = require('#src/middleware/rolesMiddleware');
const roles = require('#src/util/roles');

const {
  createService,
  getAllServices,
  updateService,
  deleteService,
} = require('#src/controllers/index');

router.get('/', getAllServices);

router.use(authAll);

router.put(
  '/:id',
  permit(roles.PROFESSIONAL, roles.ADMIN, roles.SUPER_ADMIN),
  validationMiddleware(serviceSchema, 'update'),
  updateService
);

router.post(
  '/',
  permit(roles.PROFESSIONAL),
  validationMiddleware(serviceSchema),
  createService
);

router.delete(
  '/:id',
  permit(roles.PROFESSIONAL, roles.ADMIN, roles.SUPER_ADMIN),
  deleteService
);

router.use(errorMiddleware);

module.exports = router;
