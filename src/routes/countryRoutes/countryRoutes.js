const { Router } = require('express');
const router = Router();
const {
  getAllCountryCodes,
  createCountryCode,
  editCountryCode,
  deleteCountryCode,
  populateCountryCodes,
} = require('../../controllers/index');

router.get('/', getAllCountryCodes);
router.post('/', createCountryCode);
router.post('/populate', populateCountryCodes);
router.put('/:id', editCountryCode);
router.delete('/:id', deleteCountryCode);

module.exports = router;
