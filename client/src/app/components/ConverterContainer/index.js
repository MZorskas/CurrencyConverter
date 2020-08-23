import React, { useState, useEffect } from 'react';
import './index.scss';
import SwapVertIcon from '@material-ui/icons/SwapVert';
//Components
import Button from '../Button';
import CustomSelect from '../CustomSelect';
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
        `http://localhost:3001/convert-currency/${from}/${to}/${amount}`,
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

    if (!amount || isNaN(amount)) return;

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
      <form className="ConvertionForm" onSubmit={handleSubmit}>
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
        <div className="ConvertionContainer">
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
            required
            maxLength="12"
            onChange={(e) => {
              setAmount(e.target.value);
            }}
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}

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
        <div className="ConvertionContainer">
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
        <Button
          onclick={handleSubmit}
          required={!amount || isNaN(amount) || fromCurrency === toCurrency}
        >
          Convert
        </Button>
      </form>
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
