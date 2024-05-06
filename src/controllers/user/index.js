const { createUser } = require('./createUser');
const { deleteUser } = require('./deleteUser');
const { getAllUsers } = require('./getAllUsers');
const { getUsers } = require('./getUsers');
const { getUserById } = require('./getUserById');
const { statusUser } = require('./statusUser');
const { updateUser } = require('./updateUser');

module.exports = {
  createUser,
  deleteUser,
  getAllUsers,
  getUsers,
  getUserById,
  statusUser,
  updateUser,
};
