const Router = require('express-promise-router').default;
const router = Router();

const { validationMiddleware } = require('#src/middleware/validationMiddleware');
const { errorMiddleware } = require('#src/middleware/errorMiddleware');
const { serviceSchema } = require('#src/util/validations/index');

const {
  createService,
  getAllServices,
  updateService,
  deleteService,
} = require('#src/controllers/index');

router.get('/', getAllServices);

router.put(
  '/:id',
  validationMiddleware(serviceSchema, 'update'),
  updateService
);

router.post('/', validationMiddleware(serviceSchema), createService);

router.delete('/:id', deleteService);

router.use(errorMiddleware);

module.exports = router;
