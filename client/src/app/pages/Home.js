import React, { useEffect, useState } from 'react';
import './index.scss';

// Components
import ConverterContainer from '../components/ConverterContainer';

function Home() {
  const [currencies, setCurrencies] = useState([]);

  const fetchCurrencyList = async () => {
    try {
      const response = await fetch(
        'http://localhost:3001/get-currency-list-with-rates',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      const data = await response.json();
      setCurrencies(data);
      console.log(data);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchCurrencyList();
  }, []);

  return (
    <div className="Home">
      <ConverterContainer currencies={currencies} />
    </div>
  );
}

export default Home;
