// @ts-check
const { default: mongoose } = require('mongoose');
const request = require('supertest');
const qs = require('qs');
const { z } = require('zod');
const { Server } = require('#src/server');

const mongoClientConnect = async () => {
  // NOTE: usar base de datos local, no la de produccion
  await mongoose.connect(
    'mongodb://localhost:27017/test-backend-fisiomfulness',
  );
  console.log('Conectado localmente a MongoDB');
};

const PORT = 3002;
/** @type {Server} */
let server;
/** @type {import('supertest').Agent} */
let agent;

beforeAll(async () => {
  /**
   * NOTE: asegurar que la conexion a la base de datos se realize antes de
   * ejecutar el servidor
   */
  await mongoClientConnect();

  server = new Server(PORT);
  server.start();

  agent = request(server.expressServer);
});

const specialtyResult = z.object({
  name: z.string(),
  id: z.string(),
  createdDate: z.string(),
  updatedDate: z.string(),
});

const specialtyResponse = z.object({
  count: z.number(),
  results: z.any().array(),
});

/**
 * @typedef {import('supertest').Response} Response
 * @typedef {z.infer<typeof specialtyResult>} SpecialtyResult
 * @typedef {z.infer<typeof specialtyResponse>} SpecialtyResponse
 */

afterAll(async () => {
  const collections = mongoose.connection.collections;
  await Promise.all(
    Object.values(collections).map((collection) => collection.deleteMany({})),
  );

  await mongoose.disconnect();
  mongoose.connection.close();

  server.stop();
});

describe('POST /specialty', () => {
  it('deberia crear especialidades', async () => {
    await agent.post('/specialty').send({ name: 'Pediatra' });
    await agent.post('/specialty').send({ name: 'Médico Clínico' });
    await agent.post('/specialty').send({ name: 'Traumatólogo' });
    await agent.post('/specialty').send({ name: 'Nutricionista' });

    const response = await agent.get('/specialty');

    expect(response.body.results).toHaveLength(4);
    expect(response.body.results).toMatchObject([
      { name: 'Nutricionista' },
      { name: 'Traumatólogo' },
      { name: 'Médico Clínico' },
      { name: 'Pediatra' },
    ]);
  });
});

/**
 * @typedef {Omit<Response, 'body'> & {
 *   body: Omit<SpecialtyResponse, "results"> & {
 *   results: SpecialtyResult[],
 * }}} ResponseData
 */
describe('GET /specialty', () => {
  /** @type {ResponseData} */
  let responseData;

  beforeAll(async () => {
    const response = await agent.get('/specialty');
    responseData = response;
  }, 10000);

  it('deberia retornar count y results', async () => {
    expect(() => specialtyResponse.parse(responseData.body)).not.toThrow();
  });

  it('deberia retornar id, name, createdDate y updatedDate en results', async () => {
    expect(() =>
      specialtyResult.parse(responseData.body.results[0]),
    ).not.toThrow();
  });

  it('deberia limitar los resultados', async () => {
    const limit = 1;
    const response = await agent.get(`/specialty?limit=${limit}`);
    const length = response.body.results.length;

    expect(length).toEqual(limit);
  });

  it('deberia desplazar los resultados', async () => {
    const response = await agent.get(`/specialty?offset=1&limit=1`);

    expect(response.body.results[0]).toHaveProperty(
      'id',
      responseData.body.results[1].id,
    );
  });

  it('deberia ordenar los resultados', async () => {
    const response = await agent.get(
      '/specialty?orderBy=createdDate&order=asc&limit=2',
    );
    expect(response.body.results).toHaveLength(2);

    const date1 = new Date(responseData.body.results[0].createdDate);
    const date2 = new Date(responseData.body.results[1].createdDate);

    expect(date1 > date2).toBe(true);
  });

  describe('deberia filtrar', () => {
    describe('por contenido', () => {
      it('deberia filtrar por contenido', async () => {
        const filters = qs.stringify({
          filters: [
            {
              field: 'name',
              operator: 'CONTAINS',
              value: 'Médico Clínico',
            },
          ],
        });
        const response = await agent.get(`/specialty?limit=1&${filters}`);

        expect(response.body.results[0]).toHaveProperty(
          'name',
          'Médico Clínico',
        );
      });
    });

    describe('por expresiones', () => {
      it('filtra las especialidades que terminen con "a"', async () => {
        const filters = qs.stringify({
          filters: [
            {
              field: 'name',
              operator: 'CONTAINS',
              value: 'a$',
            },
          ],
        });
        const response = await agent.get(`/specialty?limit=1&${filters}`);

        expect(response.body.results[0]).toMatchObject({
          name: expect.stringMatching(/a$/),
        });
      });

      it('filtra las especialidades que contengan con "a"', async () => {
        const filters = qs.stringify({
          filters: [
            {
              field: 'name',
              operator: 'CONTAINS',
              value: 'a',
            },
          ],
        });
        const response = await agent.get(`/specialty?limit=1&${filters}`);

        expect(response.body.results[0]).toMatchObject({
          name: expect.stringMatching(/a/),
        });
      });
    });
  });

  it('deberia aplicar multiples filtros', async () => {
    const responseTest = await agent.get(
      '/specialty?orderBy=createdDate&order=asc&limit=2',
    );
    const response = await agent.get(
      '/specialty?orderBy=createdDate&order=asc&limit=2&offset=1',
    );

    expect(response.body.results).toHaveLength(2);

    const date1 = new Date(responseData.body.results[0].createdDate);
    const date2 = new Date(responseData.body.results[1].createdDate);

    expect(date1 > date2).toBe(true);
    expect(response.body.results[0]).toHaveProperty(
      'id',
      responseTest.body.results[1].id,
    );
  });
});

describe('PATCH /specialty', () => {
  it('deberia actualizar una especialidad', async () => {
    const data = await agent.get('/specialty?limit=1');
    const id = data.body.results[0].id;

    await agent.patch('/specialty').send({ id: id, name: 'Test' });

    /** @type {ResponseData} */
    const response = await agent.get('/specialty');
    const verify = response.body.results.find((item) => item.name === 'Test');

    expect(verify).toHaveProperty('name', 'Test');
  });
});

describe('DELETE /specialty', () => {
  it('deberia borrar una especialidad', async () => {
    const data = await agent.get('/specialty?limit=1');
    const id = data.body.results[0].id;

    await agent.delete('/specialty').send({ id: id });

    /** @type {ResponseData} */
    const response = await agent.get('/specialty');
    const verify = response.body.results.find((item) => item.id === id);

    expect(verify).toBeUndefined();
  });
});
