import BasePage from './BasePage'

class HomePage extends BasePage {
  // ─── Elements ──────────────────────────────────────────────────────
  get homeLink() { return cy.contains('a', 'Home') }

  // ─── Actions ───────────────────────────────────────────────────────
  open() {
    this.visit('/')
  }

  clickProduct(productName) {
    cy.contains('h3', productName).scrollIntoView()
    cy.contains('h3', productName).click({ force: true })
  }

  clickViewCollection(categoryHref = '/accessories') {
    cy.get(`a[href="${categoryHref}"]`).contains('View Collection').click({ force: true })
  }

  navigateHome() {
    this.homeLink.click({ force: true })
  }
}

export default new HomePage()
