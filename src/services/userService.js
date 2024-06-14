const {
  NotFoundError,
  UnauthorizedError,
  BadRequestError,
} = require('#src/util/errors');
const { verifyHashedData } = require('#src/util/hashData');
const User = require('#src/models/User');
const Professional = require('#src/models/Profesional');

const isValidUser = (user) => user instanceof User || user instanceof Professional;

const findUserById = async (id) => {
  const [user, professional] = await Promise.all([
    User.findById(id),
    Professional.findById(id),
  ]);

  const foundUser = user || professional;
  if (!foundUser) throw new NotFoundError('usuario no encontrado');

  return foundUser;
};

const verifyExistingEmail = async (email) => {
  const [userExists, professionalExists] = await Promise.all([
    User.exists({ email }),
    Professional.exists({ email }),
  ]);
  return userExists || professionalExists;
};

const updateUserData = async (user, newData) => {
  if (!isValidUser(user)) {
    throw new Error('El usuario no es una instancia valida de User o Profesional');
  }

  for (const key in newData) {
    let value = newData[key];
    if (key !== 'password') {
      user[key] = value;
    }
  }

  await user.save({ validateModifiedOnly: true });
};

module.exports = {
  findUserById,
  verifyExistingEmail,
  updateUserData,
};
