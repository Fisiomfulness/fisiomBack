const { Router } = require('express');

const authRouter = require('./authRoutes.js');
const user = require('./userRoutes.js');
const blog = require('./blogRoutes.js');
const type = require('./typeRoutes.js');
const login = require('./loginRoutes.js');
const product = require('./productRoutes.js');
const category = require('./categoryRoutes.js');
const mail = require('./mailRoutes.js');
const specialty = require('./specialtyRoutes.js');
const userSpecialtyRoutes = require('./userSpecialtyRoutes.js');
const professional = require('./professionalRoutes.js');
const question = require('./questionRoutes.js');
const interest = require('./interestRoutes.js');
const chatRouter = require('./chatRouter.js');
const appointmentRouter = require('./appointmentRoutes.js');

const router = Router();

router.use('/auth', authRouter);
router.use('/user_specialty', userSpecialtyRoutes);
router.use('/specialty', specialty);
router.use('/users', user);
router.use('/blogs', blog);
router.use('/types', type);
router.use('/login', login);
router.use('/products', product);
router.use('/category', category);
router.use('/mail', mail);
router.use('/professionals', professional);
router.use('/questions', question);
router.use('/interests', interest);
router.use('/chat', chatRouter);
router.use('/appointments', appointmentRouter);

router.get('/logout', (req, res) => {
  res.clearCookie('accessToken');
  res.status(200).json({ message: 'logout with success' });
});

module.exports = router;
