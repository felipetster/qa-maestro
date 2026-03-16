describe('Todo App - Critical Workflows (Failing Scenarios)', () => {

  beforeEach(() => {
    cy.wait(50); // Simula latência de rede
  });

  // 1. Teste que passa (para não ficar 100% vermelho e parecer mais real)
  it('Authentication: Should keep user logged in via valid JWT token', () => {
    cy.wait(200);
    expect(true).to.be.true;
  });

  // 2. Erro Clássico de UI: Elemento não encontrado (Timeout)
  it('UI Timing: Should display the success toast notification after saving', () => {
    cy.wait(150);
    // Simulando que o Cypress esperou pelo alerta de sucesso, mas ele não renderizou a tempo
    expect('.toast-success-message').to.contain('Task saved successfully');
  });

  // 3. Erro de Regra de Negócio: Cálculo de valores/estado incorreto
  it('Business Logic: Should calculate the remaining tasks counter correctly', () => {
    cy.wait(300);
    const expectedRemainingTasks = 5;
    const actualRemainingTasks = 4; // O sistema calculou errado
    
    expect(actualRemainingTasks, 'Mismatch in active tasks counter').to.equal(expectedRemainingTasks);
  });

  // 4. Teste que passa
  it('CRUD - Update: Should allow editing an existing task description', () => {
    cy.wait(250);
    expect('updated text').to.equal('updated text');
  });

  // 5. Erro de API: Integração com serviço externo falhou (503 Service Unavailable)
  it('API Integration: Should sync local tasks with the legacy backend system', () => {
    cy.wait(400);
    const apiResponseStatus = 503;
    const errorMessage = 'Service Unavailable - Legacy DB connection timed out';
    
    // Forçando o erro para simular a queda da API
    expect(apiResponseStatus, errorMessage).to.equal(200);
  });

  // 6. Teste demorado (Performance issue)
  it('Performance: Search filter should return results under 500ms', () => {
    cy.wait(850); // Passou do tempo aceitável
    expect(850).to.be.lessThan(500, 'Performance degradation detected on search input');
  });

});