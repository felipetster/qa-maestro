import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, List, BarChart3 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export default function Sidebar() {
  // 1. Puxando as ferramentas de idioma
  const { language, setLanguage, t } = useLanguage();

  return (
    // Adicionei flex e flex-col para garantir que o botão vá para o fundo da tela
    <aside className="sidebar flex flex-col justify-between h-full min-h-screen">
      
      {/* Parte de Cima: Título e Menu */}
      <div>
        <div className="sidebar-header">
          <h1>QA Maestro</h1>
          <p>{t('dashboard')}</p> {/* Traduzido */}
        </div>
        
        <nav className="sidebar-nav">
          <NavLink to="/" className="nav-item">
            <Home size={20} />
            {/* Como 'Home' não estava no dicionário original, se ele não achar, ele renderiza a própria palavra 'home' */}
            <span>{t('home') || 'Home'}</span> 
          </NavLink>
          
          <NavLink to="/test-runs" className="nav-item">
            <List size={20} />
            <span>{t('testRuns')}</span> {/* Traduzido */}
          </NavLink>
          
          <NavLink to="/analytics" className="nav-item">
            <BarChart3 size={20} />
            <span>{t('analytics')}</span> {/* Traduzido */}
          </NavLink>
        </nav>
      </div>

      {/* Parte de Baixo: Botão de Idioma */}
      <div className="lang-switcher-container">
        <div className="lang-switcher">
          <button 
            onClick={() => setLanguage('en')}
            className={`lang-btn ${language === 'en' ? 'active' : ''}`}
          >
            EN
          </button>
          <button 
            onClick={() => setLanguage('pt-br')}
            className={`lang-btn ${language === 'pt-br' ? 'active' : ''}`}
          >
            PT-BR
          </button>
        </div>
      </div>

    </aside>
  );
}