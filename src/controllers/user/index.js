const { createUser } = require('./createUser');
const { deleteUser } = require('./deleteUser');
const { getDetail } = require('./getDetail');
const { getUsers, getUserById } = require('./getUser');
const { statusUser } = require('./statusUser');
const { updateUser } = require('./updateUser');

module.exports = {
  createUser,
  deleteUser,
  getDetail,
  getUsers,
  getUserById,
  statusUser,
  updateUser,
  getUserById,
};
