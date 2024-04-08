const {
  createBlog,
  deleteBlog,
  getAllBlogs,
  getBlogDetail,
  removeBlog,
  statusBlog,
  updateBlog 
} = require("./blog/index")


const {
  createCategory,
  deleteCategory,
  getCategoryById,
  getCategorys 
} = require("./category/index")


const {
  createComment,
  deleteComment,
  getComment,
  getCommentBlog 
} = require("./comment/index")


const {
  login,
  recoverAccount 
} = require("./login/index")


const {
  createProduct,
  deleteProduct,
  getAllProduct,
  getProductDetail,
  removeProduct,
  statusProduct,
  updateProduct
} = require("./product/index")


const {
  createType,
  deleteType,
  getTypeById,
  getTypes
} = require("./type/index")


const {
  createUser,
  deleteUser,
  getDetail,
  getUser,
  statusUser,
  updateUser
} = require("./user/index")


const {
  sendEmail
} = require("./mail/index")


module.exports = {
  createBlog,
  deleteBlog,
  getAllBlogs,
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
  recoverAccount,
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
  getUser,
  statusUser,
  updateUser,
  sendEmail
}