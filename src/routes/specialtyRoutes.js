// @ts-check
const Router = require('express-promise-router').default;
const Specialty = require('#src/models/Specialty');
const {
  matching,
  createCriteriaQuery,
} = require('#src/util/criteria/criteria');
const { model } = require('mongoose');

const collectionName = Specialty.modelName;
/** @type {Specialty} */
const collection = model(collectionName);

const router = Router();

router.post('/', async (req, res) => {
  const { name } = req.body;
  const response = await collection.create({ name });
  res.json(response);
});

router.delete('/', async (req, res) => {
  const { id } = req.body;
  const response = await collection.findByIdAndUpdate(id, { is_deleted: true });
  res.json(response);
});

router.patch('/', async (req, res) => {
  const { id, new_name } = req.body;
  const response = await collection.findByIdAndUpdate(id, { name: new_name });
  res.json(response);
});

router.get('/', async (req, res) => {
  const { query: queryParams } = req;
  // NOTE: usar `https://github.com/ljharb/qs` para `filters` en el front
  // qs.stringify({ filters: [{ field: 'name', operator: 'CONTAINS', value: 'a$' }] })
  const { filters, orderBy, order, limit, offset } = queryParams;

  const query = createCriteriaQuery(
    /** @type {any[]} */ (filters),
    /** @type {string} */ (orderBy),
    /** @type {string} */ (order),
    limit ? Number(limit) : undefined,
    offset ? Number(offset) : undefined,
  );

  const response = await matching(query, collectionName);

  res.json(response);
});

module.exports = router;
