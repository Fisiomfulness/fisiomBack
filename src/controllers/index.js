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

const { login } = require('./login/index');

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
  createUser,
  deleteUser,
  getDetail,
  getUsers,
  getUserById,
  statusUser,
  updateUser,
} = require('./user/index');

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
  login,
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
  createUser,
  deleteUser,
  getDetail,
  getUsers,
  getUserById,
  statusUser,
  updateUser,
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
  sendEmail,
};
