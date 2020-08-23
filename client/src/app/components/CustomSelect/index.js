import React from 'react';
import './index.scss';
import Select from 'react-select';

//Flags list
import flags from '../../flags.json';

function CustomSelect({ value, options, onChange }) {
  return (
    <Select
      value={value}
      getOptionLabel={(option) => (
        <div className="CustomLabel">
          <img src={flags[option.abbreviation]} alt="flag" />{' '}
          {`${option.abbreviation} / ${option.nameEng}`}
        </div>
      )}
      getOptionValue={(option) => option.nameEng}
      options={options}
      onChange={onChange}
      classNamePrefix="CustomSelect"
    />
  );
}

export default CustomSelect;
