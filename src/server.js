const { app } = require('./app');
const { PORT } = require('./config/envConfig');
const { mongoClientConnect } = require('./db');

const createServer = async () => {
  const server = await app.listen(PORT);

  console.log(`Server listening on port ${PORT}`);

  await mongoClientConnect();

  return server;
};

const server = createServer();

module.exports = { server };
