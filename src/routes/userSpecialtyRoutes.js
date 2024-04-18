// @ts-check
const { Router } = require('express');
const { errorHandler } = require('#src/util/errorHandler');
const UserSpecialty = require('#src/models/UserSpecialty');
const User = require('#src/models/User');

const router = Router();

router.post('/assignSpecialty', async (req, res, next) => {
  const { specialty_id, user_id } = req.body;
  try {
    const response = await UserSpecialty.create({ specialty_id, user_id });
    res.json(response);
  } catch (error) {
    next(error);
  }
});

router.get('/getUsers', async (req, res, next) => {
  try {
    const response = await User.find({}, { id: 1 });
    res.json(response);
  } catch (error) {
    next(error);
  }
});

router.get('/users', async (req, res, next) => {
  const { user_id } = req.body;
  try {
    const response = await UserSpecialty.find({ user_id }).populate(
      'specialty_id',
    );
    res.json(response);
  } catch (error) {
    next(error);
  }
});

router.get('/specialties', async (req, res, next) => {
  const { specialty_id } = req.body;
  try {
    const response = await UserSpecialty.find({ specialty_id }).populate(
      'user_id',
    );
    res.json(response);
  } catch (error) {
    next(error);
  }
});

router.use(errorHandler);

module.exports = router;
