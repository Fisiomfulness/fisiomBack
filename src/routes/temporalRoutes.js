const UserSpecialty = require('../models/UserSpecialty');
const User = require('../models/User');

router.post('/deleteSpecialties', async (_req, res, next) => {
  try {
    const response = await Specialty.deleteMany({ name: { $regex: /^test/ } });
    console.log('test', response);
    res.json({ message: response });
  } catch (error) {
    next(error);
  }
});

router.post('/createSpecialties', async (_req, res, next) => {
  try {
    const response = await Specialty.insertMany([
      { name: 'test1' },
      { name: 'test2' },
      { name: 'test3' },
      { name: 'test4' },
    ]);
    console.log('test', response);
    res.json({ message: response });
  } catch (error) {
    next(error);
  }
});

router.post('/assignSpecialty', async (req, res, next) => {
  const { specialty_id, user_id } = req.body;
  console.log({ specialty_id, user_id });
  try {
    const response = await UserSpecialty.insertMany([
      { specialty_id, user_id },
    ]);
    // console.log('test', response);
    res.json({ message: response });
    // res.json({ ok: true });
  } catch (error) {
    next(error);
  }
});

router.post('/getUsers', async (req, res, next) => {
  try {
    const response1 = await User.find({}, { id: 1 }).limit(3);
    const response = response1.map((item) => item.id);
    res.json({ message: response });
  } catch (error) {
    next(error);
  }
});

router.get('/UserSpecialties', async (_req, res, next) => {
  try {
    const response = await UserSpecialty.aggregate().lookup({
      from: 'users',
      localField: 'user_id',
      foreignField: '_id',
      as: 'result',
    });
    // .project({
    //   id: 0,
    //   specialty_id: 1,
    //   result: { name: 1 },
    // });
    console.log('test', response);
    // const filter = response.map((item) =>
    //   item.result.map((i) => ({ name: i.name, specialty_id: i._id })),
    // );
    console.log('test', response);
    res.json({ users: response });
  } catch (error) {
    next(error);
  }
});

router.get('/specialtiesOfEachUser', async (_req, res, next) => {
  try {
    const response = await UserSpecialty.aggregate().lookup({
      from: 'specialty',
      localField: 'specialty_id',
      foreignField: '_id',
      as: 'result',
    });
    // .project({
    //   id: 0,
    //   specialty_id: 1,
    //   result: { name: 1 },
    // });
    console.log('test', response);
    // const filter = response.map((item) =>
    //   item.result.map((i) => ({ name: i.name, specialty_id: i._id })),
    // );
    console.log('test', response);
    res.json({ users: response });
  } catch (error) {
    next(error);
  }
});
