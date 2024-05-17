const { Router } = require('express');
const { errorMiddleware } = require('#src/middleware/errorMiddleware');
const { asyncHandler } = require('../util/asyncHandler');

const { getAllQuestions } = require('../controllers/index');

const router = Router();

router.get('/', asyncHandler(getAllQuestions));

router.post('/create', (req, res) => {
  res.status(200).send('Ruta POST de questions');
});

router.delete('/:id', (req, res) => {
  res.status(200).send('Ruta DELETE de questions');
});

router.use(errorMiddleware)

module.exports = router;
