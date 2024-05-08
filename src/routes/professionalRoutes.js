const { Router } = require('express');
const {
  getProfessionals,
  createProfessional,
  getProfessionalDetail,
  statusProfessional,
  updateProfessional,
  deleteProfessional,
  createProfessionalScore,
  getProfessionalScore,
  addSpecialty,
  removeSpecialty,
} = require('../controllers/index');
const { addressMiddleware } = require('../middleware/addressMiddleware');
const { decodeTokenUser } = require('#src/middleware/decodeTokenUser');

const router = Router();

router.post('/create', addressMiddleware, createProfessional);
router.get('/', decodeTokenUser, getProfessionals);
router.get('/detail/:id', getProfessionalDetail);


// ojo estamos usando PUT pero ejecuta un PATCH, no requiere todos los campos ni crea uno si no existe
router.put('/update/:id', addressMiddleware, updateProfessional);

// ruta para borrado lógico
router.patch('/status/:id', statusProfessional);

// Ruta para eliminar profesionales creados por error o por otros motivos
router.delete('/delete/:id', deleteProfessional);

// Rutas para crear y obtener professional_scores (rank, comentario)
router.post('/professional_score', createProfessionalScore);
router.get('/professional_score/:id', getProfessionalScore);

// rutas para agregar o quitar specialties
router.post('/:profesional_id/specialty/:specialty_id', addSpecialty);
router.delete('/:profesional_id/specialty/:specialty_id', removeSpecialty);

module.exports = router;
