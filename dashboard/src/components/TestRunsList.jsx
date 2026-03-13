import React from 'react';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

export default function TestRunsList({ runs, loading }) {
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  const getStatusBadge = (status) => {
    const badges = {
      passed: { className: 'success', icon: CheckCircle, text: 'Passed' },
      failed: { className: 'danger', icon: XCircle, text: 'Failed' },
      running: { className: 'warning', icon: Clock, text: 'Running' }
    };
    
    const badge = badges[status] || badges.running;
    const Icon = badge.icon;
    
    return (
      <span className={`badge ${badge.className}`}>
        <Icon size={12} style={{ marginRight: 4 }} />
        {badge.text}
      </span>
    );
  };

  const calculatePassRate = (passed, total) => {
    if (total === 0) return '0%';
    return `${Math.round((passed / total) * 100)}%`;
  };

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Recent Test Runs</h3>
      </div>
      
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Run ID</th>
              <th>Status</th>
              <th>Tests</th>
              <th>Pass Rate</th>
              <th>Duration</th>
              <th>Browser</th>
              <th>Environment</th>
              <th>Started</th>
            </tr>
          </thead>
          <tbody>
            {runs.map((run) => (
              <tr 
                key={run.run_id} 
                onClick={() => navigate(`/test-runs/${run.run_id}`)}
                style={{ cursor: 'pointer' }}
              >
                <td>
                  <strong>{run.run_id}</strong>
                </td>
                <td>
                  {getStatusBadge(run.status)}
                </td>
                <td>
                  <span style={{ color: 'var(--success)' }}>{run.passed}</span>
                  {' / '}
                  <span style={{ color: 'var(--danger)' }}>{run.failed}</span>
                  {' / '}
                  <span style={{ color: 'var(--gray-600)' }}>{run.total_tests}</span>
                </td>
                <td>
                  <strong>{calculatePassRate(run.passed, run.total_tests)}</strong>
                </td>
                <td>
                  {(run.duration_ms / 1000).toFixed(2)}s
                </td>
                <td>
                  {run.browser || 'N/A'}
                </td>
                <td>
                  <span className={`badge ${run.environment === 'production' ? 'danger' : 'info'}`}>
                    {run.environment || 'dev'}
                  </span>
                </td>
                <td>
                  {run.started_at 
                    ? formatDistanceToNow(new Date(run.started_at), { addSuffix: true })
                    : 'N/A'
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}