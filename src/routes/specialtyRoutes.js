const { Router } = require('express');
const Specialty = require('../models/Specialty');
const status = require('http-status');

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

const errorHandler = (err, _req, res, next) => {
  if (res.headersSent) return next(err);

  const error = status.INTERNAL_SERVER_ERROR;

  console.log('\n\x1b[33m' + status[error], err.message + '\x1b[0m');
  console.log('\n' + err.stack + '\n');

  res.status(error).json({ message: status[error] });
};
router.use(errorHandler);

module.exports = router;
