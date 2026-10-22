import React from 'react';
import { Calendar, Edit2, Trash2 } from 'lucide-react';
import { StatusBadge, PriorityBadge } from './StatusBadge';

export const TaskCard = ({ task, onEdit, onDelete }) => {
  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="task-card">
      <div>
        <div className="task-card-header">
          <h4 className="task-title">{task.title}</h4>
          <PriorityBadge priority={task.priority} />
        </div>

        {task.description && (
          <p className="task-description" style={{ marginTop: '0.5rem' }}>
            {task.description}
          </p>
        )}

        {task.tags && task.tags.length > 0 && (
          <div className="task-tags">
            {task.tags.map((tag, idx) => (
              <span key={idx} className="tag-pill">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="task-card-footer">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <StatusBadge status={task.status} />
          {task.dueDate && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem' }}>
              <Calendar size={12} />
              {formatDate(task.dueDate)}
            </span>
          )}
        </div>

        <div className="task-card-actions">
          <button
            type="button"
            className="btn-icon"
            onClick={() => onEdit(task)}
            title="Edit task"
            aria-label={`Edit task ${task.title}`}
          >
            <Edit2 size={16} />
          </button>
          <button
            type="button"
            className="btn-icon"
            style={{ color: 'var(--danger)' }}
            onClick={() => onDelete(task._id)}
            title="Delete task"
            aria-label={`Delete task ${task.title}`}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
