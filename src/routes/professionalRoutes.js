const { Router } = require('express');
const {
  getProfessionals,
} = require('../controllers/index');

const router = Router();

router.get('/', getProfessionals);

module.exports = router;