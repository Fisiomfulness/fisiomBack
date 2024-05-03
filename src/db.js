const { MONGODB_URL } = require('./config/envConfig');
const mongoose = require('mongoose');

const mongoClientConnect = async () => {
  const mongoClient = await mongoose.connect(MONGODB_URL);

  console.log('Connected to MongoDB');
};

module.exports = { mongoClientConnect };
