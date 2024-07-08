const Router = require('express-promise-router').default;
const router = Router();

const { validationMiddleware } = require('#src/middleware/validationMiddleware');
const { errorMiddleware } = require('#src/middleware/errorMiddleware');
const { serviceSchema } = require('#src/util/validations/index');

const { createService } = require('#src/controllers/index');

router.post('/', validationMiddleware(serviceSchema), createService);

router.use(errorMiddleware)

module.exports = router;
