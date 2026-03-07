describe('Checkout - Guest Checkout', () => {
  beforeEach(() => {
    cy.clearCookies()
    cy.clearLocalStorage()
    cy.visit('/')
  })

  it('TC-003: should complete checkout process as guest', () => {
    // Implement guest checkout steps here
  })
})
