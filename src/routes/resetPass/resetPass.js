const {indexNewPassword} = require('#src/controllers/newPassword/indexnew_Pass')
const {changePassword} = require('#src/controllers/newPassword/changePassword')
const express = require('express')
const router = express.Router()

    
router.post("/resetPassword", indexNewPassword);
router.post("/changePassword", changePassword);


module.export= router
