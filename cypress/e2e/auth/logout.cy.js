describe('Authentication - Logout', () => {
  beforeEach(() => {
    cy.clearCookies()
    cy.clearLocalStorage()
    
    // Login first
    cy.fixture('users').then((users) => {
      cy.login(users.validUser.email, users.validUser.password)
    })
    
    cy.wait(2000)
    cy.visit('/')
    cy.wait(2000)
  })

  it('TC-003.1: should logout successfully', () => {
    // Assert on home
    cy.url().should('eq', Cypress.config().baseUrl + '/')
    
    // Navigate to account
    cy.get('div.self-center > a > svg').click({ force: true })
    cy.wait(2000)
    cy.get('h1').contains('My Account').should('be.visible')
    cy.url().should('include', '/account')
    
    // Logout
    cy.xpath("//a[normalize-space()='Logout']").click({ force: true })
    cy.wait(2000)
    
    // Assert redirect to home
    cy.url({ timeout: 10000 }).should('eq', Cypress.config().baseUrl + '/')
    
    // Verify logged out state when clicking account icon
    cy.get('div.self-center > a > svg').click({ force: true })
    cy.wait(2000)
    cy.url().should('include', '/account/login')
    cy.contains('Please sign in to your account').should('be.visible')
  })
})
