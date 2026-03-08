class BasePage {
  // ─── Common Elements ───────────────────────────────────────────────
  get toastMessage() { return cy.get('.Toastify__toast-body', { timeout: 10000 }) }

  // ─── Common Actions ────────────────────────────────────────────────
  visit(path = '/') {
    cy.visit(path)
  }

  scrollToBottom() {
    cy.scrollTo('bottom')
  }

  waitForPageLoad() {
    cy.document().its('readyState').should('eq', 'complete')
  }

  clearSession() {
    cy.clearCookies()
    cy.clearLocalStorage()
  }

  assertUrl(expectedPath) {
    cy.url({ timeout: 10000 }).should('include', expectedPath)
  }

  assertExactUrl(expectedUrl) {
    cy.url({ timeout: 10000 }).should('eq', expectedUrl)
  }
}

export default BasePage
