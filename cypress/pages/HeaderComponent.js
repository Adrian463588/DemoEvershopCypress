import BasePage from './BasePage'

class HeaderComponent extends BasePage {
  // ─── Elements ──────────────────────────────────────────────────────
  get accountIcon() { return cy.get('div.self-center > a > svg') }
  get searchIcon()  { return cy.get('a.search__icon > svg > circle') }
  get searchInput() { return cy.get('[placeholder="Search"]') }
  get cartIcon()    { return cy.get('.mini-cart-icon svg') }

  // ─── Actions ───────────────────────────────────────────────────────
  clickAccountIcon() {
    this.accountIcon.click({ force: true })
  }

  clickSearchIcon() {
    this.searchIcon.click({ force: true })
  }

  searchProduct(keyword) {
    this.clickSearchIcon()
    this.searchInput.should('be.visible').type(`${keyword}{enter}`, { force: true })
  }
}

export default new HeaderComponent()
