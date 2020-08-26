const https = require('https');
const xml2js = require('xml2js');
const parser = new xml2js.Parser({ explicitArray: false });
const currencyController = require('./controllers/currencyController');
const logger = require('./logger');

const fetchCurrencyList = () => {
  https.get(
    'https://www.lb.lt/webservices/FxRates/FxRates.asmx/getCurrencyList?',
    (res) => {
      if (!res.statusCode === 200) {
        logger.error(`Status Code: ${res.statusCode} ${res.statusMessage}`);
        return;
      }

      res.setEncoding('utf8');

      let buffer = '';
      res.on('data', (data) => {
        buffer = buffer + data;
      });

      res.on('end', (data) => {
        logger.info(`Currency list received`);
        let json;
        parser.parseString(buffer, (err, result) => {
          currencyArray = Object.values(result)[0]['CcyNtry'];
          json = JSON.stringify(currencyArray, null, 1);
        });
        const currencyListArray = JSON.parse(json);
        currencyController.updateCurrencyList(currencyListArray);
      });
    }
  );
};
const fetchCurrencyRates = () => {
  https.get(
    'https://www.lb.lt/webservices/FxRates/FxRates.asmx/getCurrentFxRates?tp=',
    (res) => {
      if (!res.statusCode === 200) {
        logger.error(`Status Code: ${res.statusCode} ${res.statusMessage}`);
        return;
      }

      res.setEncoding('utf8');

      let buffer = '';
      res.on('data', (data) => {
        buffer = buffer + data;
      });

      res.on('end', (data) => {
        logger.info(`Currency rates received`);
        let json;
        parser.parseString(buffer, (err, result) => {
          currencyArray = Object.values(result)[0]['FxRate'];
          json = JSON.stringify(currencyArray, null, 1);
        });
        const currencyRatesArray = JSON.parse(json);
        currencyController.updateCurrencyRates(currencyRatesArray);
      });
    }
  );
};

module.exports = { fetchCurrencyRates, fetchCurrencyList };
