const { BadRequestError, NotFoundError } = require('../../util/errors');
const Profesional = require('../../models/Profesional');
const Question = require('../../models/Question');

const respondQuestion = async (req, res) => {
  const { id } = req.params;
  const { text, professionalId } = req.body;

  if (!(await Profesional.findById(professionalId))) {
    throw new NotFoundError('profesional no encontrado');
  }

  const newData = {
    isAnswered: true,
    answer: {
      text,
      professional: professionalId,
    },
  };
  const updatedQuestion = await Question.findOneAndUpdate({ _id: id }, newData, { new: true });
  if (!updatedQuestion) throw new NotFoundError('pregunta no encontrada');

  res.status(200).json({ updatedQuestion });
};

module.exports = { respondQuestion };
