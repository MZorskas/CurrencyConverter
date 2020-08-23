const CurrencyModel = require('../models/currencyModel');
const logger = require('../logger');

updateCurrencyList = async (currenciesArray) => {
  // EUR currency
  let euro = await CurrencyModel.findOne({ abbreviation: 'EUR' });
  if (!euro) {
    CurrencyModel.create({
      abbreviation: 'EUR',
      nameLt: 'Euras',
      nameEng: 'Euro',
    });
    logger.info(`EUR currency created`);
  } else {
    euro = CurrencyModel.updateOne({
      abbreviation: 'EUR',
      nameLt: 'Euras',
      nameEng: 'Euro',
    });
    logger.info(`EUR currency updated`);
  }

  // Other currencies
  currenciesArray.map(async (cur) => {
    let currency = await CurrencyModel.findOne({ abbreviation: cur.Ccy });

    if (!currency) {
      CurrencyModel.create({
        abbreviation: cur.Ccy,
        nameLt: cur['CcyNm'][0]['_'],
        nameEng: cur['CcyNm'][1]['_'],
      });
      logger.info(`${cur.Ccy} currency created`);
    } else {
      currency = await currency.updateOne({
        abbreviation: cur.Ccy,
        nameLt: cur['CcyNm'][0]['_'],
        nameEng: cur['CcyNm'][1]['_'],
      });
      logger.info(`${cur.Ccy} currency updated`);
    }
  });
  logger.info(`Currency list updated`);
};

updateCurrencyRates = async (currenciesRatesArray) => {
  // EUR currency
  let euro = await CurrencyModel.findOne({ abbreviation: 'EUR' });
  if (!euro) {
    logger.error(`EUR currency not found`);
  } else {
    await euro.updateOne({
      rate: 1,
    });
    logger.info(`EUR currency rate updated`);
  }

  // Other currencies
  currenciesRatesArray.map(async (cur) => {
    let curAbbreviation = cur['CcyAmt'][1]['Ccy'];
    let curRate = cur['CcyAmt'][1]['Amt'];
    let currency = await CurrencyModel.findOne({
      abbreviation: curAbbreviation,
    });
    if (!currency) {
      logger.error(`${curAbbreviation} currency not found`);
    } else {
      currency = await currency.updateOne({
        rate: curRate,
      });
      logger.info(`${curAbbreviation} currency rate updated`);
    }
  });
  logger.info(`Currency rates updated`);
};

convertCurrency = async (req, res) => {
  let fromCur = req.params.from;
  let toCur = req.params.to;
  let amount = req.params.amount;
  // let amount = req.body.amount;
  // console.log(fromCur, toCur, amount);
  try {
    let fromCurrency = { rate: 1 };
    let toCurrency = { rate: 1 };
    if (!fromCur || !toCur || !amount)
      return res.status(400).json({ failure: 'All fields must be typed in.' });

    if (amount.length > 12)
      return res
        .status(400)
        .json({ failure: 'Amount must not be longer than 12 numbers.' });

    if (isNaN(amount))
      return res.status(400).json({ failure: 'Must be a number' });
    if (fromCur !== 'EUR') {
      fromCurrency = await CurrencyModel.findOne({
        abbreviation: fromCur,
        rate: { $exists: true },
      });
      // console.log(fromCurrency);

      if (!fromCurrency) {
        logger.error(`${fromCur} currency doesnt exist on our DB`);
        return res
          .status(400)
          .json({ failure: `${fromCur} currency doesnt exist on our DB` });
      }
    }

    if (toCur !== 'EUR') {
      toCurrency = await CurrencyModel.findOne({
        abbreviation: toCur,
        rate: { $exists: true },
      });
      // console.log(toCurrency);
      if (!toCurrency) {
        logger.error(`${toCur} currency doesnt exist on our DB`);
        return res
          .status(400)
          .json({ failure: `${toCur} currency doesnt exist on our DB` });
      }
    }

    let conversionRate = fromCurrency.rate / toCurrency.rate;
    // console.log(conversionRate);
    let responseValue = (amount / conversionRate).toFixed(2);
    logger.info(
      `Currency converted. ${amount} ${fromCur} = ${responseValue} ${toCur}`
    );
    res.json({
      success: `Currency converted: ${amount} ${fromCur} = ${responseValue} ${toCur}`,
      responseValue,
      requestValue: amount,
    });
  } catch (e) {
    logger.error(`Something went wrong`);
    res.status(400).json({ failure: 'Something went wrong', error: e });
  }
};

getCurrencyListWithRates = async (req, res) => {
  try {
    currencyList = await CurrencyModel.find({
      rate: { $exists: true },
    });
    // console.log(currencyList);
    res.json(currencyList);
  } catch (e) {
    logger.error(`Something went wrong`);
    res.status(400).json({ failure: 'Something went wrong', error: e });
  }
};

module.exports = {
  updateCurrencyList,
  updateCurrencyRates,
  convertCurrency,
  getCurrencyListWithRates,
};
