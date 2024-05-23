const { NotFoundError } = require('#src/util/errors');
const Question = require('#src/models/Question');

const deleteQuestion = async (req, res) => {
  const { id } = req.params;

  const deletedQuestion = await Question.findByIdAndDelete(id);
  if (!deletedQuestion) throw new NotFoundError('Pregunta no encontrada');

  res.status(200).json({ deletedQuestion, message: 'eliminado correctamente' });
};

module.exports = {
  deleteQuestion,
};
