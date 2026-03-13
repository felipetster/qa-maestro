import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AlertCircle, Layers } from 'lucide-react';

export default function FailureClusters() {
  const [clusters, setClusters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClusters();
  }, []);

  const fetchClusters = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:3001/api/failure-clusters');
      setClusters(response.data.clusters || []);
    } catch (error) {
      console.error('Error fetching clusters:', error);
      setClusters([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="card">
        <div className="loading">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  if (clusters.length === 0) {
    return (
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">
            <Layers size={20} style={{ marginRight: 8, display: 'inline' }} />
            Failure Patterns
          </h3>
        </div>
        <p style={{ color: 'var(--gray-500)', padding: 20, fontWeight: 500 }}>
          No failure patterns detected. All tests are passing! 🎉
        </p>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">
          <Layers size={20} style={{ marginRight: 8, display: 'inline' }} />
          Failure Patterns
        </h3>
        <span style={{ fontSize: 13, color: 'var(--gray-500)', fontWeight: 600 }}>
          {clusters.length} pattern{clusters.length > 1 ? 's' : ''} detected
        </span>
      </div>

      <div className="clusters-grid">
        {clusters.map((cluster, index) => (
          <div key={index} className={`cluster cluster-${cluster.severity || 'medium'}`}>
            <div className="cluster-header">
              <AlertCircle size={18} />
              <h4>{cluster.label}</h4>
              <span className="cluster-count">{cluster.count} test{cluster.count > 1 ? 's' : ''}</span>
            </div>

            <div className="cluster-tests">
              {cluster.tests.slice(0, 3).map((test, idx) => (
                <div key={idx} className="test-item">• {test}</div>
              ))}
              {cluster.tests.length > 3 && (
                <div className="test-more">
                  +{cluster.tests.length - 3} more
                </div>
              )}
            </div>

            <div className="cluster-action">
              <strong>Suggested Fix:</strong>
              <p>{cluster.suggestedAction}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}