// @ts-check
const Router = require('express-promise-router').default;
const Specialty = require('#src/models/Specialty');
const { matching } = require('#src/util/criteria');

const router = Router();

router.post('/', async (req, res) => {
  const { name } = req.body;
  const response = await Specialty.create({ name });
  res.json(response);
});

router.delete('/', async (req, res) => {
  const { id } = req.body;
  const response = await Specialty.findByIdAndDelete(id);
  res.json(response);
});

router.patch('/', async (req, res) => {
  const { id, new_name } = req.body;
  const response = await Specialty.findByIdAndUpdate(id, { name: new_name });
  res.json(response);
});

/**
 * @typedef {import('#src/util/criteria').Criteria} Criteria
 * @typedef {import('#src/util/criteria').Filter} Filter
 * @typedef {import('#src/util/criteria').Order["orderType"]} OrderType
 */

router.get('/', async (req, res) => {
  const { query: queryParams } = req;
  // NOTE: usar `https://github.com/ljharb/qs` para pasar el filters desde el front
  // qs.stringify({ filters: [{ field: 'name', operator: 'CONTAINS', value: 'a$' }] })
  const { filters, orderBy, order, limit, offset } = queryParams;

  /** @type {Criteria} */
  const query = {
    filters: filters ? /** @type {Filter[]} */ (filters) : [],
    order: {
      orderBy: orderBy ? /** @type {string} */ (orderBy) : '',
      orderType: orderBy ? /** @type {OrderType} */ (order) : 'none',
    },
    limit: Number(limit),
    offset: Number(offset),
  };

  const response = await matching(query, 'Specialty');

  res.json(response);
});

module.exports = router;
