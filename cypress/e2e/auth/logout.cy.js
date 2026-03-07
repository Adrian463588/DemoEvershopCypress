describe('Authentication - Logout', () => {
  beforeEach(() => {
    cy.clearCookies()
    cy.clearLocalStorage()
    
    // Login first
    cy.fixture('users').then((users) => {
      cy.login(users.validUser.email, users.validUser.password)
    })
    
    cy.visit('/')
  })

  it('TC-003: should logout successfully', () => {
    // Assert on home
    cy.url().should('eq', Cypress.config().baseUrl + '/')
    
    // Navigate to account
    cy.get('div.self-center > a > svg').click()
    cy.get('h1').contains('My Account').should('be.visible')
    cy.url().should('include', '/account')
    
    // Logout
    cy.xpath("//a[normalize-space()='Logout']").click()
    
    // Assert redirect to home
    cy.url().should('eq', Cypress.config().baseUrl + '/')
    
    // Verify logged out state when clicking account icon
    cy.get('div.self-center > a > svg').click()
    cy.url().should('include', '/account/login')
    cy.contains('Please sign in to your account').should('be.visible')
  })
})
