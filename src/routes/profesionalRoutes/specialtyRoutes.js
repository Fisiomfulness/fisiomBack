// @ts-check
const Router = require('express-promise-router').default;
const { Specialty } = require('#src/models/profesional/Specialty');
const {
  MongoSpecialtyRepository,
} = require('#src/modules/specialty/adapters/MongoSpecialtyRepository');
const { CriteriaQuery } = require('#src/util/criteria/criteria');

const specialtyRepository = new MongoSpecialtyRepository();

const router = Router();

router.post('/', async (req, res) => {
  const specialty = new Specialty(req.body);
  const response = await specialtyRepository.create(specialty);

  res.json(response);
});

router.delete('/', async (req, res) => {
  const { id } = req.body;

  const response = await specialtyRepository.delete(id);

  res.json(response);
});

router.patch('/', async (req, res) => {
  const specialty = new Specialty(req.body);
  const response = await specialtyRepository.update(specialty);

  res.json(response);
});

router.get('/', async (req, res) => {
  const { query: queryParams } = req;
  /**
   * NOTE: usar `https://github.com/ljharb/qs` para `filters` en el front
   * qs.stringify({ filters: [{ field: 'name', operator: 'CONTAINS', value: 'a$' }] })
   */
  const { filters, orderBy, order, limit, offset } = queryParams;

  // TODO: validar los filtros
  const query = new CriteriaQuery(
    /** @type {any[]} */ (filters) || [],
    /** @type {string} */ (orderBy),
    /** @type {string} */ (order),
    limit ? Number(limit) : undefined,
    offset ? Number(offset) : undefined,
  );

  const response = await specialtyRepository.matching(query);

  res.json(response);
});

module.exports = router;
