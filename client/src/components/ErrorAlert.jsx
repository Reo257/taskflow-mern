import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

export const ErrorAlert = ({ message = 'An unexpected error occurred.', onRetry }) => {
  return (
    <div className="state-container" role="alert">
      <AlertCircle className="error-icon" aria-hidden="true" />
      <h3 className="state-title">Something went wrong</h3>
      <p className="state-description">{message}</p>
      {onRetry && (
        <button type="button" className="btn btn-outline" onClick={onRetry}>
          <RefreshCw size={16} />
          Try Again
        </button>
      )}
    </div>
  );
};
