const { Router } = require('express');
const user = require('./userRoutes.js')
const blog = require('./blogRoutes.js')
const type = require('./typeRoutes.js')
const comment = require('./commentRoutes.js')
const login = require('./loginRoutes.js')
const product = require('./productRoutes.js')
const category = require('./categoryRoutes.js')
const mail = require("./mailRoutes.js")


const router = Router()


router.use('/users', user);
router.use('/blogs', blog);
router.use('/types', type);
router.use('/comments', comment);
router.use('/login', login);
router.use('/products', product);
router.use('/category', category);
router.use('/mail', mail)

module.exports = router;
