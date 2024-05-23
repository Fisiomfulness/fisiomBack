const { getAllQuestions } = require('./getAllQuestions');
const { createQuestion } = require('./createQuestion');
const { respondQuestion } = require('./updateQuestion');
const { deleteQuestion } = require('./deleteQuestion');

module.exports = {
  getAllQuestions,
  createQuestion,
  respondQuestion,
  deleteQuestion,
};
