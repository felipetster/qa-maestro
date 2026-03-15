import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Activity, TrendingUp, TrendingDown, Minus, AlertTriangle } from 'lucide-react';
// 1. Importando o idioma
import { useLanguage } from '../contexts/LanguageContext';

export default function HealthScore() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // 2. Chamando a ferramenta de tradução
  const { t } = useLanguage();

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

  // 3. Tradutor Dinâmico para as strings da API
  const translateApiText = (text) => {
    if (!text) return "";
    const map = {
      // Trends e Signals
      "Improving": "Melhorando",
      "Declining": "Piorando",
      "Stable": "Estável",
      "Pass rate stable (93%)": "Taxa de sucesso estável (93%)",
      "Performance stable": "Performance estável",
      "No failures in last run": "Sem falhas na última execução",
      // Componentes
      "Pass Rate": "Taxa de Sucesso",
      "Stability": "Estabilidade",
      "Performance": "Performance",
      // Insights e Ações
      "Failures concentrated in TC003 - Complete a task": "Falhas concentradas no TC003 - Completar uma tarefa",
      "1 failures detected": "1 falha detectada",
      "Monitor next 3 runs for stability": "Monitorar as próximas 3 execuções para estabilidade"
    };
    return map[text] || text;
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
    if (data.trend.direction === 'improving') return `${translateApiText('Improving')} ↑`;
    if (data.trend.direction === 'declining') return `${translateApiText('Declining')} ↓`;
    return `${translateApiText('Stable')} →`;
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
          {/* TRADUZIDO AQUI */}
          <h3>{t('testSuiteHealth')}</h3>
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
            {/* TRADUZIDO AQUI */}
            <span>{t('primaryInsight')}</span>
          </div>
          {/* TRADUZIDO AQUI (API) */}
          <div className="insight-message">{translateApiText(primaryInsight.message)}</div>
          {primaryInsight.detail && (
            <div className="insight-detail">{translateApiText(primaryInsight.detail)}</div>
          )}
        </div>
      )}

   {/* Mini Sparkline */}
      {data.trend.data && data.trend.data.length > 0 && (
        <div className="health-mini-sparkline">
          {/* TRADUZIDO AQUI */}
          <span className="sparkline-title">{t('trend7Days')}</span>
          <svg 
            viewBox="0 0 1000 100" 
            className="sparkline-mini" 
            preserveAspectRatio="none"
            style={{ marginTop: '10px' }}
          >
            <polyline
              points={data.trend.data.map((d, i) => {
                const x = (i / (data.trend.data.length - 1)) * 1000;
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
          {/* TRADUZIDO AQUI */}
          <div className="section-title">{t('signals')}</div>
          <div className="signals-grid">
            {data.signals.map((signal, index) => (
              <div key={index} className={`signal-badge signal-${signal.type}`}>
                {/* TRADUZIDO AQUI (API) */}
                {translateApiText(signal.message)}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Components Compactos */}
      {data.components && data.components.length > 0 && (
        <div className="health-components-compact">
          {/* TRADUZIDO AQUI */}
          <div className="section-title">{t('componentsTitle')}</div>
          {data.components.map((component, index) => (
            <div key={index} className="component-row">
              {/* TRADUZIDO AQUI (API) */}
              <span className="component-name">{translateApiText(component.name)}</span>
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
          {/* TRADUZIDO AQUI */}
          <div className="section-title">{t('recommendedActions')}</div>
          {data.actions.slice(0, 2).map((action, index) => (
            <div key={index} className="action-row">
              {/* TRADUZIDO AQUI (API) */}
              → {translateApiText(action.action)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}