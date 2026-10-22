import React from 'react';

export const LoadingSpinner = ({ text = 'Loading data...' }) => {
  return (
    <div className="state-container" role="status" aria-live="polite">
      <div className="spinner"></div>
      <p className="state-title">{text}</p>
      <span className="state-description">Connecting with the API server...</span>
    </div>
  );
};
