import React from 'react';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { ptBR, enUS } from 'date-fns/locale'; // <-- Importando os idiomas das datas
import { useLanguage } from '../contexts/LanguageContext';

export default function TestRunsList({ runs }) {
  const navigate = useNavigate();
  // Puxando o t e a variável language para saber qual idioma a data vai usar
  const { t, language } = useLanguage();

  if (!runs || runs.length === 0) {
    return <div className="no-data">No test runs found</div>;
  }

  return (
    <div className="card test-runs-list">
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th>{t('runId')}</th>
              <th>{t('status')}</th>
              <th>{t('totalTests')}</th>
              <th>{t('passRate')}</th>
              <th>{t('duration')}</th>
              <th>{t('browser')}</th>
              <th>{t('environment')}</th>
              <th>{t('started')}</th>
            </tr>
          </thead>
          <tbody>
            {runs.map((run) => {
              const passRate = run.total_tests > 0 
                ? Math.round((run.passed / run.total_tests) * 100) 
                : 0;
                
              return (
                <tr 
                  key={run.run_id} 
                  onClick={() => navigate(`/test-runs/${run.run_id}`)}
                  className="clickable-row"
                >
                  <td className="font-mono text-sm">{run.run_id}</td>
                  <td>
                    <span className={`status-badge status-${run.status}`}>
                      {run.status === 'passed' ? t('passed') : (run.status === 'failed' ? t('failed') : run.status)}
                    </span>
                  </td>
                  <td>{run.total_tests} / {run.failed} / {run.passed}</td>
                  <td>
                    <div className="pass-rate-indicator">
                      <div 
                        className={`pass-rate-bar ${passRate === 100 ? 'bg-success' : (passRate > 80 ? 'bg-warning' : 'bg-danger')}`}
                        style={{ width: `${passRate}%` }}
                      ></div>
                      <span>{passRate}%</span>
                    </div>
                  </td>
                  <td>{(run.duration_ms / 1000).toFixed(2)}s</td>
                  <td className="capitalize">{run.browser}</td>
                  <td className="capitalize">{run.environment}</td>
                  <td className="text-gray-500 text-sm">
                    {/* A MÁGICA DA DATA AQUI */}
                    {formatDistanceToNow(new Date(run.started_at), { 
                      addSuffix: true,
                      locale: language === 'pt-br' ? ptBR : enUS 
                    })}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}