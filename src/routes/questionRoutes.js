const { Router } = require('express');
const { errorMiddleware } = require('#src/middleware/errorMiddleware');
const { asyncHandler } = require('../util/asyncHandler');
const { validationMiddleware } = require('../middleware/validationMiddleware');
const {
  questionSchema,
  questionResponseSchema,
} = require('../util/validationSchemas');

const {
  getAllQuestions,
  createQuestion,
  respondQuestion,
} = require('../controllers/index');

const router = Router();

router.get('/', asyncHandler(getAllQuestions));

// ! TODO = QUE SOLO USUARIOS REGISTRADOS PUEDAN HACER LAS PREGUNTAS NO IMPORTA EL ROL.
router.post(
  '/create',
  validationMiddleware(questionSchema),
  asyncHandler(createQuestion)
);

// ! TODO = SOLO PROFESIONALES PUEDAN RESPONDER
router.put(
  '/response/:id',
  validationMiddleware(questionResponseSchema, 'update'),
  asyncHandler(respondQuestion)
);

// ! TODO = SOLO ADMIN Y SUPERADMIN PUEDAN BORRAR PREGUNTAS
router.delete('/:id', (req, res) => {
  res.status(200).send('Ruta DELETE de questions');
});

router.use(errorMiddleware);

module.exports = router;
