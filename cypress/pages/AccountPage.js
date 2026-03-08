import BasePage from './BasePage'

class AccountPage extends BasePage {
  // ─── Elements ──────────────────────────────────────────────────────
  get pageTitle()      { return cy.get('h1').contains('My Account') }
  get logoutLink()     { return cy.xpath("//a[normalize-space()='Logout']") }
  get recentOrders()   { return cy.xpath("//h2[normalize-space()='Recent Orders']") }

  // ─── Actions ───────────────────────────────────────────────────────
  assertOnAccountPage() {
    this.pageTitle.should('be.visible')
    this.assertUrl('/account')
  }

  logout() {
    this.logoutLink.click({ force: true })
  }

  verifyOrderExists(productName) {
    cy.xpath(`//div[normalize-space()='${productName}']`).should('exist')
  }

  verifyOrderId(orderId) {
    cy.xpath(`//span[normalize-space()='${orderId}']`).should('exist')
  }
}

export default new AccountPage()
