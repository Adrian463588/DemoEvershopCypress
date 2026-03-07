describe('Authentication - Forgot Password', () => {
  beforeEach(() => {
    cy.clearCookies()
    cy.clearLocalStorage()
    cy.visit('/')
  })

  it('TC-004: should verify forgot password flow and display error', () => {
    // Navigate to login
    cy.get('div.self-center > a > svg').click()
    cy.url().should('include', '/account/login')
    cy.contains('Please sign in to your account').should('be.visible')
    
    // Navigate to forgot password
    cy.get('a[href*="/account/reset-password"]').click()
    cy.url().should('include', '/account/reset-password')
    
    // Fill email
    cy.fixture('users').then((users) => {
      cy.get('[name="email"]').type(users.validUser.email)
    })
    
    // Submit
    cy.get('button[type="submit"]').click()

    // PASTI ERROR DARI SISTEM, DAN TIDAK BERHASIL 
    
    // Assert error toast for forgot password
    cy.get('.Toastify__toast-body').should('be.visible')
  })
})
