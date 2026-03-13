// dashboard/src/components/HealthScoreCard.jsx

import React, { useState, useEffect } from 'react';
import { Activity, AlertTriangle, TrendingDown, TrendingUp } from 'lucide-react';
import axios from 'axios';

export default function HealthScoreCard() {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHealthScore();
  }, []);

  const fetchHealthScore = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/health-score');
      setHealth(response.data);
    } catch (error) {
      console.error('Error fetching health score:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading"><div className="spinner"></div></div>;
  if (!health) return null;

  const getScoreColor = (score) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'danger';
  };

  const scoreColor = getScoreColor(health.score);

  return (
    <div className={`health-score-card card-${scoreColor}`}>
      <div className="card-header">
        <h3 className="card-title">
          <Activity size={24} style={{ marginRight: 8 }} />
          Test Suite Health
        </h3>
      </div>

      {/* Score visual */}
      <div className="health-score-display">
        <div className="score-circle">
          <svg viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" stroke="#e5e7eb" strokeWidth="10"/>
            <circle 
              cx="50" 
              cy="50" 
              r="45" 
              fill="none" 
              stroke={`var(--${scoreColor})`}
              strokeWidth="10"
              strokeDasharray={`${health.score * 2.83} 283`}
              strokeLinecap="round"
              transform="rotate(-90 50 50)"
            />
          </svg>
          <div className="score-number">{health.score}</div>
        </div>

        <div className="score-trend">
          {health.trend > 0 ? (
            <span className="trend-up">
              <TrendingUp size={20} /> +{health.trend}%
            </span>
          ) : (
            <span className="trend-down">
              <TrendingDown size={20} /> {health.trend}%
            </span>
          )}
          <span className="trend-label">vs last week</span>
        </div>
      </div>

      {/* Breakdown */}
      <div className="health-breakdown">
        <div className="metric">
          <span className="metric-label">Pass Rate</span>
          <div className="metric-bar">
            <div 
              className="metric-fill success" 
              style={{ width: `${health.breakdown.passRate}%` }}
            />
          </div>
          <span className="metric-value">{health.breakdown.passRate}%</span>
        </div>

        <div className="metric">
          <span className="metric-label">Stability</span>
          <div className="metric-bar">
            <div 
              className="metric-fill warning" 
              style={{ width: `${health.breakdown.stabilityScore}%` }}
            />
          </div>
          <span className="metric-value">{health.breakdown.stabilityScore}%</span>
        </div>

        <div className="metric">
          <span className="metric-label">Performance</span>
          <div className="metric-bar">
            <div 
              className="metric-fill primary" 
              style={{ width: `${health.breakdown.performanceScore}%` }}
            />
          </div>
          <span className="metric-value">{health.breakdown.performanceScore}%</span>
        </div>
      </div>

      {/* Critical Issues */}
      {health.criticalIssues.length > 0 && (
        <div className="critical-issues">
          <h4>
            <AlertTriangle size={18} />
            Critical Issues ({health.criticalIssues.length})
          </h4>
          {health.criticalIssues.map((issue, idx) => (
            <div key={idx} className={`issue issue-${issue.severity}`}>
              <div className="issue-message">{issue.message}</div>
              <div className="issue-action">→ {issue.action}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}