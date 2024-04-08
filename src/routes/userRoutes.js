const { Router } = require('express');
const {
  createUser,
  getUser,
  getDetail,
  updateUser,
  statusUser,
  deleteUser,
} = require('../controllers/index');
const { upload } = require('../config/multerConfig');

const router = Router();

router.post('/create', upload, createUser);
router.get('/', getUser);
router.get('/detail/:id', getDetail);
router.put('/update/:id', upload, updateUser);
router.patch('/status/:id', statusUser);

// Ruta para eliminar usuarios creados por error o por otros motivos, no borrar
router.delete('/delete/:id', deleteUser);

module.exports = router;
