// @ts-check
const Router = require('express-promise-router').default;
const UserSpecialty = require('#src/models/UserSpecialty');
const User = require('#src/models/User');

const router = Router();

router.post('/assignSpecialty', async (req, res) => {
  const { specialty_id, user_id } = req.body;
  const response = await UserSpecialty.create({ specialty_id, user_id });
  res.json(response);
});

router.get('/getUsers', async (_req, res) => {
  const response = await User.find({}, { id: 1 });
  res.json(response);
});

router.get('/users', async (req, res) => {
  const { user_id } = req.body;
  const response = await UserSpecialty.find({ user_id }).populate(
    'specialty_id',
  );
  res.json(response);
});

router.get('/specialties', async (req, res) => {
  const { specialty_id } = req.body;
  const response = await UserSpecialty.find({ specialty_id }).populate(
    'user_id',
  );
  res.json(response);
});

module.exports = router;
