// @ts-check
const Router = require('express-promise-router').default;
const User = require('#src/models/user/User');
const UserSpecialty = require('#src/models/user/UserSpecialty');
const { model } = require('mongoose');

const collectionName = UserSpecialty.modelName;
/** @type {UserSpecialty} */
const collection = model(collectionName);

const router = Router();

router.post('/assignSpecialty', async (req, res) => {
  const { specialty_id, user_id } = req.body;
  const response = await collection.create({ specialty_id, user_id });
  res.json(response);
});

router.get('/getUsers', async (_req, res) => {
  const response = await User.find({}, { id: 1 });
  res.json(response);
});

router.get('/users', async (req, res) => {
  const { user_id } = req.body;
  const response = await collection.find({ user_id }).populate('specialty_id');
  res.json(response);
});

router.get('/specialties', async (req, res) => {
  const { specialty_id } = req.body;
  const response = await collection.find({ specialty_id }).populate('user_id');
  res.json(response);
});

module.exports = router;

