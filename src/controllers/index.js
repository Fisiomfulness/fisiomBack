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
  createProfessionalScore,
  getProfessionalScore,
  addSpecialty,
  removeSpecialty,
} = require('./professional/index');

const { getAllQuestions, createQuestion } = require('./question/index');

const { sendEmail } = require('./mail/index');

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
  createProfessionalScore,
  getProfessionalScore,
  addSpecialty,
  removeSpecialty,
  getAllQuestions,
  createQuestion,
  sendEmail,
};
