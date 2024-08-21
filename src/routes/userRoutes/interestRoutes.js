const Router = require('express-promise-router').default;
const {
  getAllInterests,
  createInterest,
  deleteInterest,
} = require('../../controllers/index');
const { errorMiddleware } = require('../../middleware/errorMiddleware');
// const { validationMiddleware } = require('../middleware/validationMiddleware');
// const { interestSchema } = require('../util/validations');

const router = Router();
const roles = require('../../util/roles');
const authAll = require('../../middleware/authAll');
const permit = require('../../middleware/rolesMiddleware');

router.get('/', getAllInterests);

router.use(authAll);

router.post(
  '/create',
  permit(roles.ADMIN, roles.SUPER_ADMIN),
  //   validationMiddleware(interestSchema),
  createInterest,
);

router.delete(
  '/delete/:id',
  permit(roles.ADMIN, roles.SUPER_ADMIN),
  deleteInterest,
);

router.use(errorMiddleware);

module.exports = router;
