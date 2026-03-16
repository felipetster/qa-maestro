[Read in English](README.md)

# QA Maestro

> Plataforma de Inteligência de Engenharia para análise automatizada de testes e suporte a decisões de deploy

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Docker](https://img.shields.io/badge/docker-compose-2496ED?logo=docker&logoColor=white)](docker-compose.yml)
[![React](https://img.shields.io/badge/react-18.2-61DAFB?logo=react&logoColor=white)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/node.js-20-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Python](https://img.shields.io/badge/python-3.11-3776AB?logo=python&logoColor=white)](https://python.org/)

---

## Visão Geral

QA Maestro é uma Plataforma de Inteligência de Engenharia que transforma dados brutos de execução de testes em insights acionáveis para decisões de deploy. Construído como projeto de portfólio, demonstra padrões de arquitetura enterprise, integração com IA e práticas modernas de observabilidade.

A plataforma resolve um gargalo crítico no desenvolvimento de software: **análise de falhas em testes**. Em vez de revisar logs manualmente, o QA Maestro usa diagnósticos alimentados por IA para identificar causas raiz, detectar padrões e recomendar ações específicas de recuperação.

### Diferenciais Principais

- **Release Confidence Score**: Avaliação algorítmica de risco de deploy baseada em estabilidade de testes, taxa de aprovação e métricas de performance
- **AI Diagnostic Engine**: Análise de causa raiz alimentada por LLM com planos técnicos de recuperação
- **Detecção de Padrões**: Agrupamento automático de falhas por taxonomia de erros (UI timing, API state, selector mutations)
- **Mapeamento de Estabilidade**: Identificação visual de testes flaky vs. estáveis com cálculo do Índice de Testes Flaky
- **Interface Bilíngue**: Suporte nativo para Inglês e Português Brasileiro

---

## Arquitetura
```
┌─────────────────────────────────────────────────────────────┐
│                  PLATAFORMA QA MAESTRO                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐   ┌───────────────┐   ┌──────────────┐  │
│  │   Dashboard  │──▶│ Report Service│──▶│  AI Service  │  │
│  │   React 18   │   │  Express API  │   │   FastAPI    │  │
│  │   Porta 3000 │   │   Porta 3001  │   │  Porta 8000  │  │
│  └──────────────┘   └───────────────┘   └──────────────┘  │
│         │                   │                    │          │
│         │                   ▼                    ▼          │
│         │            ┌──────────────┐    ┌─────────────┐   │
│         │            │  PostgreSQL  │    │   Ollama    │   │
│         │            │  Porta 5432  │    │ Porta 11434 │   │
│         │            └──────────────┘    └─────────────┘   │
│         │                                                   │
│         ▼                                                   │
│  ┌──────────────┐   ┌──────────────┐                       │
│  │  Todo App    │──▶│   Cypress    │                       │
│  │  (SUT Demo)  │   │  Suite E2E   │                       │
│  │  Porta 5173  │   │  10 testes   │                       │
│  └──────────────┘   └──────────────┘                       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Stack Tecnológica

| Componente | Tecnologia | Propósito |
|-----------|-----------|---------|
| **Frontend** | React 18 + Vite | Dashboard UI com métricas em tempo real |
| **Report API** | Node.js + Express | Agregação de dados de testes e cálculo de métricas |
| **AI Service** | Python + FastAPI | Orquestração de LLM e engine de análise |
| **Database** | PostgreSQL 15 | Armazenamento persistente de runs e análises |
| **Modelo de IA** | Ollama (LLaMA 3.2 3B) | Inferência local para diagnósticos com custo efetivo |
| **Testes E2E** | Cypress 13 | Suite de testes de demonstração |
| **Orquestração** | Docker Compose | Deploy multi-serviço |

---

## Funcionalidades

### 1. Release Confidence Score
Cálculo algorítmico de prontidão para deploy baseado em:
- **Taxa de Aprovação** (peso 40%): Percentual de testes aprovados
- **Estabilidade** (peso 35%): Análise de variância entre runs recentes
- **Performance** (peso 25%): Detecção de regressão no tempo de execução

**Saída**: Score 0-100 com nível de risco (LOW/MEDIUM/HIGH/CRITICAL) e tempo estimado até o verde.

### 2. AI Diagnostic Engine
Alimentado por LLaMA 3.2 3B rodando localmente via Ollama:
- **Classificação de Falhas**: Categorização baseada em taxonomia (UI_Timing, API_State_Mismatch, Selector_Mutation, etc.)
- **Extração de Evidências**: Pontos de dados específicos que suportam o diagnóstico
- **Plano de Recuperação Técnico**: Instruções passo a passo de remediação
- **Confidence Scoring**: Avaliação probabilística da acurácia do diagnóstico

### 3. Mapa de Estabilidade de Testes
Representação visual da saúde da suite de testes:
- **Testes Estáveis**: Comportamento consistente de aprovação/falha
- **Testes Flaky**: Falhas intermitentes entre runs
- **Testes Falhando**: Falhas consistentes
- **Índice de Testes Flaky**: Métrica de risco baseada em percentual

### 4. Detecção de Padrões de Falha
Agrupamento automático de falhas por:
- Similaridade de mensagens de erro
- Padrões de arquivos de teste afetados
- Correlação temporal
- Correções sugeridas por cluster

### 5. Tendências de Performance
Análise histórica de execução de testes:
- Rastreamento de duração por run
- Alertas de degradação de performance
- Comparação com baseline

---

## Início Rápido

### Pré-requisitos
- **Docker Desktop** (com Docker Compose)
- **Ollama** rodando localmente ([guia de instalação](https://ollama.com))
- **Modelo LLaMA 3.2 3B** baixado: `ollama pull llama3.2:3b`

### Instalação
```bash
# 1. Clonar repositório
git clone https://github.com/felipetster/qa-maestro.git
cd qa-maestro

# 2. Iniciar todos os serviços
docker-compose up -d

# 3. Aguardar serviços ficarem prontos (30-60s)
docker-compose logs -f

# 4. Acessar dashboard
# http://localhost:3000
```

### Gerar Dados de Teste
```bash
# Executar suite E2E Cypress para popular dashboard
docker-compose run --rm cypress npx cypress run

# Isso cria uma nova run com ~30 test cases
```

### Endpoints dos Serviços
- **Dashboard**: http://localhost:3000
- **Report API**: http://localhost:3001/health
- **AI Service**: http://localhost:8000/health
- **App Demo**: http://localhost:5173

---

## Uso

### 1. Ver Release Confidence
Navegue para a página **Home** para ver o score atual de prontidão para deploy.

### 2. Analisar Test Runs
Vá para **Test Runs** para ver o histórico de execuções. Clique em qualquer run para ver resultados detalhados.

### 3. Gerar Análise de IA
Na página de detalhes de uma run com falhas, clique em **"Run Diagnostic"** para acionar análise de causa raiz alimentada por IA. A análise normalmente completa em 15-30 segundos na CPU.

### 4. Monitorar Estabilidade
O **Test Stability Map** mostra quais testes são confiáveis vs. flaky, ajudando a priorizar manutenção da suite de testes.

---

## Screenshots

### 1. Visão Executiva (Score de Confiança)
*Avaliação algorítmica de prontidão para deploy (Cenários de Aprovação vs. Bloqueio).*
![Release Confidence - Ready](assets/dashboard-home.png)
![Release Confidence - Not Ready](assets/dashboard-home-not-ready.png)

### 2. Motor de Diagnóstico com IA
*LLaMA 3.1 analisando falhas nos testes e gerando planos de recuperação técnicos.*
![AI Diagnostics](assets/dashboard-ai.png)

### 3. Estabilidade e Saúde dos Testes
*Detecção de testes flaky, histórico de execuções e monitoramento da saúde da suíte.*
![Test Stability Map](assets/dashboard-tests-stability-home.png)
![Test Suite Health](assets/dashboard-others-features-home.png)

### 4. Analytics Avançado
*Tendências de performance e comportamento dos testes ao longo do tempo.*
![Analytics](assets/dashboard-analytics.png)

## Configuração

### Variáveis de Ambiente
```bash
# Report Service
DATABASE_URL=postgresql://qauser:qapass123@postgres:5432/qa_maestro

# AI Service
OLLAMA_HOST=http://host.docker.internal:11434
OLLAMA_NUM_PARALLEL=4
```

### Ajuste de Performance do Ollama
```bash
# Otimizado para CPU (padrão)
ollama pull llama3.2:3b  # Inferência mais rápida

# Qualidade superior (mais lento)
ollama pull llama3.1:8b  # Análise melhor

# Atualizar ai-service/src/main.py para mudar o modelo
```

---

## Estrutura do Projeto
```
qa-maestro/
├── dashboard/              # Frontend React
│   ├── src/
│   │   ├── components/     # Componentes UI
│   │   ├── pages/          # Páginas de rota
│   │   └── styles/         # Módulos CSS
│   └── Dockerfile
├── report-service/         # API Node.js
│   ├── src/
│   │   ├── server.js       # App Express
│   │   └── db.js           # Cliente PostgreSQL
│   └── Dockerfile
├── ai-service/             # Engine de IA Python
│   ├── src/
│   │   └── main.py         # FastAPI + integração Ollama
│   └── Dockerfile
├── database/
│   └── init.sql            # Schema + dados seed
├── microservices-demo/
│   └── todo-app/           # Aplicação demo (SUT)
├── cypress/                # Suite de testes E2E
│   └── e2e/
│       └── todo.cy.js      # 10 test cases
├── docker-compose.yml      # Orquestração
└── README.md
```

---

## Solução de Problemas

### Dashboard mostra 0 para Release Confidence
```bash
# Verificar se database tem test runs
docker exec -it qa-maestro-db psql -U qauser -d qa_maestro \
  -c "SELECT COUNT(*) FROM test_runs;"

# Se count é 0, gerar dados
docker-compose run --rm cypress npx cypress run
```

### Análise de IA dá timeout
```bash
# Verificar se Ollama está rodando
curl http://localhost:11434/api/tags

# Verificar se modelo está carregado
ollama list

# Baixar modelo menor para inferência mais rápida
ollama pull llama3.2:1b
```

### Serviços não iniciam
```bash
# Reinício limpo
docker-compose down -v
docker-compose build --no-cache
docker-compose up -d

# Ver logs
docker-compose logs -f
```

---

## Roadmap de Desenvolvimento

- [ ] **Integração CI/CD**: Endpoints webhook para GitHub Actions / GitLab CI
- [ ] **Nomeação Customizada de Runs**: Labels definidos pelo usuário em vez de IDs auto-gerados
- [ ] **Tendências Históricas**: Gráficos de taxa de aprovação e estabilidade de 30 dias
- [ ] **Notificações Slack**: Alertas em tempo real para falhas críticas
- [ ] **Autenticação de API**: Controle de acesso baseado em JWT
- [ ] **Exportar Relatórios**: Geração de PDF para distribuição a stakeholders

---

## Roadmap de Desenvolvimento (Funcionalidades Futuras)

Como todo projeto de portfólio, o QA Maestro está em constante evolução. Os próximos passos incluem:

- [ ] **Tradução 100% Dinâmica**: Garantir que todas as respostas edge-case vindas do backend e IA sejam perfeitamente traduzidas sem depender de chaves estáticas.

- [ ] **Customização de Runs**: Permitir renomear "Test Runs" (ex: mudar de "run-001" para "Release v2.4 - Hotfix") para melhor organização.

- [ ] **Otimização de IA & Chunking**: Refinar prompt engineering e melhorar chunking de logs para evitar exceder o limite de tokens da IA durante falhas massivas em suites de teste.

- [ ] **Webhooks CI/CD**: Criar endpoints para receber payloads reais diretamente de workflows do GitHub Actions ou GitLab CI.

- [ ] **Tendências Históricas**: Gráficos de taxa de aprovação e estabilidade de 30 dias para rastreamento de longo prazo.

---

## Limitações Conhecidas

- **Suporte a GPU**: GPUs AMD não suportadas pelo Ollama no Windows (apenas inferência em CPU)
- **Tamanho do Modelo**: Modelos menores (3B parâmetros) sacrificam profundidade de análise por velocidade
- **Escala**: Otimizado para suites de teste pequenas a médias (<500 testes por run). Suites enterprise grandes requerem paginação e processamento de IA em chunks
- **Suporte a Idiomas**: Respostas da IA atualmente apenas em inglês (UI é bilíngue)

---

## Contribuindo

Este é um projeto de portfólio e não está buscando contribuições ativamente. No entanto, feedback e sugestões são bem-vindos via Issues.

---

## Licença

Licença MIT - veja arquivo [LICENSE](LICENSE) para detalhes.

---

## Autor

**Felipe Castro**  
Analista de QA | Engenheiro de Qualidade de Software

- GitHub: [@felipetster](https://github.com/felipetster)
- LinkedIn: [linkedin.com/in/felipetster](https://linkedin.com/in/felipetster)
- Email: felipe.c.lima1604@gmail.com

---

## Ferramentas

Construído com:
- [Ollama](https://ollama.com) para inferência local de LLM
- [Meta LLaMA](https://ai.meta.com/llama/) por modelos de linguagem open-source
- [Cypress](https://cypress.io) pelo framework de testes E2E
- [React](https://reactjs.org) e [Vite](https://vitejs.dev) pelas ferramentas de frontend

---

**Nota**: Este projeto é para fins de demonstração e portfólio. Não é destinado para uso em produção sem hardening adicional de segurança e testes de escalabilidade.
```
