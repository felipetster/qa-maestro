describe('QA Maestro - Task Manager Tests (AI Diagnostic Suite)', () => {
  
  beforeEach(() => {
    cy.visit('/');
  });

  // ✅ TESTE 1: Passa normalmente (Baseline)
  it('TC001 - Should load the application correctly', () => {
    cy.contains('QA Maestro').should('be.visible');
    cy.get('[data-cy="task-input"]').should('be.visible');
    cy.get('[data-cy="add-button"]').should('be.visible');
  });

  // ❌ TESTE 2: Falha por Timing / UI Issue (Timeout)
  // O que a IA deve detectar: Elemento não visível / UI_Timing
  it('TC002 - Should display a success toast after adding a task (Timing Issue)', () => {
    const newTask = 'Task to trigger timeout';
    cy.get('[data-cy="task-input"]').type(newTask);
    cy.get('[data-cy="add-button"]').click();
    
    // ERRO INTENCIONAL: O frontend não tem toast de sucesso implementado, 
    // forçando o Cypress a esperar 4 segundos e falhar por timeout de visibilidade.
    cy.get('[data-cy="toast-success-message"]', { timeout: 4000 }).should('be.visible');
  });

  // ❌ TESTE 3: Falha por Mutação de Seletor (DOM Mismatch)
  // O que a IA deve detectar: O seletor está errado ou o elemento sumiu
  it('TC003 - Should complete a task (Selector Mutation Issue)', () => {
    cy.get('[data-test="task-input"]').type('Task to complete{enter}'); // Erro intencional: data-test ao invés de data-cy
    
    // Como a linha de cima vai falhar, ele nem chega no resto, simulando um dev que mudou o atributo no HTML.
    cy.get('[data-cy="task-item"]').first().find('[data-cy="complete-checkbox"]').click();
  });

  // ❌ TESTE 4: Falha por Erro de Lógica / Estado (Assertion Error)
  // O que a IA deve detectar: Diferença entre o esperado (5) e o real (2) / Logic_Error
  it('TC004 - Should count tasks correctly (Logic Issue)', () => {
    // Adicionamos apenas 2 tarefas
    cy.get('[data-cy="task-input"]').type('Task 1');
    cy.get('[data-cy="add-button"]').click();
    cy.get('[data-cy="task-input"]').type('Task 2');
    cy.get('[data-cy="add-button"]').click();

    // ERRO INTENCIONAL: Vamos afirmar que existem 5 tarefas na lista, 
    // simulando um bug de cálculo de paginação ou filtro.
    cy.get('[data-cy="task-item"]').should('have.length', 5);
  });

});