const Router = require('express-promise-router').default;
const {
  createUser,
  getUsers,
  getAllUsers,
  updateUser,
  statusUser,
  deleteUser,
  getUserById,
  verifyCredentials,
} = require('#src/controllers/user/index');

const { upload } = require('#src/config/multerConfig');
const { addressMiddleware } = require('#src/middleware/addressMiddleware');
const { decodeTokenUser } = require('#src/middleware/decodeTokenUser');
const { validationMiddleware } = require('#src/middleware/validationMiddleware');
const { errorMiddleware } = require('#src/middleware/errorMiddleware');
const userSchema = require('#src/util/validations/userSchema');
const roles = require('#src/util/roles');
const authAll = require('#src/middleware/authAll');
const permit = require('#src/middleware/rolesMiddleware');

const router = Router();

// ? Algunas rutas trabajan solo con el modelo User y otras adicionalmente con Professional
router.get('/', decodeTokenUser, getUsers);
router.get('/all', getAllUsers);
router.get('/detail/:id', getUserById);

router.post('/create', upload, addressMiddleware, createUser);
router.post('/verify-credentials', verifyCredentials);

router.use(authAll);

router.put(
  '/update/:id',
  upload,
  addressMiddleware,
  validationMiddleware(userSchema, 'update'),
  permit(roles.USER, roles.ADMIN, roles.SUPER_ADMIN),
  updateUser
);

router.patch('/status/:id', permit(roles.ADMIN, roles.SUPER_ADMIN), statusUser);

// ! Agregar rol user si se agrega funcionalidad para eliminar propia cuenta.
router.delete(
  '/delete/:id',
  permit(roles.ADMIN, roles.SUPER_ADMIN),
  deleteUser
);

router.use(errorMiddleware);

module.exports = router;
