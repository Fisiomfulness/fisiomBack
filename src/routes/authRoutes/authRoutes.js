const { Router } = require('express');
const { errorMiddleware } = require('../../middleware/errorMiddleware');
const { verifyToken } = require('../../controllers/auth/index');
const { refreshToken } = require('#src/controllers/auth/refresh');

const authAll = require('#src/middleware/authAll');



const router = Router();

router.get('/verify-token', authAll, verifyToken);
router.post('/refresh', refreshToken);

router.use(errorMiddleware);

module.exports = router;
