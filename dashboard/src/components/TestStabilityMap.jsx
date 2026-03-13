import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

export default function TestStabilityMap() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStability();
  }, []);

  const fetchStability = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:3001/api/test-stability');
      setData(response.data);
    } catch (error) {
      console.error('Error fetching stability:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="card stability-map">
        <div className="loading">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="card stability-map">
        <div className="error">Failed to load test stability</div>
      </div>
    );
  }

  const total = data.stable + data.flaky + data.failing;
  const stablePercent = (data.stable / total) * 100;
  const flakyPercent = (data.flaky / total) * 100;
  const failingPercent = (data.failing / total) * 100;

  return (
    <div className="card stability-map">
      <div className="stability-header">
        <h3>Test Stability</h3>
        <span className="stability-total">{total} total tests</span>
      </div>

      {/* Visual Bar */}
      <div className="stability-bar">
        <div 
          className="stability-segment stable"
          style={{ width: `${stablePercent}%` }}
          title={`${data.stable} stable tests`}
        />
        <div 
          className="stability-segment flaky"
          style={{ width: `${flakyPercent}%` }}
          title={`${data.flaky} flaky tests`}
        />
        <div 
          className="stability-segment failing"
          style={{ width: `${failingPercent}%` }}
          title={`${data.failing} failing tests`}
        />
      </div>

      {/* Metrics */}
      <div className="stability-metrics">
        <div className="stability-metric">
          <CheckCircle size={18} className="icon-success" />
          <div className="metric-content">
            <div className="metric-label">Stable Tests</div>
            <div className="metric-value">{data.stable}</div>
          </div>
        </div>

        <div className="stability-metric">
          <AlertTriangle size={18} className="icon-warning" />
          <div className="metric-content">
            <div className="metric-label">Flaky Tests</div>
            <div className="metric-value">{data.flaky}</div>
          </div>
        </div>

        <div className="stability-metric">
          <XCircle size={18} className="icon-danger" />
          <div className="metric-content">
            <div className="metric-label">Failing Tests</div>
            <div className="metric-value">{data.failing}</div>
          </div>
        </div>
      </div>

      {/* Flaky Test Index */}
      <div className="flaky-index">
        <span className="index-label">Flaky Test Index:</span>
        <span className={`index-value ${data.flakyIndex > 10 ? 'high' : data.flakyIndex > 5 ? 'medium' : 'low'}`}>
          {data.flakyIndex}%
        </span>
      </div>
    </div>
  );
}