const { Router } = require('express');
const { errorMiddleware } = require('../../middleware/errorMiddleware');
const { verifyToken } = require('../../controllers/auth/index');
const authAll = require('#src/middleware/authAll');

const router = Router();

router.get('/verify-token', authAll, verifyToken);

router.use(errorMiddleware);

module.exports = router;
