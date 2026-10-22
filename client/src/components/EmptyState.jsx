import React from 'react';
import { Inbox, Plus } from 'lucide-react';

export const EmptyState = ({
  title = 'No tasks found',
  description = 'You have not added any tasks yet or none matched your filter criteria.',
  actionText = 'Create your first task',
  onAction,
}) => {
  return (
    <div className="state-container">
      <Inbox className="empty-icon" aria-hidden="true" />
      <h3 className="state-title">{title}</h3>
      <p className="state-description">{description}</p>
      {onAction && (
        <button type="button" className="btn btn-primary" onClick={onAction}>
          <Plus size={16} />
          {actionText}
        </button>
      )}
    </div>
  );
};
