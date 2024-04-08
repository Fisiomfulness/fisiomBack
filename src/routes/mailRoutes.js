const { Router } = require('express');


const { sendEmail } = require("../controllers/index")


const router = Router();


router.post('/', sendEmail);

module.exports = router;