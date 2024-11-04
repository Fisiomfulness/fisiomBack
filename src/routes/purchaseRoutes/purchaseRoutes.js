const { Router } = require('express');
const {
    initPurchase,
    successPurchase
} = require('../../controllers/index');
// const { adminAuthMiddleware } = require('../../middleware/adminMiddleware');
const { upload } = require('../../config/multerConfig');
const authAll = require('#src/middleware/authAll');

const router = Router();

router.post('/init', authAll, initPurchase);
router.put('/success', successPurchase);

module.exports = router;