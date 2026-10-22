import React from 'react';
import { Clock, CheckCircle2, AlertTriangle, Flame } from 'lucide-react';

export const StatusBadge = ({ status }) => {
  const normalized = (status || 'pending').toLowerCase();

  switch (normalized) {
    case 'completed':
      return (
        <span className="badge badge-completed">
          <CheckCircle2 size={12} />
          Completed
        </span>
      );
    case 'in-progress':
      return (
        <span className="badge badge-in-progress">
          <Clock size={12} />
          In Progress
        </span>
      );
    case 'pending':
    default:
      return (
        <span className="badge badge-pending">
          <Clock size={12} />
          Pending
        </span>
      );
  }
};

export const PriorityBadge = ({ priority }) => {
  const normalized = (priority || 'medium').toLowerCase();

  switch (normalized) {
    case 'high':
      return (
        <span className="badge badge-high">
          <Flame size={12} />
          High
        </span>
      );
    case 'low':
      return (
        <span className="badge badge-low">
          Low
        </span>
      );
    case 'medium':
    default:
      return (
        <span className="badge badge-medium">
          <AlertTriangle size={12} />
          Medium
        </span>
      );
  }
};
