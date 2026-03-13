export function Header({ stats }) {
  return (
    <header className="header">
      <div className="header-content">
        <div>
          <h1 className="header-title">QA Maestro</h1>
          <p className="header-subtitle">Test Task Management</p>
        </div>
        <div className="stats">
          <div className="stat">
            <span className="stat-value">{stats.total}</span>
            <span className="stat-label">Total</span>
          </div>
          <div className="stat">
            <span className="stat-value">{stats.active}</span>
            <span className="stat-label">Active</span>
          </div>
          <div className="stat">
            <span className="stat-value">{stats.completed}</span>
            <span className="stat-label">Done</span>
          </div>
        </div>
      </div>
    </header>
  );
}