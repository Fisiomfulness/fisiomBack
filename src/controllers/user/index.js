const { createUser } = require("./createUser")
const { deleteUser } = require("./deleteUser")
const { getDetail } = require("./getDetail")
const { getUser } = require("./getUser")
const { statusUser } = require("./statusUser")
const { updateUser } = require("./updateUser")



module.exports = {
  createUser,
  deleteUser,
  getDetail,
  getUser,
  statusUser,
  updateUser
}