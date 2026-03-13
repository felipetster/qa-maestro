import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTestRun } from '../utils/api';
import Header from '../components/Header';
import AIInsights from '../components/AIInsights';
import { ArrowLeft, CheckCircle, XCircle, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function RunDetails() {
  const { runId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRunDetails();
  }, [runId]);

  const fetchRunDetails = async () => {
    try {
      setLoading(true);
      const response = await getTestRun(runId);
      setData(response.data);
    } catch (error) {
      console.error('Error fetching run details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="main-content">
        <div className="loading">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="main-content">
        <div className="error">Test run not found</div>
      </div>
    );
  }

  const { run, cases } = data;

  const getStatusIcon = (status) => {
    const icons = {
      passed: <CheckCircle size={16} color="var(--success)" />,
      failed: <XCircle size={16} color="var(--danger)" />,
      skipped: <Clock size={16} color="var(--warning)" />
    };
    return icons[status] || icons.skipped;
  };

  return (
    <div className="main-content">
      <button 
        className="btn btn-secondary" 
        onClick={() => navigate('/test-runs')}
        style={{ marginBottom: 20 }}
      >
        <ArrowLeft size={16} />
        Back to Test Runs
      </button>

      <Header 
        title={`Test Run: ${run.run_id}`}
        subtitle={`Started ${formatDistanceToNow(new Date(run.started_at), { addSuffix: true })}`}
      />

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-title">Total Tests</div>
          <div className="stat-card-value">{run.total_tests}</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-card-title">Passed</div>
          <div className="stat-card-value" style={{ color: 'var(--success)' }}>
            {run.passed}
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-card-title">Failed</div>
          <div className="stat-card-value" style={{ color: 'var(--danger)' }}>
            {run.failed}
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-card-title">Duration</div>
          <div className="stat-card-value">
            {(run.duration_ms / 1000).toFixed(2)}s
          </div>
        </div>
      </div>

      {/* MUDANÇA CRUCIAL AQUI: Passando o objeto 'run' inteiro */}
      <AIInsights run={run} />

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Test Cases ({cases.length})</h3>
        </div>
        
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Status</th>
                <th>Test Name</th>
                <th>File</th>
                <th>Duration</th>
                <th>Error</th>
              </tr>
            </thead>
            <tbody>
              {cases.map((testCase, index) => (
                <tr key={index}>
                  <td>{getStatusIcon(testCase.status)}</td>
                  <td><strong>{testCase.test_name}</strong></td>
                  <td>{testCase.test_file}</td>
                  <td>{testCase.duration_ms}ms</td>
                  <td>
                    {testCase.error_message ? (
                      <span style={{ color: 'var(--danger)', fontSize: 12 }}>
                        {testCase.error_message.substring(0, 100)}
                        {testCase.error_message.length > 100 && '...'}
                      </span>
                    ) : (
                      <span style={{ color: 'var(--gray-400)' }}>—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}