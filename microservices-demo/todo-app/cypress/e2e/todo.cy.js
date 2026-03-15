describe('Sauce Demo - E2E AI Diagnostic Suite', () => {
  
  // Função auxiliar para fazer login rapidamente nos testes que exigem usuário logado
  const login = () => {
    cy.get('[data-test="username"]').type('standard_user');
    cy.get('[data-test="password"]').type('secret_sauce');
    cy.get('[data-test="login-button"]').click();
  };

  beforeEach(() => {
    // Aplicação real da Sauce Labs para automação
    cy.visit('https://www.saucedemo.com/');
  });

  // ✅ TC001: Passa - Verifica a renderização da tela de login
  it('TC001 - Should load the login page correctly', () => {
    cy.get('.login_logo').should('have.text', 'Swag Labs');
    cy.get('[data-test="username"]').should('be.visible');
    cy.get('[data-test="login-button"]').should('be.visible');
  });

  // ✅ TC002: Passa - Login com sucesso
  it('TC002 - Should login successfully with valid credentials', () => {
    login();
    cy.url().should('include', '/inventory.html');
    cy.get('.title').should('have.text', 'Products');
  });

  // ✅ TC003: Passa - Valida bloqueio de usuário
  it('TC003 - Should display error message for locked out user', () => {
    cy.get('[data-test="username"]').type('locked_out_user');
    cy.get('[data-test="password"]').type('secret_sauce');
    cy.get('[data-test="login-button"]').click();
    cy.get('[data-test="error"]').should('contain.text', 'Epic sadface: Sorry, this user has been locked out.');
  });

  // ✅ TC005: Passa - Adiciona item ao carrinho
  it('TC005 - Should add an item to the shopping cart', () => {
    login();
    cy.get('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    cy.get('.shopping_cart_badge').should('have.text', '1');
  });

  // ✅ TC006: Passa - Remove item do carrinho
  it('TC006 - Should remove an item from the shopping cart', () => {
    login();
    cy.get('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    cy.get('[data-test="remove-sauce-labs-backpack"]').click();
    cy.get('.shopping_cart_badge').should('not.exist');
  });

});