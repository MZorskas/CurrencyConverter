import React, { useState, useEffect } from 'react';
import './index.scss';
import SwapVertIcon from '@material-ui/icons/SwapVert';
//Components
import Button from '../Button';
import CustomSelect from '../CustomSelect';

const url =
  process.env.NODE_ENV === 'production'
    ? window.location.href
    : 'http://localhost:3001/';

function ConverterContainer({ currencies }) {
  const getCurrency = (abbreviation) =>
    currencies.find((currency) => currency.abbreviation === abbreviation);

  const [fromCurrency, setFromCurrency] = useState('EUR');
  const [toCurrency, setToCurrency] = useState('GBP');
  const [amount, setAmount] = useState('');
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [requestedAmount, setRequestedAmount] = useState(null);
  const [error, setError] = useState(null);

  const convertCurrency = async (from, to, amount) => {
    try {
      const response = await fetch(
        `${url}convert-currency/${from}/${to}/${amount}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      if (!response.ok) {
        const data = await response.json();
        setError(data.failure);
        return;
      }
      const data = await response.json();
      setConvertedAmount(data.responseValue);
      setRequestedAmount(data.requestValue);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (currencies.length !== 0) {
      setFromCurrency(getCurrency(fromCurrency));
      setToCurrency(getCurrency(toCurrency));
    }
  }, [currencies.length]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    if (!amount) return setError('Amount must be filled out');

    if (isNaN(amount)) return setError('Must be a number');

    if (amount <= 0) return setError('Must be a positive number');

    if (fromCurrency === toCurrency)
      return setError('Pick different currencies');

    convertCurrency(fromCurrency.abbreviation, toCurrency.abbreviation, amount);
  };

  const selectFromCurrency = (value) => {
    setFromCurrency(value);
  };

  const selectToCurrency = (value) => {
    setToCurrency(value);
  };

  const swapCurrencies = () => {
    setConvertedAmount(null);
    const to = fromCurrency;
    const from = toCurrency;
    setFromCurrency(from);
    setToCurrency(to);
  };

  return (
    <div className="ConverterContainer">
      <div className="ConverterContainerHeader">
        <h2>Currency Converter</h2>
      </div>
      <form className="ConvertionForm" id="1" onSubmit={handleSubmit}>
        <div className="ConvertionContainer">
          <div className="ConvertionInfo">
            <div className="InputName">
              <h3>From</h3>
            </div>
            <div className="InputRate">
              {fromCurrency.rate && toCurrency.rate && (
                <span>
                  {`1 ${fromCurrency.abbreviation} =
              ${(toCurrency.rate / fromCurrency.rate).toFixed(4)} 
              ${toCurrency.abbreviation}`}
                </span>
              )}
            </div>
          </div>
          <CustomSelect
            value={fromCurrency}
            onChange={selectFromCurrency}
            options={currencies}
          />
          <input
            className="CustomInput"
            type="text"
            placeholder="Amount"
            autoFocus
            maxLength="12"
            onChange={(e) => {
              setAmount(e.target.value);
            }}
          />
        </div>
        {error && <p style={{ width: '60%', color: 'red' }}>{error}</p>}
        <div className="ConvertionContainer">
          <div className="ConvertionInfo">
            <div className="InputName">
              <h3>To</h3>
            </div>

            <div className="InputRate">
              {fromCurrency.rate && toCurrency.rate && (
                <span>
                  {`1 ${toCurrency.abbreviation} =
              ${(fromCurrency.rate / toCurrency.rate).toFixed(4)}
              ${fromCurrency.abbreviation}`}
                </span>
              )}
            </div>
          </div>
          <CustomSelect
            value={toCurrency}
            onChange={selectToCurrency}
            options={currencies}
          />
          <div className="ConvertionOutput">
            <input
              className="CustomInput"
              type="text"
              placeholder="Result"
              value={
                convertedAmount
                  ? `${requestedAmount} ${fromCurrency.abbreviation} = ${convertedAmount} ${toCurrency.abbreviation}`
                  : ''
              }
              readOnly
            />
            <a onClick={swapCurrencies}>
              <SwapVertIcon />
            </a>
          </div>
        </div>
      </form>
      <Button
        onclick={handleSubmit}
        type="submit"
        form="1"
        required={
          !amount || isNaN(amount) || amount <= 0 || fromCurrency === toCurrency
        }
      >
        Convert
      </Button>

      <div className="ConverterContainerFooter">
        <span className="Copyright">Bank of Lithuania exchange rates.</span>
        <span>
          Icons made by
          <a href="https://www.flaticon.com/authors/freepik" title="Freepik">
            Freepik
          </a>
          from
          <a href="https://www.flaticon.com/" title="Flaticon">
            www.flaticon.com
          </a>
        </span>
        <span className="Copyright">© 2020 Currency Converter by MZ</span>
      </div>
    </div>
  );
}

export default ConverterContainer;
