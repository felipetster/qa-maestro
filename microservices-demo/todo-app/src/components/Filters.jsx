export function Filters({ filter, onFilterChange, searchQuery, onSearchChange, onClearCompleted, hasCompleted }) {
  return (
    <div className="filters-container">
      <div className="filter-tabs">
        {['all', 'active', 'completed'].map(f => (
          <button
            key={f}
            className={`filter-tab ${filter === f ? 'active' : ''}`}
            onClick={() => onFilterChange(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div className="filter-actions">
        <input
          type="search"
          className="search-input"
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        
        {hasCompleted && (
          <button
            className="clear-completed-btn"
            data-cy="clear-completed"
            onClick={onClearCompleted}
          >
            Clear Completed
          </button>
        )}
      </div>
    </div>
  );
}