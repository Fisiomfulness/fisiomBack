const { Router } = require('express');
const {
  getProfessionals,
  createProfessional,
  getProfessionalDetail,
  statusProfessional,
  updateProfessional,
  deleteProfessional
} = require('../controllers/index');

const router = Router();

router.post('/create', createProfessional);
router.get('/', getProfessionals);
router.get('/detail/:id', getProfessionalDetail);

// ojo estamos usando PUT pero ejecuta un PATCH, no requiere todos los campos ni crea uno si no existe
router.put('/update/:id', updateProfessional);

// ruta para borrado lógico
router.patch('/status/:id', statusProfessional);

// Ruta para eliminar profesionales creados por error o por otros motivos
router.delete('/delete/:id', deleteProfessional);

module.exports = router;