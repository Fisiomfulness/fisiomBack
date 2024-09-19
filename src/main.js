// @ts-check
const { PORT } = require('./config/envConfig');
const { Server } = require('./server');
const { mongoClientConnect } = require('./db');
const { createSuperAdmin } = require('./createSuperAdmin');

async function main() {
  /**
   * NOTE: asegurar que la conexion a la base de datos se realize antes de
   * ejecutar el servidor
   */
  await mongoClientConnect();

  await createSuperAdmin();

  const server = new Server(PORT);
  await server.start();
}

main();
