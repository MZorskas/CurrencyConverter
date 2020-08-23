const router = require('express').Router();
const currencyController = require('../controllers/currencyController');

router.get(
  '/convert-currency/:from/:to/:amount',
  currencyController.convertCurrency
);
router.get(
  '/get-currency-list-with-rates',
  currencyController.getCurrencyListWithRates
);

module.exports = router;
