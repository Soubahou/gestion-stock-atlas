import React from 'react';
import { Spinner as BootstrapSpinner } from 'react-bootstrap';

const Spinner = ({ size = 'md', message = 'Chargement...' }) => {
  const spinnerSize = size === 'sm' ? 'sm' : size === 'lg' ? 'lg' : undefined;

  return (
    <div className="text-center py-5">
      <BootstrapSpinner 
        animation="border" 
        role="status" 
        size={spinnerSize}
        className="me-2"
      >
        <span className="visually-hidden">{message}</span>
      </BootstrapSpinner>
      <p className="mt-2 text-muted">{message}</p>
    </div>
  );
};

export default Spinner;