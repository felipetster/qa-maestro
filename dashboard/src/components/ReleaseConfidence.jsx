import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Rocket, CheckCircle, AlertTriangle, XCircle, Shield } from 'lucide-react';

export default function ReleaseConfidence() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConfidence();
  }, []);

  const fetchConfidence = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:3001/api/release-confidence');
      setData(response.data);
    } catch (error) {
      console.error('Error fetching release confidence:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="card release-confidence">
        <div className="loading">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="card release-confidence">
        <div className="error">Failed to load release confidence</div>
      </div>
    );
  }

  // A cor baseia-se na confiança (HIGH confidence = success = Verde)
  const getLevelColor = (level) => {
    const colors = {
      HIGH: 'success',
      MEDIUM: 'warning',
      LOW: 'danger',
      CRITICAL: 'danger'
    };
    return colors[level] || 'warning';
  };

  const getRiskIcon = (severity) => {
    if (severity === 'positive') return <CheckCircle size={16} />;
    if (severity === 'critical' || severity === 'high') return <XCircle size={16} />;
    if (severity === 'medium') return <AlertTriangle size={16} />;
    return <Shield size={16} />;
  };

  const levelColor = getLevelColor(data.level);
  
  // A MÁGICA AQUI: Invertemos a lógica para o texto de risco bater com a nota
  const riskLevelText = data.confidence >= 80 ? 'LOW' : (data.confidence >= 50 ? 'MEDIUM' : 'HIGH');

  return (
    <div className={`card release-confidence release-${levelColor}`}>
      {/* Header */}
      <div className="release-header">
        <div className="release-title">
          <Rocket size={20} />
          <h3>Release Confidence</h3>
        </div>
        <button className="btn btn-secondary btn-sm" onClick={fetchConfidence}>
          Refresh
        </button>
      </div>

      {/* Confidence Score */}
      <div className="confidence-score-section">
        <div className="confidence-number">{data.confidence}</div>
        <div className="confidence-max">/100</div>
      </div>

      {/* Status */}
      <div className={`release-status status-${levelColor}`}>
        {data.ready ? '✓' : '✗'} {data.ready ? 'READY FOR PRODUCTION' : 'NOT READY FOR PRODUCTION'}
      </div>

      {/* Risk Level Badge - TEXTO CORRIGIDO AQUI */}
      <div className="risk-level-section">
        <span className="risk-label">Risk Level:</span>
        <span className={`risk-badge risk-${levelColor}`}>
          {riskLevelText}
        </span>
      </div>

      {/* Risk Factors */}
      {data.riskFactors && data.riskFactors.length > 0 && (
        <div className="risk-factors">
          <div className="section-title">Risk Factors</div>
          {data.riskFactors.map((factor, index) => (
            <div key={index} className={`risk-factor risk-${factor.severity}`}>
              <div className="risk-factor-header">
                {getRiskIcon(factor.severity)}
                <span className="risk-message">{factor.message}</span>
              </div>
              {factor.impact && (
                <div className="risk-impact">{factor.impact}</div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Recommendation */}
      <div className="release-recommendation">
        <div className="section-title">Recommendation</div>
        <p>{data.recommendation}</p>
        {data.estimatedTime && (
          <div className="estimated-time">
            <strong>Est. time to green:</strong> {data.estimatedTime}
          </div>
        )}
      </div>

      {/* Last Safe Deploy */}
      {data.lastSafeDeploy && (
        <div className="last-safe-deploy">
          <Shield size={14} />
          <span>Last safe deploy: {data.lastSafeDeploy.label} ({data.lastSafeDeploy.runId})</span>
        </div>
      )}
    </div>
  );
}