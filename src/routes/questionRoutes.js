const { Router } = require('express');
const { errorMiddleware } = require('#src/middleware/errorMiddleware');
const { asyncHandler } = require('../util/asyncHandler');

const { getAllQuestions, createQuestion } = require('../controllers/index');

const router = Router();

router.get('/', asyncHandler(getAllQuestions));

// ! TODO = VALIDACIÓNES ZOD - POST/PUT CON MIDDLEWARE.
// ! TODO = QUE SOLO USUARIOS REGISTRADOS PUEDAN HACER LAS PREGUNTAS NO IMPORTA EL ROL.
router.post('/create', asyncHandler(createQuestion));

// ! TODO = SOLO PROFESIONALES PUEDAN RESPONDER
router.put('/response', (req, res) => {
  res.status(200).send('Ruta PUT de questions');
});

// ! TODO = SOLO ADMIN Y SUPERADMIN PUEDAN BORRAR PREGUNTAS
router.delete('/:id', (req, res) => {
  res.status(200).send('Ruta DELETE de questions');
});

router.use(errorMiddleware);

module.exports = router;
