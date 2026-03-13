import { useState, useRef, useEffect } from 'react';

const PRIORITIES = ['low', 'medium', 'high'];
const TAGS = ['e2e', 'regression', 'smoke', 'manual', 'api', 'ui'];
const ENVIRONMENTS = ['dev', 'staging', 'production'];

export function TaskInput({ onAdd }) {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('medium');
  const [selectedTags, setSelectedTags] = useState([]);
  const [environment, setEnvironment] = useState('dev');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = async (e) => {
    e?.preventDefault();

    if (!title.trim()) {
      setError('Task title is required');
      return;
    }

    if (title.trim().length < 3) {
      setError('Task title must be at least 3 characters');
      return;
    }

    setIsSubmitting(true);
    setError('');

    const result = onAdd({
      title: title.trim(),
      priority,
      tags: selectedTags,
      environment
    });

    setTimeout(() => {
      if (result.success) {
        setTitle('');
        setSelectedTags([]);
        setPriority('medium');
        setEnvironment('dev');
      } else {
        setError(result.error);
      }
      setIsSubmitting(false);
    }, 200);
  };

  const toggleTag = (tag) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  return (
    <form className="task-input-form" onSubmit={handleSubmit}>
      <div className="input-group">
        <input
          ref={inputRef}
          type="text"
          className="task-input"
          data-cy="task-input"
          placeholder="Enter test task..."
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            setError('');
          }}
          disabled={isSubmitting}
          maxLength={200}
        />
        <button
          type="submit"
          className="add-button"
          data-cy="add-button"
          disabled={isSubmitting || !title.trim()}
        >
          {isSubmitting ? 'Adding...' : 'Add Task'}
        </button>
      </div>

      {error && (
        <div className="error-message" role="alert">
          {error}
        </div>
      )}

      <div className="task-metadata-inputs">
        <div className="metadata-group">
          <label className="metadata-label">Priority</label>
          <div className="button-group">
            {PRIORITIES.map(p => (
              <button
                key={p}
                type="button"
                className={`priority-btn priority-${p} ${priority === p ? 'active' : ''}`}
                onClick={() => setPriority(p)}
                disabled={isSubmitting}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <div className="metadata-group">
          <label className="metadata-label">Environment</label>
          <select
            className="env-select"
            value={environment}
            onChange={(e) => setEnvironment(e.target.value)}
            disabled={isSubmitting}
          >
            {ENVIRONMENTS.map(env => (
              <option key={env} value={env}>{env}</option>
            ))}
          </select>
        </div>

        <div className="metadata-group">
          <label className="metadata-label">Tags</label>
          <div className="tag-group">
            {TAGS.map(tag => (
              <button
                key={tag}
                type="button"
                className={`tag-btn ${selectedTags.includes(tag) ? 'active' : ''}`}
                onClick={() => toggleTag(tag)}
                disabled={isSubmitting}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>
    </form>
  );
}