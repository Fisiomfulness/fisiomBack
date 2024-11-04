// @ts-check
const { PORT } = require('./config/envConfig');
const { Server } = require('./server');
const { mongoClientConnect } = require('./db');
const { createSuperAdmin } = require('./createSuperAdmin');
const { createUploadsFolder } = require('./createUploadsFolder');

async function main() {
  /**
   * NOTE: asegurar que la conexion a la base de datos se realize antes de
   * ejecutar el servidor
   */
  await mongoClientConnect();

  await createSuperAdmin();

  await createUploadsFolder();

  const server = new Server(PORT);
  await server.start();
}

main();
