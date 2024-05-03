// @ts-check
const Router = require('express-promise-router').default;
const { Specialty } = require('#src/models/Specialty');
const {
  MongoSpecialtyRepository,
} = require('#src/modules/specialty/adapters/MongoSpecialtyRepository');
const { CriteriaQuery } = require('#src/util/criteria/criteria');

/**
 * @typedef
 *   {import('#src/modules/specialty/models/SpecialtyRepository').SpecialtyRepository}
 * SpecialtyRepository
 */

/** @type {SpecialtyRepository} */
const specialtyRepository = new MongoSpecialtyRepository();

const router = Router();

router.post('/', async (req, res) => {
  const { name } = req.body;

  const response = await specialtyRepository.create(name);

  res.json(response);
});

router.delete('/', async (req, res) => {
  const { id } = req.body;

  const response = await specialtyRepository.delete(id);

  res.json(response);
});

router.patch('/', async (req, res) => {
  const { id, name } = req.body;

  const specialty = new Specialty({ id: id, name: name });
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
