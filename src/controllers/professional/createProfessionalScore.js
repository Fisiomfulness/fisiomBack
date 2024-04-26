const Profesional = require('../../models/Profesional');
const ProfessionalScore = require('../../models/ProfessionalScore');

const createProfessionalScore = async (req, res) => {
    
    try {
      const { _user, _profesional, name, description, score } = req.body;
      const profesional = await Profesional.findById(_profesional);
      const newProfessionalScore = new ProfessionalScore({
        _profesional,
        _user,
        name,
        description,
        score,
      });

      let totalComments = profesional.averageScore.totalComments + 1;
      let totalScore = profesional.averageScore.totalScore + score;

      const average = Math.round(totalScore / totalComments);

      const newProfesional = {
        averageScore: {
            totalScore,
            totalComments,
            average,
        },
        };

      await Profesional.findOneAndUpdate({ _id: _profesional }, newProfesional);

      const savedProfessionScore = await newProfessionalScore.save();

      profesional.professionalScore = profesional.professionalScore.concat(
      savedProfessionScore._id,
      );

      profesional.save();

      res.status(201).send(savedProfessionScore);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

module.exports = { createProfessionalScore };