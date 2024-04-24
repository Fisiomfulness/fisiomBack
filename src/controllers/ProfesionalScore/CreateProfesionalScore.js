const Profesional = require('../../models/Profesional');
const ProfesionalScore = require('../../models/ProfesionalScore');

const CreateProfesionalScore = async (req, res) => {
  const { _user, _profesional, name, description, score } = req.body;
  
  try {
    const profesional = await Profesional.findById(_profesional);
    const newProfesionalScore = new ProfesionalScore({
      _profesional,
      _user,
      name,
      description,
      score,
    });
    const savedProfesionScore = await newProfesionalScore.save();

    profesional.profesionalScore = profesional.profesionalScore.concat(
      savedProfesionScore._id,
    );

    profesional.save();

    res.status(201).send(savedProfesionScore);
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = CreateProfesionalScore;
