import { Header } from './components/Header';
import { TaskInput } from './components/TaskInput';
import { Filters } from './components/Filters';
import { TaskList } from './components/TaskList';
import { EmptyState } from './components/EmptyState';
import { useTasks } from './hooks/useTasks';
import './styles/variables.css';
import './styles/components.css';

function App() {
  const {
    tasks,
    allTasks,
    filter,
    setFilter,
    searchQuery,
    setSearchQuery,
    isLoading,
    stats,
    addTask,
    toggleTask,
    deleteTask,
    clearCompleted
  } = useTasks();

  const hasCompleted = allTasks.some(t => t.status === 'completed');

  if (isLoading) {
    return (
      <div className="app loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="container">
        <Header stats={stats} />
        
        <TaskInput onAdd={addTask} />
        
        <Filters
          filter={filter}
          onFilterChange={setFilter}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onClearCompleted={clearCompleted}
          hasCompleted={hasCompleted}
        />

        {tasks.length === 0 ? (
          <EmptyState filter={filter} />
        ) : (
          <TaskList
            tasks={tasks}
            onToggle={toggleTask}
            onDelete={deleteTask}
          />
        )}

        <footer className="app-footer" data-cy="remaining-count">
          {stats.active} {stats.active === 1 ? 'task' : 'tasks'} remaining
        </footer>
      </div>
    </div>
  );
}

export default App;