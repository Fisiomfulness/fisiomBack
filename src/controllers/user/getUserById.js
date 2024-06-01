const { NotFoundError } = require('#src/util/errors');
const Profesional = require('../../models/Profesional');
const User = require('../../models/User');

const getUserById = async (req, res) => {
  const { id } = req.params;

  const [user, professional] = await Promise.all([
    User.findById(id),
    Profesional.findById(id).populate('professionalScore'),
  ]);

  const foundUser = user || professional;
  if (!foundUser) throw new NotFoundError('usuario no encontrado');

  res.status(200).json({ foundUser });
};

module.exports = { getUserById };
