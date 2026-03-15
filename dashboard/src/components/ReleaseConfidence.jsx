import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Rocket, CheckCircle, AlertTriangle, XCircle, Shield } from 'lucide-react';
// 1. Importando o idioma
import { useLanguage } from '../contexts/LanguageContext';

export default function ReleaseConfidence() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // 2. Chamando a ferramenta de tradução
  const { t } = useLanguage();

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
  
  // Traduzindo a pílula de risco ("HIGH" para "ALTO", etc)
  const getRiskLevelText = () => {
    const riskRaw = data.confidence >= 80 ? 'LOW' : (data.confidence >= 50 ? 'MEDIUM' : 'HIGH');
    if (riskRaw === 'HIGH') return t('high') || 'HIGH';
    if (riskRaw === 'MEDIUM') return t('medium') || 'MEDIUM';
    if (riskRaw === 'LOW') return t('low') || 'LOW';
    return riskRaw;
  };

  // Função utilitária: Traduz o texto vindo da API se ele existir no nosso dicionário, senão mostra o original.
  // Criamos pequenas chaves dinâmicas baseadas no texto em inglês.
  const translateApiText = (text) => {
    if (!text) return "";
    
    const map = {
      // --- ERROS ---
      "4 blocking test failures": t('blockingFailuresTitle'),
      "Prevents production deployment": t('blockingFailuresDesc'),
      "Pass rate at 60% (target: 90%+)": t('passRateTitle'),
      "Low test coverage or quality issues": t('passRateDesc'),
      "Performance degraded 47%": t('perfDegradedTitle'),
      "Slower test execution": t('perfDegradedDesc'),
      "2 flaky tests detected": t('flakyDetectedTitle'),
      "Unpredictable test results": t('flakyDetectedDesc'),
      "High variance in recent test results": t('highVarianceTitle'),
      "Inconsistent quality signals": t('highVarianceDesc'),
      "Do not deploy to production until critical issues are resolved.": t('recommendationDesc1'),
      
      // --- SUCESSOS (MÁGICA AQUI) ---
      "No failures in last run": t('noFailures'),
      "All tests passing": t('allTestsPassing'),
      "Excellent pass rate": t('excellentPassRate'),
      "High quality signal": t('highQualitySignal'),
      "Safe to deploy. All quality signals are green.": t('safeToDeploy'),
      "Ready now": t('readyNow'),
      "today": t('today')
    };
    
    return map[text] || text;
  };

  return (
    <div className={`card release-confidence release-${levelColor}`}>
      {/* Header */}
      <div className="release-header">
        <div className="release-title">
          <Rocket size={20} />
          {/* TRADUZIDO AQUI */}
          <h3>{t('releaseConfTitle')}</h3>
        </div>
        <button className="btn btn-secondary btn-sm" onClick={fetchConfidence}>
          {t('refresh')}
        </button>
      </div>

      {/* Confidence Score */}
      <div className="confidence-score-section">
        <div className="confidence-number">{data.confidence}</div>
        <div className="confidence-max">/100</div>
      </div>

      {/* Status */}
      <div className={`release-status status-${levelColor}`}>
        {data.ready ? '✓ ' : '✗ '} 
        {data.ready ? (t('ready') || 'READY FOR PRODUCTION') : t('notReady')}
      </div>

      {/* Risk Level Badge */}
      <div className="risk-level-section">
        <span className="risk-label">{t('riskLevel')}:</span>
        <span className={`risk-badge risk-${levelColor}`}>
          {getRiskLevelText()}
        </span>
      </div>

      {/* Risk Factors */}
      {data.riskFactors && data.riskFactors.length > 0 && (
        <div className="risk-factors">
          <div className="section-title">{t('riskFactorsTitle')}</div>
          {data.riskFactors.map((factor, index) => (
            <div key={index} className={`risk-factor risk-${factor.severity}`}>
              <div className="risk-factor-header">
                {getRiskIcon(factor.severity)}
                {/* Traduzindo o que vem do Banco */}
                <span className="risk-message">{translateApiText(factor.message)}</span>
              </div>
              {factor.impact && (
                <div className="risk-impact">{translateApiText(factor.impact)}</div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Recommendation */}
      <div className="release-recommendation">
        <div className="section-title">{t('recommendationTitle')}</div>
        {/* Traduzindo o que vem do Banco */}
        <p>{translateApiText(data.recommendation)}</p>
        
        {data.estimatedTime && (
          <div className="estimated-time">
            <strong>{t('recommendationDesc2').split(':')[0]}:</strong> {data.estimatedTime}
          </div>
        )}
      </div>

      {/* Last Safe Deploy */}
      {data.lastSafeDeploy && (
        <div className="last-safe-deploy">
          <Shield size={14} />
          {/* Quebrando a tradução em duas partes para manter as variáveis dinâmicas */}
          <span>{t('lastSafeDeploy').split(':')[0]}: {data.lastSafeDeploy.label} ({data.lastSafeDeploy.runId})</span>
        </div>
      )}
    </div>
  );
}