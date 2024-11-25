const {indexNewPassword} = require('#src/controllers/newPassword/indexnew_Pass')
const express = require('express')
const router = express.Router()

    
router.post("/reserPassword", indexNewPassword);

module.export= router
