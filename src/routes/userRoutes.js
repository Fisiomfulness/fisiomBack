const { Router } = require('express');
const {
  createUser,
  getUsers,
  getAllUsers,
  updateUser,
  statusUser,
  deleteUser,
  getUserById,
} = require('#src/controllers/user/index');

const { upload } = require('#src/config/multerConfig');
const { addressMiddleware } = require('#src/middleware/addressMiddleware');

const router = Router();

router.post('/create', upload, addressMiddleware, createUser);
router.get('/', getUsers);
router.get('/all', getAllUsers);
router.get('/detail/:id', getUserById);
router.put('/update/:id', upload, addressMiddleware, updateUser);
router.patch('/status/:id', statusUser);

// Ruta para eliminar usuarios creados por error o por otros motivos, no borrar
router.delete('/delete/:id', deleteUser);

module.exports = router;
