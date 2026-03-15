import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AlertCircle, Layers } from 'lucide-react';
// 1. Importando o idioma
import { useLanguage } from '../contexts/LanguageContext';

export default function FailureClusters() {
  const [clusters, setClusters] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // 2. Chamando a ferramenta
  const { t } = useLanguage();

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

  // Tradutor dinâmico para os textos que vêm do Backend (Node.js)
  const translateApiText = (text) => {
    if (!text) return "";
    const map = {
      "Assertion Mismatch": "Falha de Asserção (Mismatch)",
      "Review expected vs actual values. May indicate data inconsistency or test needs update.": "Revise os valores esperados vs reais. Pode indicar inconsistência de dados ou o teste precisa ser atualizado."
    };
    return map[text] || text;
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

  // Se não houver falhas, mostra a mensagem de sucesso traduzida dinamicamente
  if (clusters.length === 0) {
    return (
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">
            <Layers size={20} style={{ marginRight: 8, display: 'inline' }} />
            {t('failurePatterns')}
          </h3>
        </div>
        <p style={{ color: 'var(--gray-500)', padding: 20, fontWeight: 500 }}>
          {t('noFailurePatterns') || 'Nenhum padrão de falha detectado. Todos os testes estão passando! 🎉'}
        </p>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">
          <Layers size={20} style={{ marginRight: 8, display: 'inline' }} />
          {t('failurePatterns')}
        </h3>
        <span style={{ fontSize: 13, color: 'var(--gray-500)', fontWeight: 600 }}>
          {/* Lógica de Plural usando o dicionário */}
          {clusters.length} {clusters.length > 1 ? t('patternsDetected') : t('patternDetected')}
        </span>
      </div>

      <div className="clusters-grid">
        {clusters.map((cluster, index) => (
          <div key={index} className={`cluster cluster-${cluster.severity || 'medium'}`}>
            <div className="cluster-header">
              <AlertCircle size={18} />
              {/* Traduzindo o título do erro que vem da API */}
              <h4>{translateApiText(cluster.label)}</h4>
              <span className="cluster-count">
                {/* Lógica de Plural para testes */}
                {cluster.count} {cluster.count > 1 ? t('testsWord') : t('testWord')}
              </span>
            </div>

            <div className="cluster-tests">
              {cluster.tests.slice(0, 3).map((test, idx) => (
                <div key={idx} className="test-item">• {test}</div>
              ))}
              {cluster.tests.length > 3 && (
                <div className="test-more">
                  +{cluster.tests.length - 3} {t('more') || 'mais'}
                </div>
              )}
            </div>

            <div className="cluster-action">
              <strong>{t('suggestedFix')}</strong>
              {/* Traduzindo a ação sugerida que vem da API */}
              <p>{translateApiText(cluster.suggestedAction)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}