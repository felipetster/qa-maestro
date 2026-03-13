import { useState } from 'react';

export function TaskItem({ task, onToggle, onDelete }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = () => {
    setIsDeleting(true);
    setTimeout(() => onDelete(task.id), 200);
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div
      className={`task-item ${task.status === 'completed' ? 'completed' : ''} ${isDeleting ? 'deleting' : ''}`}
      data-cy="task-item"
    >
      <div className="task-main">
        <input
          type="checkbox"
          className="task-checkbox"
          data-cy="task-checkbox"
          checked={task.status === 'completed'}
          onChange={() => onToggle(task.id)}
        />
        
        <div className="task-content">
          <h3 className="task-title" data-cy="task-title">
            {task.title}
          </h3>
          
          <div className="task-metadata">
            <span className={`priority-badge priority-${task.priority}`}>
              {task.priority}
            </span>
            <span className={`env-badge env-${task.environment}`}>
              {task.environment}
            </span>
            {task.tags.map(tag => (
              <span key={tag} className="tag-badge">
                {tag}
              </span>
            ))}
            <span className="timestamp">
              {formatDate(task.createdAt)}
            </span>
            {task.completedAt && (
              <span className="timestamp completed">
                ✓ {formatDate(task.completedAt)}
              </span>
            )}
          </div>
        </div>
      </div>

      <button
        className="delete-btn"
        data-cy="delete-button"
        onClick={handleDelete}
        aria-label="Delete task"
      >
        ×
      </button>
    </div>
  );
}