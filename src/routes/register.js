const { Router } = require("express");
const { register } = require("../controllers/register/register");

const router = Router();

router.post("/", register);

module.exports = router;