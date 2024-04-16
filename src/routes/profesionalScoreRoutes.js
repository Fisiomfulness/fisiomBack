const { Router } = require('express');
const CreateProfesionalScore = require('../controllers/ProfesionalScore/CreateProfesionalScore');

const router = Router();

router.post('/', CreateProfesionalScore);

module.exports = router;
