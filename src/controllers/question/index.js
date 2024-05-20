const { getAllQuestions } = require('./getAllQuestions');
const { createQuestion } = require('./createQuestion');
const { respondQuestion } = require('./updateQuestion');

module.exports = {
  getAllQuestions,
  createQuestion,
  respondQuestion,
};
