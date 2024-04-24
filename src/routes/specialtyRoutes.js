// @ts-check
const { Router } = require('express');
const Specialty = require('#src/models/Specialty');
const { errorHandler } = require('#src/util/errorHandler');
const { matching } = require('#src/util/criteria');

const router = Router();

router.post('/', async (req, res, next) => {
  const { name } = req.body;
  try {
    const response = await Specialty.create({ name });
    res.json(response);
  } catch (error) {
    next(error);
  }
});

router.delete('/', async (req, res, next) => {
  const { id } = req.body;
  try {
    const response = await Specialty.findByIdAndDelete(id);
    res.json(response);
  } catch (error) {
    next(error);
  }
});

router.patch('/', async (req, res, next) => {
  const { id, new_name } = req.body;
  try {
    const response = await Specialty.findByIdAndUpdate(id, { name: new_name });
    res.json(response);
  } catch (error) {
    next(error);
  }
});

/**
 * @typedef {import('#src/util/criteria').Criteria} Criteria
 * @typedef {import('#src/util/criteria').Filter} Filter
 * @typedef {import('#src/util/criteria').Order["orderType"]} OrderType
 */

router.get('/', async (req, res, next) => {
  const { query: queryParams } = req;
  // NOTE: usar `https://github.com/ljharb/qs` para pasar el filters desde el front
  // qs.stringify({ filters: [{ field: 'name', operator: 'CONTAINS', value: 'a$' }] })
  const { filters, orderBy, order, limit, offset } = queryParams;

  try {
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
  } catch (error) {
    next(error);
  }
});

router.use(errorHandler);

module.exports = router;
