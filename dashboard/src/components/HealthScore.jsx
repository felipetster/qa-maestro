import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Activity, TrendingUp, TrendingDown, Minus, AlertTriangle } from 'lucide-react';

export default function HealthScore() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHealthScore();
  }, []);

  const fetchHealthScore = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:3001/api/health-score');
      setData(response.data);
    } catch (error) {
      console.error('Error fetching health score:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="card health-eip">
        <div className="loading">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="card health-eip">
        <div className="error">Failed to load health score</div>
      </div>
    );
  }

  const getTrendIcon = () => {
    if (data.trend.direction === 'improving') return <TrendingUp size={16} />;
    if (data.trend.direction === 'declining') return <TrendingDown size={16} />;
    return <Minus size={16} />;
  };

  const getTrendLabel = () => {
    if (data.trend.direction === 'improving') return 'Improving ↑';
    if (data.trend.direction === 'declining') return 'Declining ↓';
    return 'Stable →';
  };

  const getComponentColor = (color) => {
    const colors = {
      emerald: '#10b981',
      teal: '#14b8a6',
      blue: '#3b82f6',
      yellow: '#f59e0b',
      red: '#ef4444'
    };
    return colors[color] || colors.blue;
  };

  // Pega o insight mais importante
  const primaryInsight = data.insights && data.insights.length > 0 ? data.insights[0] : null;

  return (
    <div className="card health-eip">
      {/* Header Compacto */}
      <div className="health-header">
        <div className="health-header-left">
          <Activity size={18} />
          <h3>Test Suite Health</h3>
        </div>
        <div className={`health-trend-mini trend-${data.trend.direction}`}>
          {getTrendIcon()}
          <span>{getTrendLabel()}</span>
        </div>
      </div>

      {/* Score Grande */}
      <div className="health-score-large">
        <span className="score-number">{data.score}</span>
        <span className="score-max">/100</span>
      </div>

      {/* Primary Insight - DESTAQUE */}
      {primaryInsight && (
        <div className="health-primary-insight">
          <div className="insight-header">
            <AlertTriangle size={18} />
            <span>Primary Insight</span>
          </div>
          <div className="insight-message">{primaryInsight.message}</div>
          {primaryInsight.detail && (
            <div className="insight-detail">{primaryInsight.detail}</div>
          )}
        </div>
      )}

   {/* Mini Sparkline */}
      {data.trend.data && data.trend.data.length > 0 && (
        <div className="health-mini-sparkline">
          <span className="sparkline-title">Trend (7 days)</span>
          <svg 
            viewBox="0 0 1000 100" 
            className="sparkline-mini" 
            preserveAspectRatio="none"
            style={{ marginTop: '10px' }}
          >
            <polyline
              points={data.trend.data.map((d, i) => {
                // X vai de 0 a 1000 (preenchendo a tela toda)
                const x = (i / (data.trend.data.length - 1)) * 1000;
                // Y vai de 10 a 90 (invertido porque no SVG o 0 é no topo)
                // Isso dá respiro em cima e embaixo para a linha não cortar
                const y = 100 - d.score; 
                return `${x},${y}`;
              }).join(' ')}
              fill="none"
              stroke="var(--primary-light, #3b82f6)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke" 
            />
          </svg>
        </div>
      )}
      {/* Signals como Badges */}
      {data.signals && data.signals.length > 0 && (
        <div className="health-signals-badges">
          <div className="section-title">Signals</div>
          <div className="signals-grid">
            {data.signals.map((signal, index) => (
              <div key={index} className={`signal-badge signal-${signal.type}`}>
                {signal.message}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Components Compactos */}
      {data.components && data.components.length > 0 && (
        <div className="health-components-compact">
          <div className="section-title">Components</div>
          {data.components.map((component, index) => (
            <div key={index} className="component-row">
              <span className="component-name">{component.name}</span>
              <div className="component-bar-mini">
                <div 
                  className="bar-fill"
                  style={{ 
                    width: `${component.score}%`,
                    background: getComponentColor(component.color)
                  }}
                />
              </div>
              <span className="component-score">{component.score}%</span>
            </div>
          ))}
        </div>
      )}

      {/* Recommended Actions Compactas */}
      {data.actions && data.actions.length > 0 && (
        <div className="health-actions-compact">
          <div className="section-title">Recommended Actions</div>
          {data.actions.slice(0, 2).map((action, index) => (
            <div key={index} className="action-row">
              → {action.action}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}