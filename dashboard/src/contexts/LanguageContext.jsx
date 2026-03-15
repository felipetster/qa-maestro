import React, { createContext, useState, useContext } from 'react';

// 1. O nosso Dicionário (TUDO JUNTO AGORA)
const translations = {
  en: {
    home: "Home",
    dashboard: "Dashboard",
    testRuns: "Test Runs",
    analytics: "Analytics",
    totalTests: "Total Tests",
    passed: "Passed",
    failed: "Failed",
    duration: "Duration",
    runDiagnostic: "Run Diagnostic", // Atualizado para bater com o botão
    reRunDiagnostic: "Re-run Diagnostic Engine",
    status: "Status",
    testName: "Test Name",
    file: "File",
    error: "Error",
    // --- TELA HOME ---
    loadingDashboard: "Loading dashboard...",
    engPlatform: "Engineering Intelligence Platform",
    passRate: "Pass Rate",
    flakyTests: "Flaky Tests",
    healthScore: "Health Score",
    activeIssues: "Active Issues",
    problemsDetected: "Problems detected automatically",
    testSuiteHealth: "Test Suite Health",
    qualityAssessment: "Quality assessment and insights",
    testStability: "Test Stability Overview",
    riskDetection: "Risk detection and flaky test analysis",
    recentTestRuns: "Recent Test Runs",
    executionHistory: "Execution history and trends",
    // --- COMPONENTE: RELEASE CONFIDENCE ---
    releaseConfTitle: "Release Confidence",
    refresh: "Refresh",
    notReady: "NOT READY FOR PRODUCTION",
    riskLevel: "RISK LEVEL",
    high: "HIGH",
    riskFactorsTitle: "RISK FACTORS",
    blockingFailuresTitle: "4 blocking test failures",
    blockingFailuresDesc: "Prevents production deployment",
    passRateTitle: "Pass rate at 60% (target: 90%+)",
    passRateDesc: "Low test coverage or quality issues",
    perfDegradedTitle: "Performance degraded 47%",
    perfDegradedDesc: "Slower test execution",
    flakyDetectedTitle: "2 flaky tests detected",
    flakyDetectedDesc: "Unpredictable test results",
    highVarianceTitle: "High variance in recent test results",
    highVarianceDesc: "Inconsistent quality signals",
    recommendationTitle: "RECOMMENDATION",
    recommendationDesc1: "Do not deploy to production until critical issues are resolved.",
    recommendationDesc2: "Est. time to green: 4-6 hours",
    lastSafeDeploy: "Last safe deploy: yesterday (run-003)",
    // --- NOVOS TEXTOS DA API (Release Confidence) ---
    noFailures: "No failures in last run",
    allTestsPassing: "All tests passing",
    excellentPassRate: "Excellent pass rate",
    highQualitySignal: "High quality signal",
    safeToDeploy: "Safe to deploy. All quality signals are green.",
    readyNow: "Ready now",
    today: "today",
    // --- FAILURE CLUSTERS ---
    failurePatterns: "Failure Patterns",
    patternDetected: "pattern detected",
    patternsDetected: "patterns detected",
    testWord: "test",
    testsWord: "tests",
    suggestedFix: "Suggested Fix:",
    // --- HEALTH SCORE ---
    stable: "Stable",
    primaryInsight: "Primary Insight",
    trend7Days: "Trend (7 days)",
    signals: "Signals",
    componentsTitle: "Components",
    stability: "Stability",
    performance: "Performance",
    recommendedActions: "Recommended Actions",
    // --- TEST STABILITY MAP ---
    testStabilityTitle: "Test Stability",
    totalTestsLabel: "total tests",
    stableTests: "Stable Tests",
    failingTests: "Failing Tests",
    flakyTestIndex: "Flaky Test Index:",
    // --- TEST RUNS LIST ---
    runId: "Run ID",
    browser: "Browser",
    environment: "Environment",
    started: "Started",
    // --- AI INSIGHTS ---
    engIntelligence: "Engineering Intelligence",
    runDiagnosticInfo: "Run automated diagnostic on",
    failedTestsText: "failed tests",
    toDetectPatterns: "to detect patterns and flakiness.",
    correlatingData: "Correlating execution data and identifying root causes...",
    confidenceLabel: "Confidence:",
    diagnosticEvidence: "DIAGNOSTIC EVIDENCE",
    techRecoveryPlan: "Technical Recovery Plan",
    reRunDiagnosticEngine: "Re-run Diagnostic Engine",
    connectionError: "Failed to reach Diagnostic Engine. Check if Ollama is running."
  },
  'pt-br': {
    home: "Início",
    dashboard: "Painel Geral",
    testRuns: "Execuções (Runs)",
    analytics: "Métricas",
    totalTests: "Total de Testes",
    passed: "Passaram",
    failed: "Falharam",
    duration: "Duração",
    runDiagnostic: "Gerar Diagnóstico com IA",
    reRunDiagnostic: "Refazer Diagnóstico com IA",
    status: "Status",
    testName: "Nome do Teste",
    file: "Arquivo",
    error: "Erro",
    // --- TELA HOME ---
    loadingDashboard: "Carregando painel...",
    engPlatform: "Plataforma de Inteligência de Engenharia",
    passRate: "Taxa de Sucesso",
    flakyTests: "Testes Instáveis",
    healthScore: "Saúde do Projeto",
    activeIssues: "Problemas Ativos",
    problemsDetected: "Problemas detectados automaticamente",
    testSuiteHealth: "Saúde da Suíte de Testes",
    qualityAssessment: "Avaliação de qualidade e insights",
    testStability: "Visão Geral de Estabilidade",
    riskDetection: "Detecção de risco e análise de testes instáveis",
    recentTestRuns: "Execuções Recentes",
    executionHistory: "Histórico de execução e tendências",
    // --- COMPONENTE: RELEASE CONFIDENCE ---
    releaseConfTitle: "Confiança do Release",
    refresh: "Atualizar",
    notReady: "NÃO PRONTO PARA PRODUÇÃO",
    riskLevel: "NÍVEL DE RISCO",
    high: "ALTO",
    riskFactorsTitle: "FATORES DE RISCO",
    blockingFailuresTitle: "4 falhas de testes bloqueantes",
    blockingFailuresDesc: "Impede o deploy no ambiente de produção",
    passRateTitle: "Taxa de sucesso em 60% (meta: 90%+)",
    passRateDesc: "Baixa cobertura de testes ou problemas de qualidade",
    perfDegradedTitle: "Performance degradada em 47%",
    perfDegradedDesc: "Execução de testes mais lenta",
    flakyDetectedTitle: "2 testes instáveis (flaky) detectados",
    flakyDetectedDesc: "Resultados de testes imprevisíveis",
    highVarianceTitle: "Alta variação nos resultados recentes",
    highVarianceDesc: "Sinais de qualidade inconsistentes",
    recommendationTitle: "RECOMENDAÇÃO",
    recommendationDesc1: "Não realize o deploy em produção até que as falhas críticas sejam resolvidas.",
    recommendationDesc2: "Tempo est. para resolução: 4-6 horas",
    lastSafeDeploy: "Último deploy seguro: ontem (run-003)",
    // --- NOVOS TEXTOS DA API (Release Confidence) ---
    noFailures: "Sem falhas na última execução",
    allTestsPassing: "Todos os testes passando",
    excellentPassRate: "Excelente taxa de sucesso",
    highQualitySignal: "Sinal de alta qualidade",
    safeToDeploy: "Deploy seguro. Todos os sinais de qualidade estão verdes.",
    readyNow: "Pronto agora",
    today: "hoje",
    // --- FAILURE CLUSTERS ---
    failurePatterns: "Padrões de Falha",
    patternDetected: "padrão detectado",
    patternsDetected: "padrões detectados",
    testWord: "teste",
    testsWord: "testes",
    suggestedFix: "Correção Sugerida:",
    // --- HEALTH SCORE ---
    stable: "Estável",
    primaryInsight: "Principal Insight",
    trend7Days: "Tendência (7 dias)",
    signals: "Sinais",
    componentsTitle: "Componentes",
    stability: "Estabilidade",
    performance: "Performance",
    recommendedActions: "Ações Recomendadas",
    // --- TEST STABILITY MAP ---
    testStabilityTitle: "Estabilidade dos Testes",
    totalTestsLabel: "total de testes",
    stableTests: "Testes Estáveis",
    failingTests: "Testes Falhando",
    flakyTestIndex: "Índice de Instabilidade (Flaky):",
    // --- TEST RUNS LIST ---
    runId: "ID da Execução",
    browser: "Navegador",
    environment: "Ambiente",
    started: "Início",
    // --- AI INSIGHTS ---
    engIntelligence: "Inteligência de Engenharia",
    runDiagnosticInfo: "Rodar diagnóstico automatizado em",
    failedTestsText: "testes com falha",
    toDetectPatterns: "para detectar padrões e instabilidade.",
    correlatingData: "Correlacionando dados de execução e identificando causas raízes...",
    confidenceLabel: "Confiança:",
    diagnosticEvidence: "EVIDÊNCIA DE DIAGNÓSTICO",
    techRecoveryPlan: "Plano de Recuperação Técnico",
    reRunDiagnosticEngine: "Refazer Diagnóstico com IA",
    connectionError: "Falha ao conectar com o Motor de Diagnóstico. Verifique se o Ollama está rodando."
  }
};

// 2. Criando o Contexto
const LanguageContext = createContext();

// 3. O Provedor (Quem abraça o site)
export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en'); // Começa em Inglês

  // Função mágica para pegar o texto certo
  const t = (key) => translations[language][key] || key;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// 4. Hook customizado para usar nos componentes
export const useLanguage = () => useContext(LanguageContext);