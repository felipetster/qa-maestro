import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
// 1. Importando o idioma
import { useLanguage } from '../contexts/LanguageContext';

export default function TestStabilityMap() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // 2. Trazendo a ferramenta de tradução
  const { t } = useLanguage();

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
        {/* TRADUZIDO */}
        <h3>{t('testStabilityTitle')}</h3>
        <span className="stability-total">{total} {t('totalTestsLabel')}</span>
      </div>

      {/* Visual Bar */}
      <div className="stability-bar">
        <div 
          className="stability-segment stable"
          style={{ width: `${stablePercent}%` }}
          title={`${data.stable} ${t('stableTests')}`}
        />
        <div 
          className="stability-segment flaky"
          style={{ width: `${flakyPercent}%` }}
          title={`${data.flaky} ${t('flakyTests')}`}
        />
        <div 
          className="stability-segment failing"
          style={{ width: `${failingPercent}%` }}
          title={`${data.failing} ${t('failingTests')}`}
        />
      </div>

      {/* Metrics */}
      <div className="stability-metrics">
        <div className="stability-metric">
          <CheckCircle size={18} className="icon-success" />
          <div className="metric-content">
            {/* TRADUZIDO */}
            <div className="metric-label">{t('stableTests')}</div>
            <div className="metric-value">{data.stable}</div>
          </div>
        </div>

        <div className="stability-metric">
          <AlertTriangle size={18} className="icon-warning" />
          <div className="metric-content">
            {/* TRADUZIDO */}
            <div className="metric-label">{t('flakyTests')}</div>
            <div className="metric-value">{data.flaky}</div>
          </div>
        </div>

        <div className="stability-metric">
          <XCircle size={18} className="icon-danger" />
          <div className="metric-content">
            {/* TRADUZIDO */}
            <div className="metric-label">{t('failingTests')}</div>
            <div className="metric-value">{data.failing}</div>
          </div>
        </div>
      </div>

      {/* Flaky Test Index */}
      <div className="flaky-index">
        {/* TRADUZIDO */}
        <span className="index-label">{t('flakyTestIndex')}</span>
        <span className={`index-value ${data.flakyIndex > 10 ? 'high' : data.flakyIndex > 5 ? 'medium' : 'low'}`}>
          {data.flakyIndex}%
        </span>
      </div>
    </div>
  );
}