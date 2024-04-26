// @ts-check
const { default: mongoose } = require('mongoose');
const { server } = require('#src/server');
const { app } = require('#src/app');
const request = require('supertest');
const qs = require('qs');
const { z } = require('zod');

const agent = request(app);

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
  mongoose.connection.close();
  (await server).close();
});

describe('GET /specialty', () => {
  /**
   * @typedef {Omit<Response, 'body'> & {
   *   body: Omit<SpecialtyResponse, "results"> & {
   *   results: SpecialtyResult[],
   * }}} ResponseData
   */

  /** @type {ResponseData} */
  let responseData;

  beforeAll(async () => {
    const response = await agent.get('/specialty');
    responseData = response;
  }, 10000);

  it('deberia responder con un codigo de estado 200', async () => {
    expect(responseData.statusCode).toBe(200);
  });

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

    expect(length).toBeGreaterThanOrEqual(0);
    expect(length).toBeLessThanOrEqual(limit);
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
