const { Router } = require('express');

const authRouter = require('./authRoutes/authRoutes.js');
const user = require('./userRoutes/userRoutes.js');
const blog = require('./blogRoutes/blogRoutes.js');
const type = require('./blogRoutes/typeRoutes.js');
const login = require('./authRoutes/loginRoutes.js');
const product = require('./productRoutes/productRoutes.js');
const category = require('./productRoutes/categoryRoutes.js');
const mail = require('./mailRoutes.js');
const specialty = require('./specialtyRoutes.js');
const professional = require('./professionalRoutes.js');
const question = require('./questionRoutes.js');
const interest = require('./userRoutes/interestRoutes.js');
const chatRouter = require('./chatRouter.js');
const appointmentRouter = require('./appointmentRoutes/appointmentRoutes.js');
const register = require('./authRoutes/register.js');

const router = Router();

router.use('/auth', authRouter);
router.use('/specialty', specialty);
router.use('/users', user);
router.use('/blogs', blog);
router.use('/types', type);
router.use('/login', login);
router.use('/register', register);
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
