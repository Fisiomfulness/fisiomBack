const {
  createBlog,
  deleteBlog,
  getAllBlogs,
  getProfessionalBlogs,
  getBlogDetail,
  removeBlog,
  statusBlog,
  updateBlog,
} = require('./blog/index');

const {
  createCategory,
  deleteCategory,
  getCategoryById,
  getCategorys,
} = require('./category/index');

const {
  createComment,
  deleteComment,
  getComment,
  getCommentBlog,
} = require('./blog/comment/index');

const {
  createProduct,
  deleteProduct,
  getAllProduct,
  getProductDetail,
  removeProduct,
  statusProduct,
  updateProduct,
} = require('./product/index');

const {
  createType,
  deleteType,
  getTypeById,
  getTypes,
} = require('./type/index');

const {
  getProfessionals,
  getProfessionalDetail,
  createProfessional,
  statusProfessional,
  updateProfessional,
  deleteProfessional,
  getProfessionalRating,
  createProfessionalRating,
  deleteProfessionalRating,
  checkUserRating,
  addSpecialty,
  removeSpecialty,
  addExperience,
  updateExperience,
  deleteExperience,
} = require('./professional/index');

const {
  getAllQuestions,
  createQuestion,
  respondQuestion,
  deleteQuestion,
} = require('./question/index');

const {
  getAllInterests,
  createInterest,
  deleteInterest,
} = require('./interest/index');

const { sendEmail } = require('./mail/index');

const {
  createAppointment,
  getAppointments,
  updateAppointment,
  deleteAppointment,
} = require('./appointment/index');

module.exports = {
  createBlog,
  deleteBlog,
  getAllBlogs,
  getProfessionalBlogs,
  getBlogDetail,
  removeBlog,
  statusBlog,
  updateBlog,
  createCategory,
  deleteCategory,
  getCategoryById,
  getCategorys,
  createComment,
  deleteComment,
  getComment,
  getCommentBlog,
  createProduct,
  deleteProduct,
  getAllProduct,
  getProductDetail,
  removeProduct,
  statusProduct,
  updateProduct,
  createType,
  deleteType,
  getTypeById,
  getTypes,
  getProfessionals,
  createProfessional,
  getProfessionalDetail,
  statusProfessional,
  updateProfessional,
  deleteProfessional,
  getProfessionalRating,
  createProfessionalRating,
  deleteProfessionalRating,
  checkUserRating,
  addSpecialty,
  removeSpecialty,
  addExperience,
  updateExperience,
  deleteExperience,
  getAllQuestions,
  createQuestion,
  respondQuestion,
  deleteQuestion,
  getAllInterests,
  createInterest,
  deleteInterest,
  sendEmail,
  createAppointment,
  getAppointments,
  updateAppointment,
  deleteAppointment,
};
