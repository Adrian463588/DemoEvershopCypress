describe('Authentication - Login', () => {
  beforeEach(() => {
    cy.clearCookies()
    cy.clearLocalStorage()
    cy.visit('/')
    cy.wait(1000)
  })

  it('TC-001.1: should login with valid credentials', () => {
    // Navigate to login
    cy.get('div.self-center > a > svg').click({ force: true })
    cy.wait(1000)
    
    // Assert on login page
    cy.url().should('include', '/account/login')
    cy.contains('Please sign in to your account').should('be.visible')
    
    // Fill credentials
    cy.fixture('users').then((users) => {
      cy.get('#field-email').type(users.validUser.email, { force: true })
      cy.wait(500)
      cy.get('#field-password').type(users.validUser.password, { force: true })
      cy.wait(500)
    })
    
    // Submit
    cy.contains('Sign In').click({ force: true })
    cy.wait(3000)
    
    // Wait for redirect to home
    cy.url({ timeout: 10000 }).should('eq', Cypress.config().baseUrl + '/')
    
    // Assert logged in
    cy.get('div.self-center > a > svg').click({ force: true })
    cy.wait(2000)
    cy.get('h1').contains('My Account').should('be.visible')
    cy.url().should('include', '/account')
  })

  it('TC-001.2: should display error message on invalid login', () => {
    // Navigate to login
    cy.get('div.self-center > a > svg').click({ force: true })
    cy.wait(1000)
    
    // Fill credentials
    cy.fixture('users').then((users) => {
      cy.get('#field-email').type(users.invalidUser.email, { force: true })
      cy.wait(500)
      cy.get('#field-password').type(users.invalidUser.password, { force: true })
      cy.wait(500)
    })
    
    // Submit
    cy.contains('Sign In').click({ force: true })
    cy.wait(1000)
    
    // Check validation error
    cy.xpath('//div[@data-slot="field-error"]').should('be.visible').and('contain.text', 'Password must be at least 6 characters long')
  })

  it('TC-001.3: should display toast error on invalid credentials', () => {
    // Navigate to login
    cy.get('div.self-center > a > svg').click({ force: true })
    cy.wait(1000)
    
    // Fill credentials
    cy.get('#field-email').type('newuser@gmail.com', { force: true })
    cy.wait(500)
    cy.get('#field-password').type('ValidPass12345454554', { force: true })
    cy.wait(500)
    
    // Submit
    cy.contains('Sign In').click({ force: true })
    cy.wait(2000)
    
    // Check validation error
    cy.get('.Toastify__toast-body', { timeout: 10000 }).should('have.text', 'Invalid email or password')
  })
})
