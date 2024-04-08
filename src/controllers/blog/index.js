const { createBlog } = require("./createBlog")
const { deleteBlog } = require("./deleteBlog")
const { getAllBlogs } = require("./getAllBlogs")
const { getBlogDetail } = require("./getBlogDetail")
const { removeBlog } = require("./removeBlog")
const { statusBlog } = require("./statusBlog")
const { updateBlog } = require("./updateBlog")


module.exports = {
  createBlog,
  deleteBlog,
  getAllBlogs,
  getBlogDetail,
  removeBlog,
  statusBlog,
  updateBlog
}