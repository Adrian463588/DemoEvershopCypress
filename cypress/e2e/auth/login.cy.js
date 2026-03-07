describe('Authentication - Login', () => {
  beforeEach(() => {
    cy.clearCookies()
    cy.clearLocalStorage()
    cy.visit('/account/login')
  })

  it('TC-001: should login with valid credentials', () => {
    cy.fixture('users').then((users) => {
      // Implement login steps here
    })
  })
})
