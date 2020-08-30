const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');
const schedule = require('node-schedule');
const router = require('./routes/routes');
const logger = require('./logger');
const { fetchCurrencyList, fetchCurrencyRates } = require('./fetch');

mongoose.connect(
  process.env.DB_CONNECTION,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  () => {
    console.log('Connected to DB!');
    if (process.env.NODE_ENV === 'production') {
      fetchCurrencyList();
      fetchCurrencyRates();
    }
  }
);

const app = express();

schedule.scheduleJob('1 0 * * *', () => {
  fetchCurrencyList();
  fetchCurrencyRates();
});

app.use(cors());
app.use(express.json());
app.use(router);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client', 'build', 'index.html'));
  });
}

const port = process.env.PORT || 3001;

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    logger.info(`Starting. Server is running on port: ${port}`);
  });
}
module.exports = app;
