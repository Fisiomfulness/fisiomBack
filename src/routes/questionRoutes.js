const { Router } = require('express');
const { errorMiddleware } = require('#src/middleware/errorMiddleware');
const { asyncHandler } = require('../util/asyncHandler');
const { validationMiddleware } = require('../middleware/validationMiddleware');
const {
  questionSchema,
  questionResponseSchema,
} = require('../util/validations');

const {
  getAllQuestions,
  createQuestion,
  respondQuestion,
  deleteQuestion,
} = require('../controllers/index');

const router = Router();
const authAll = require('../middleware/authAll');
const permit = require('../middleware/rolesMiddleware');
const roles = require('#src/util/roles');

router.get('/', asyncHandler(getAllQuestions));

router.use(authAll);

router.post(
  '/create',
  validationMiddleware(questionSchema),
  asyncHandler(createQuestion)
);

router.put(
  '/response/:id',
  permit(roles.PROFESSIONAL),
  validationMiddleware(questionResponseSchema, 'update'),
  asyncHandler(respondQuestion)
);

router.delete(
  '/:id',
  permit(roles.ADMIN, roles.SUPER_ADMIN),
  asyncHandler(deleteQuestion)
);

router.use(errorMiddleware);

module.exports = router;
