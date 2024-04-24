const Profesional = require('#src/models/Profesional');

const getProfessionalScore = async (req, res) => {
  const { id } = req.params;

  try {
    const findProfesional = await Profesional.findById(id)
      .select('professionalScore')
      .populate('professionalScore');

    return findProfesional
      ? res.status(200).json({ findProfesional })
      : res.status(404).send('Usuario no encontrado');
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

module.exports = getProfessionalScore;
