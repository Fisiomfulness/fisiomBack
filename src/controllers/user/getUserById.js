const Profesional = require('../../models/Profesional');
const User = require('../../models/User');

const getUserById = async (req, res) => {
  const { id } = req.params;
  var userResult = null;
  try {
    await Promise.allSettled([
      User.findById(id),
      Profesional.findById(id).populate('professionalScore'),
    ]).then((settElements) => {
      const usersMap = settElements.map((settElement, index) => {
        if (settElement.status === 'fulfilled' && settElement.value) {
          if (index === 0) {
            return { user: settElement.value, model: User };
          } else {
            return { user: settElement.value, model: Profesional };
          }
        } else {
          return null;
        }
      });
      const firstNonNullUser = usersMap.filter((user) => user)[0];
      userResult = firstNonNullUser || null; // Manejar el caso nulo
    });
    // const findUser = await User.findById(id);
    // const findProfesional =
    // await Profesional.findById(id).populate('professionalScore');

    return userResult
      ? res.status(200).json(userResult)
      : res.status(404).send('Usuario no encontrado');
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

module.exports = { getUserById };
