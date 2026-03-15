import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTestRun } from '../utils/api';
import Header from '../components/Header';
import AIInsights from '../components/AIInsights';
import { ArrowLeft, CheckCircle, XCircle, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR, enUS } from 'date-fns/locale'; // <-- Idiomas para a data
import { useLanguage } from '../contexts/LanguageContext'; // <-- Nosso Dicionário

export default function RunDetails() {
  const { runId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Puxando o t e o idioma atual
  const { t, language } = useLanguage();

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
        <div className="error">{language === 'pt-br' ? 'Execução não encontrada' : 'Test run not found'}</div>
      </div>
    );
  }

  const { run, cases } = data;

  // Função utilitária porque definimos esse ícone fora do HTML
  const getStatusIcon = (status) => {
    // Aqui usamos um "if" simples porque você não precisa traduzir a palavra 'passed' no código, só o ícone.
    if (status === 'passed') return <CheckCircle size={16} color="var(--success)" />;
    if (status === 'failed') return <XCircle size={16} color="var(--danger)" />;
    return <Clock size={16} color="var(--warning)" />;
  };

  return (
    <div className="main-content">
      <button 
        className="btn btn-secondary" 
        onClick={() => navigate('/test-runs')}
        style={{ marginBottom: 20 }}
      >
        <ArrowLeft size={16} />
        {language === 'pt-br' ? 'Voltar para Execuções' : 'Back to Test Runs'}
      </button>

      <Header 
        title={`${language === 'pt-br' ? 'Execução' : 'Test Run'}: ${run.run_id}`}
        subtitle={`${t('started')} ${formatDistanceToNow(new Date(run.started_at), { 
          addSuffix: true,
          locale: language === 'pt-br' ? ptBR : enUS
        })}`}
      />

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-title">{t('totalTests')}</div>
          <div className="stat-card-value">{run.total_tests}</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-card-title">{t('passed')}</div>
          <div className="stat-card-value" style={{ color: 'var(--success)' }}>
            {run.passed}
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-card-title">{t('failed')}</div>
          <div className="stat-card-value" style={{ color: 'var(--danger)' }}>
            {run.failed}
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-card-title">{t('duration')}</div>
          <div className="stat-card-value">
            {(run.duration_ms / 1000).toFixed(2)}s
          </div>
        </div>
      </div>

      {/* O COMPONENTE DA IA MORA AQUI */}
      <AIInsights run={run} />

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">
            {language === 'pt-br' ? 'Casos de Teste' : 'Test Cases'} ({cases.length})
          </h3>
        </div>
        
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>{t('status')}</th>
                <th>{t('testName')}</th>
                <th>{t('file')}</th>
                <th>{t('duration')}</th>
                <th>{t('error')}</th>
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