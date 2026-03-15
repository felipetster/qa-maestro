[Read in English](README.md)

# QA Maestro

O QA Maestro é uma plataforma de Inteligência de Engenharia voltada para Quality Assurance. Este é um projeto de portfólio pessoal que desenvolvi para explorar como podemos usar Inteligência Artificial (LLMs) e observabilidade para resolver um dos maiores gargalos do desenvolvimento de software: a análise de testes falhos.

### O que o projeto foi desenhado para fazer
A ideia central nasceu de uma dor real: ler logs de testes automatizados (como Cypress ou Selenium) é um processo lento e tedioso. Quando uma pipeline quebra, desenvolvedores e QAs gastam muito tempo tentando entender se a falha foi um bug real na aplicação, um teste instável (flaky) ou um problema de infraestrutura.

O QA Maestro foi projetado para atuar como uma camada de observabilidade acima dos testes executados. O objetivo é que a ferramenta leia os resultados brutos, calcule o nível de risco de um deploy (Release Confidence) e use Inteligência Artificial para não apenas dizer *onde* falhou, mas *por que* falhou e *como* corrigir.

### O que ele faz hoje
Atualmente, o projeto funciona como um painel completo (estilo Datadog/Vercel) construído com React, Node.js e um microsserviço em Python. As principais funcionalidades ativas são:

* **Motor de Diagnóstico com IA:** Integração com um modelo local (LLaMA 3.1 via Ollama) que analisa as mensagens de erro dos testes, agrupa padrões de falha e gera um Plano de Recuperação Técnico sugerindo o que deve ser consertado no código.
* **Release Confidence:** Um algoritmo que calcula a saúde da suíte de testes penalizando testes instáveis, falhas bloqueantes e degradação de performance.
* **Test Stability Map:** Mapeamento visual que separa testes estáveis de testes flaky (instáveis).
* **Design Técnico & Bilíngue:** Interface com design brutalista/técnico e suporte a internacionalização nativa (Inglês e Português do Brasil).

### Stack Tecnológico
* **Frontend:** React (Context API, Axios, tipografia JetBrains Mono para identidade de engenharia).
* **Backend:** Node.js (Express) para gerenciar as métricas e interfacear com o banco de dados.
* **AI Service:** Python (FastAPI) orquestrando chamadas ao Ollama (LLaMA 3.1) para processar os logs com prompts contextualizados.
* **Banco de Dados:** PostgreSQL para armazenar o histórico de execuções.

### O que vai ser melhorado no futuro (Roadmap)
Como todo projeto de portfólio, ele está em constante evolução. Os próximos passos para o QA Maestro incluem:

* **Tradução 100% dinâmica:** Garantir que todas as respostas vindas do backend e da IA sejam perfeitamente traduzidas de acordo com a preferência do usuário.
* **Customização de Execuções:** Permitir a renomeação das "Test Runs" (ex: mudar de "run-001" para "Release v2.4 - Checkout Fix") para melhor organização.
* **Otimização da Inteligência Artificial:** Refinar o prompt engineering, testar modelos mais leves/rápidos e melhorar o particionamento dos logs para não estourar o limite de tokens da IA durante falhas muito grandes.
* **Webhooks CI/CD:** Criar rotas para receber payloads reais direto do GitHub Actions ou GitLab CI sempre que uma pipeline terminar.
