import React from 'react';
import './index.scss';

function Button({ onClick, children, required, type, form }) {
  return (
    <button
      type={type}
      form={form}
      className={`Button ${required ? 'Required' : ''}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default Button;
