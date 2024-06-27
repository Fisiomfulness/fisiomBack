const { BadRequestError, NotFoundError, UnauthorizedError } = require('#src/util/errors');
const { verifyExistingEmail } = require('#src/services/userService');
const { verifyHashedData } = require('#src/util/hashData');

const verifyCredentials = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) throw new BadRequestError('Email o contraseña no proporcionada');

  const foundAccount = await verifyExistingEmail(email);
  if (!foundAccount) throw new NotFoundError('No existe una cuenta registrada con el email proporcionado');

  const passwordMatches = await verifyHashedData(password, foundAccount.password);
  if (!passwordMatches) throw new UnauthorizedError('La contraseña proporcionada es incorrecta');

  res.status(200).json({ message: 'existosamente verificada' });
};

module.exports = {
  verifyCredentials,
};
