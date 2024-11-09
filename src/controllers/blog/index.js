const { createBlog } = require("./createBlog")
const { deleteBlog } = require("./deleteBlog")
const { getAllBlogs } = require("./getAllBlogs")
const { getProfessionalBlogs } = require("./getProfessionalBlogs");
const { getBlogDetail } = require("./getBlogDetail")
const { removeBlog } = require("./removeBlog")
const { statusBlog } = require("./statusBlog")
const { updateBlog } = require("./updateBlog");
const { approveBlog } = require("./approveBlog");
const { declineBlog } = require("./declineBlog");
const { getPendingBlogs } = require("./getPendingBlogs");


module.exports = {
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
}