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
    User.findOne({ email }),
    Professional.findOne({ email }),
  ]);
  return userExists || professionalExists;
};

module.exports = {
  findUserById,
  verifyExistingEmail
};
