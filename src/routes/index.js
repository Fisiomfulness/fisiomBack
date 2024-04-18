// @ts-check
const { Router } = require('express');

const user = require('./userRoutes.js');
const blog = require('./blogRoutes.js');
const type = require('./typeRoutes.js');
const comment = require('./commentRoutes.js');
const login = require('./loginRoutes.js');
const product = require('./productRoutes.js');
const category = require('./categoryRoutes.js');
const mail = require('./mailRoutes.js');
const register = require('./register.js');
const specialty = require('./specialtyRoutes.js');
const profesionalScore = require('./profesionalScoreRoutes.js');
const userSpecialtyRoutes = require('./userSpecialtyRoutes.js');
const professional = require('./professionalRoutes.js');

const router = Router();

router.use('/user_specialty', userSpecialtyRoutes);
router.use('/specialty', specialty);
router.use('/users', user);
router.use('/blogs', blog);
router.use('/types', type);
router.use('/comments', comment);
router.use('/login', login);
router.use('/register', register);
router.use('/products', product);
router.use('/category', category);
router.use('/mail', mail);
router.use('/profesional_score', profesionalScore);
router.use('/professionals', professional);

module.exports = router;
