const {
  createBlog,
  deleteBlog,
  getAllBlogs,
  getProfessionalBlogs,
  getBlogDetail,
  removeBlog,
  statusBlog,
  updateBlog,
  approveBlog,
  declineBlog,
  getPendingBlogs,
} = require('./blog/index');

const {
  createCategory,
  deleteCategory,
  getCategoryById,
  getCategorys,
} = require('./category/index');

const {
  checkUserComment,
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
  approveProfessional,
  declineProfessional,
  getPendingProfessionals,
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

const {
  createService,
  getAllServices,
  updateService,
  deleteService,
} = require('./service/index');

const { initPurchase, successPurchase } = require('./purchase/index');

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
  checkUserComment,
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
  approveProfessional,
  declineProfessional,
  getPendingProfessionals,
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
  createService,
  getAllServices,
  updateService,
  deleteService,
  updateAppointment,
  deleteAppointment,
  initPurchase,
  successPurchase,
};
