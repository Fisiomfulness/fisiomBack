// @ts-check
const { Router } = require('express');
const Specialty = require('#src/models/Specialty');
const { errorHandler } = require('#src/util/errorHandler');

const router = Router();

router.post('/', async (req, res, next) => {
  const { name } = req.body;
  try {
    const response = await Specialty.create({ name });
    res.json(response);
  } catch (error) {
    next(error);
  }
});

router.delete('/', async (req, res, next) => {
  const { id } = req.body;
  try {
    const response = await Specialty.findByIdAndDelete(id);
    res.json(response);
  } catch (error) {
    next(error);
  }
});

router.patch('/', async (req, res, next) => {
  const { id, new_name } = req.body;
  try {
    const response = await Specialty.findByIdAndUpdate(id, { name: new_name });
    res.json(response);
  } catch (error) {
    next(error);
  }
});

router.get('/', async (_req, res, next) => {
  try {
    const response = await Specialty.find();
    res.json(response);
  } catch (error) {
    next(error);
  }
});

router.use(errorHandler);

module.exports = router;
