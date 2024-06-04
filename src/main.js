// @ts-check
const { PORT } = require('./config/envConfig');
const { Server } = require('./Server');
const { mongoClientConnect } = require('./db');

async function main() {
  /**
   * NOTE: asegurar que la conexion a la base de datos se realize antes de
   * ejecutar el servidor
   */
  await mongoClientConnect();

  const server = new Server(PORT);
  await server.start();
}

main();
