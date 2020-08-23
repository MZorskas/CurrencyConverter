import React from 'react';
import './index.scss';

function Button({ onClick, children, required }) {
  return (
    <button
      className={`Button ${required ? 'Required' : ''}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default Button;
