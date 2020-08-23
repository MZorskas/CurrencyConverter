const mongoose = require('mongoose');

const CurrencySchema = new mongoose.Schema({
  nameLt: {
    type: String,
    required: true,
  },
  nameEng: {
    type: String,
    required: true,
  },
  abbreviation: {
    type: String,
    required: true,
    unique: true,
  },
  rateDate: {
    type: Date,
    default: Date.now,
  },
  rate: {
    type: Number,
    required: false,
  },
});

const CurrencyModel = mongoose.model('Currency', CurrencySchema);

module.exports = CurrencyModel;
