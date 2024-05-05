const Profesional = require('../../models/Profesional');
const User = require('../../models/User');

const getUserById = async (req, res) => {
    const { id } = req.params;

    try {
        const findUser = await User.findById(id);
        const findProfesional =
        await Profesional.findById(id).populate('professionalScore');

        return findUser
        ? res.status(200).json({ findUser })
        : findProfesional
            ? res.status(200).json({ findProfesional })
            : res.status(404).send('Usuario no encontrado');
    } catch (error) {
        return res.status(500).json(error.message);
    }
};

module.exports = { getUserById };