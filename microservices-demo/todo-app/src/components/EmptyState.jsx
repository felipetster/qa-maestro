export function EmptyState({ filter }) {
  const messages = {
    all: {
      title: 'No tasks yet',
      subtitle: 'Create your first test task to get started'
    },
    active: {
      title: 'No active tasks',
      subtitle: 'All tasks are completed'
    },
    completed: {
      title: 'No completed tasks',
      subtitle: 'Complete tasks to see them here'
    }
  };

  const message = messages[filter] || messages.all;

  return (
    <div className="empty-state" data-cy="empty-state">
      <div className="empty-state-icon">✓</div>
      <h3 className="empty-state-title">{message.title}</h3>
      <p className="empty-state-subtitle">{message.subtitle}</p>
    </div>
  );
}