const { createProduct } = require("./createProduct")
const { deleteProduct } = require("./deleteProduct")
const { getAllProduct } = require("./getAllProduct")
const { getProductDetail } = require("./getProductDetail")
const { removeProduct } = require("./removeProduct")
const { statusProduct } = require("./statusProduct")
const { updateProduct } = require("./updateProduct")



module.exports = {
  createProduct,
  deleteProduct,
  getAllProduct,
  getProductDetail,
  removeProduct,
  statusProduct,
  updateProduct
}