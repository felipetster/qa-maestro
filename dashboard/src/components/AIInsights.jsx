import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bot, AlertTriangle, CheckCircle, Zap, Activity, Target } from 'lucide-react';
// 1. Importando o idioma
import { useLanguage } from '../contexts/LanguageContext';

export default function AIInsights({ run }) {
  const [analysis, setAnalysis] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState(null);
  
  // 2. Trazendo a ferramenta e a variável de idioma atual
  const { t, language } = useLanguage();

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (analyzing) {
        e.preventDefault();
        e.returnValue = 'AI analysis in progress...';
        return e.returnValue;
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [analyzing]);

  const handleAnalyze = async () => {
    if (!run || run.failed === 0) return;

    setAnalyzing(true);
    setError(null);

    try {
      // 3. A MÁGICA ACONTECE AQUI: Enviando o idioma atual para o Python!
      const response = await axios.post(`http://localhost:8000/api/analyze/run/${run.run_id}?lang=${language}`);
      setAnalysis(response.data);
    } catch (error) {
      console.error('Error:', error);
      setError(t('connectionError'));
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="card" style={{ marginBottom: '28px', borderTop: '4px solid var(--primary)', background: '#fff' }}>
      <div className="card-header" style={{ borderBottom: '1px solid #f1f5f9', padding: '16px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '16px', margin: 0 }}>
            <Activity size={20} color="var(--primary)" /> {t('engIntelligence')}
          </h3>
          {analysis && (
            <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#64748b', background: '#f1f5f9', padding: '4px 8px', borderRadius: '4px' }}>
              MODEL: LLaMA 3.1
            </span>
          )}
        </div>
      </div>
      
      <div className="card-body" style={{ padding: '20px' }}>
        {!analysis && !analyzing && (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <Bot size={40} color="#cbd5e1" style={{ marginBottom: '12px' }} />
            <p style={{ marginBottom: '20px', color: '#64748b', fontSize: '14px' }}>
              {t('runDiagnosticInfo')} <b>{run.failed} {t('failedTestsText')}</b> {t('toDetectPatterns')}
            </p>
            <button className="btn btn-primary" onClick={handleAnalyze} style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '0 auto' }}>
              <Zap size={16} /> {t('runDiagnostic')}
            </button>
          </div>
        )}

        {analyzing && (
          <div style={{ textAlign: 'center', padding: '30px 0' }}>
            <div className="spinner" style={{ margin: '0 auto 16px', borderColor: '#f1f5f9', borderTopColor: 'var(--primary)' }}></div>
            <p style={{ color: '#475569', fontWeight: 600, fontSize: '14px' }}>
              {t('correlatingData')}
            </p>
          </div>
        )}

        {analysis && (
          <div className="ai-insights-content">
            {/* Taxonomy & Confidence */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <span style={{ 
                padding: '4px 10px', 
                borderRadius: '20px', 
                fontSize: '10px', 
                fontWeight: '900', 
                background: '#e0e7ff', 
                color: '#4338ca',
                border: '1px solid #c7d2fe'
              }}>
                TYPE: {analysis.failure_type || 'UNDEFINED'}
              </span>
              <span style={{ fontSize: '12px', color: '#64748b' }}>
                {t('confidenceLabel')} <b>{analysis.confidence || 0}%</b>
              </span>
            </div>

            {/* Root Cause Technical (Retorno da IA já no idioma certo) */}
            <h4 style={{ margin: '0 0 12px 0', fontSize: '18px', color: '#1e293b' }}>
              {analysis.root_cause || 'Analysis completed.'}
            </h4>

            {/* Evidence Box */}
            <div style={{ padding: '12px', background: '#fffbeb', borderRadius: '6px', border: '1px solid #fef3c7', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px', color: '#92400e', fontSize: '11px', fontWeight: 'bold' }}>
                <Target size={14} /> {t('diagnosticEvidence')}
              </div>
              <code style={{ fontSize: '12px', color: '#b45309', display: 'block', whiteSpace: 'pre-wrap' }}>
                {/* O LLaMA vai devolver essa evidência já em português se o idioma for PT-BR */}
                {analysis.evidence || 'No specific evidence returned by the engine.'}
              </code>
            </div>

            {/* Technical Explanation */}
            <p style={{ fontSize: '14px', color: '#475569', lineHeight: '1.5', marginBottom: '20px' }}>
              {/* Explicação da IA traduzida pelo LLaMA */}
              {analysis.explanation || 'Please review the test logs manually.'}
            </p>

            {/* Recovery Plan */}
            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '12px' }}>
                {t('techRecoveryPlan')}
              </span>
              {analysis.recovery_plan?.length > 0 ? (
                analysis.recovery_plan.map((step, i) => (
                  <div key={i} style={{ display: 'flex', gap: '10px', marginBottom: '8px', fontSize: '13px', color: '#334155' }}>
                    <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>{i + 1}.</span>
                    {/* Passo a Passo da IA */}
                    <span>{step}</span>
                  </div>
                ))
              ) : (
                <div style={{ fontSize: '13px', color: '#64748b' }}>No specific recovery actions provided.</div>
              )}
            </div>

            <button className="btn btn-secondary" style={{ marginTop: '20px', width: '100%' }} onClick={() => setAnalysis(null)}>
              {t('reRunDiagnosticEngine')}
            </button>
          </div>
        )}
        
        {error && (
          <div style={{ marginTop: '16px', padding: '12px', background: '#fef2f2', border: '1px solid #fee2e2', borderRadius: '6px', color: '#dc2626', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertTriangle size={16} /> {error}
          </div>
        )}
      </div>
    </div>
  );
}