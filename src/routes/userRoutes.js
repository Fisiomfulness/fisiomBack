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
const { getAllUsers } = require('../controllers/user/getAllUsers');

const router = Router();

router.get('/', getUser);
router.get('/users', getAllUsers);

router.get('/detail/:id', getDetail);

router.post('/create', upload, createUser);

router.put('/update/:id', upload, updateUser);

router.patch('/status/:id', statusUser);

// Ruta para eliminar usuarios creados por error o por otros motivos, no borrar
router.delete('/delete/:id', deleteUser);

module.exports = router;
