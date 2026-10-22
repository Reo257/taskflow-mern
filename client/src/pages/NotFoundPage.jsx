import React from 'react';
import { Link } from 'react-router-dom';
import { FileQuestion, ArrowLeft } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div className="state-container" style={{ margin: '4rem auto', maxWidth: '500px' }}>
      <FileQuestion size={54} color="var(--primary)" style={{ marginBottom: '1rem' }} />
      <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>404 - Page Not Found</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
        The page you are looking for does not exist or has been moved.
      </p>
      <Link to="/" className="btn btn-primary">
        <ArrowLeft size={16} />
        Back to Dashboard
      </Link>
    </div>
  );
};
